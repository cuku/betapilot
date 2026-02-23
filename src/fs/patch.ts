import * as diff from 'diff';
import * as fs from 'fs/promises';
import * as path from 'path';
import type { PatchInfo } from '../types/state.js';

export function generateDiff(
  originalContent: string,
  newContent: string,
  filePath: string
): string {
  const changes = diff.diffLines(originalContent, newContent);
  const lines: string[] = [];
  
  lines.push(`--- a/${filePath}`);
  lines.push(`+++ b/${filePath}`);
  
  for (const change of changes) {
    const prefix = change.added ? '+' : change.removed ? '-' : ' ';
    const content = change.value.split('\n').filter((_, i, arr) => 
      i < arr.length - 1 || change.value.slice(-1) !== '\n'
    );
    
    for (const line of content) {
      lines.push(`${prefix}${line}`);
    }
  }
  
  return lines.join('\n');
}

export function parsePatch(patchContent: string): PatchInfo[] {
  const patches: PatchInfo[] = [];
  const fileRegex = /^\+\+\+ b\/(.+)$/m;
  const hunkRegex = /^@@ .+ @@$/m;
  
  const fileMatches = patchContent.split(/^@@ .+ @@$/m);
  const hunkMatches = patchContent.match(/^@@ .+ @@$/gm) || [];
  
  for (let i = 1; i < fileMatches.length; i++) {
    const fileMatch = patchContent.match(fileRegex);
    if (!fileMatch) continue;
    
    const filePath = fileMatch[1];
    const hunkContent = fileMatches[i];
    
    const addedLines = hunkContent.split('\n')
      .filter(line => line.startsWith('+') && !line.startsWith('+++'))
      .map(line => line.substring(1));
    
    const removedLines = hunkContent.split('\n')
      .filter(line => line.startsWith('-') && !line.startsWith('---'))
      .map(line => line.substring(1));
    
    const originalContent = removedLines.join('\n');
    const newContent = addedLines.join('\n');
    
    patches.push({
      filePath,
      originalContent,
      newContent,
      diff: hunkContent,
    });
  }
  
  return patches;
}

export async function applyPatch(
  filePath: string,
  patchContent: string,
  dryRun: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentContent = await fs.readFile(filePath, 'utf-8').catch(() => '');
    const patchedContent = applyPatchToContent(currentContent, patchContent);
    
    if (dryRun) {
      return { success: true };
    }
    
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, patchedContent, 'utf-8');
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

function applyPatchToContent(original: string, patch: string): string {
  const lines = original.split('\n');
  const result: string[] = [];
  
  const patchLines = patch.split('\n');
  let lineIndex = 0;
  
  for (const patchLine of patchLines) {
    if (patchLine.startsWith('@@')) {
      continue;
    }
    
    if (patchLine.startsWith('+++') || patchLine.startsWith('---')) {
      continue;
    }
    
    if (patchLine.startsWith('+')) {
      result.push(patchLine.substring(1));
    } else if (patchLine.startsWith('-')) {
      lineIndex++;
    } else if (patchLine.length > 0) {
      result.push(patchLine);
      lineIndex++;
    }
  }
  
  return result.join('\n');
}

export function createPatchInfo(
  filePath: string,
  originalContent: string,
  newContent: string
): PatchInfo {
  return {
    filePath,
    originalContent,
    newContent,
    diff: generateDiff(originalContent, newContent, filePath),
  };
}
