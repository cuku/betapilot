import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import type { CommandResult } from '../types/state.js';

const execAsync = promisify(exec);

export interface GitStatus {
  isRepo: boolean;
  branch?: string;
  files: {
    modified: string[];
    staged: string[];
    untracked: string[];
  };
}

export interface GitDiff {
  files: {
    path: string;
    additions: number;
    deletions: number;
    patch: string;
  }[];
  totalAdditions: number;
  totalDeletions: number;
}

export async function isGitRepo(cwd: string): Promise<boolean> {
  try {
    await execAsync('git rev-parse --git-dir', { cwd });
    return true;
  } catch {
    return false;
  }
}

export async function getGitStatus(cwd: string): Promise<GitStatus> {
  const isRepo = await isGitRepo(cwd);
  
  if (!isRepo) {
    return {
      isRepo: false,
      files: { modified: [], staged: [], untracked: [] },
    };
  }

  try {
    const { stdout: branchStdout } = await execAsync('git branch --show-current', { cwd });
    const branch = branchStdout.trim();
    
    const { stdout: statusStdout } = await execAsync('git status --porcelain', { cwd });
    
    const files = {
      modified: [] as string[],
      staged: [] as string[],
      untracked: [] as string[],
    };
    
    for (const line of statusStdout.split('\n').filter(Boolean)) {
      const status = line.substring(0, 2);
      const filePath = line.substring(3);
      
      if (status.includes('M')) files.modified.push(filePath);
      if (status.includes('A')) files.staged.push(filePath);
      if (status === '??') files.untracked.push(filePath);
    }
    
    return { isRepo: true, branch, files };
  } catch {
    return {
      isRepo: true,
      files: { modified: [], staged: [], untracked: [] },
    };
  }
}

export async function getGitDiff(cwd: string, filePath?: string): Promise<GitDiff> {
  const isRepo = await isGitRepo(cwd);
  if (!isRepo) {
    return { files: [], totalAdditions: 0, totalDeletions: 0 };
  }

  try {
    const args = filePath ? `git diff ${filePath}` : 'git diff';
    const { stdout } = await execAsync(args, { cwd });
    
    const diff: GitDiff = {
      files: [],
      totalAdditions: 0,
      totalDeletions: 0,
    };
    
    const fileDiffs = stdout.split(/^diff --git/m).filter(Boolean);
    
    for (const fileDiff of fileDiffs) {
      const pathMatch = fileDiff.match(/^diff --git a\/(.+?) b\/(.+)$/m);
      if (!pathMatch) continue;
      
      const filePath = pathMatch[2];
      const additions = (fileDiff.match(/^\+/gm) || []).length - 1;
      const deletions = (fileDiff.match(/^-/gm) || []).length - 1;
      
      diff.files.push({
        path: filePath,
        additions,
        deletions,
        patch: fileDiff,
      });
      
      diff.totalAdditions += additions;
      diff.totalDeletions += deletions;
    }
    
    return diff;
  } catch {
    return { files: [], totalAdditions: 0, totalDeletions: 0 };
  }
}

export async function createBranch(cwd: string, branchName: string): Promise<CommandResult> {
  try {
    await execAsync(`git checkout -b ${branchName}`, { cwd });
    return { success: true, message: `Created and switched to branch: ${branchName}` };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create branch',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function applyPatch(cwd: string, patchContent: string): Promise<CommandResult> {
  try {
    const patchFile = path.join(cwd, '.pilot_temp.patch');
    await fs.writeFile(patchFile, patchContent, 'utf-8');
    
    await execAsync(`git apply ${patchFile}`, { cwd });
    await fs.unlink(patchFile);
    
    return { success: true, message: 'Patch applied successfully' };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to apply patch',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function stageFiles(cwd: string, files: string[]): Promise<CommandResult> {
  if (files.length === 0) {
    return { success: true, message: 'No files to stage' };
  }
  
  try {
    await execAsync(`git add ${files.join(' ')}`, { cwd });
    return { success: true, message: `Staged ${files.length} file(s)` };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to stage files',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
