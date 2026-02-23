"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDiff = generateDiff;
exports.parsePatch = parsePatch;
exports.applyPatch = applyPatch;
exports.createPatchInfo = createPatchInfo;
const diff = __importStar(require("diff"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
function generateDiff(originalContent, newContent, filePath) {
    const changes = diff.diffLines(originalContent, newContent);
    const lines = [];
    lines.push(`--- a/${filePath}`);
    lines.push(`+++ b/${filePath}`);
    for (const change of changes) {
        const prefix = change.added ? '+' : change.removed ? '-' : ' ';
        const content = change.value.split('\n').filter((_, i, arr) => i < arr.length - 1 || change.value.slice(-1) !== '\n');
        for (const line of content) {
            lines.push(`${prefix}${line}`);
        }
    }
    return lines.join('\n');
}
function parsePatch(patchContent) {
    const patches = [];
    const fileRegex = /^\+\+\+ b\/(.+)$/m;
    const hunkRegex = /^@@ .+ @@$/m;
    const fileMatches = patchContent.split(/^@@ .+ @@$/m);
    const hunkMatches = patchContent.match(/^@@ .+ @@$/gm) || [];
    for (let i = 1; i < fileMatches.length; i++) {
        const fileMatch = patchContent.match(fileRegex);
        if (!fileMatch)
            continue;
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
async function applyPatch(filePath, patchContent, dryRun = false) {
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
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
function applyPatchToContent(original, patch) {
    const lines = original.split('\n');
    const result = [];
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
        }
        else if (patchLine.startsWith('-')) {
            lineIndex++;
        }
        else if (patchLine.length > 0) {
            result.push(patchLine);
            lineIndex++;
        }
    }
    return result.join('\n');
}
function createPatchInfo(filePath, originalContent, newContent) {
    return {
        filePath,
        originalContent,
        newContent,
        diff: generateDiff(originalContent, newContent, filePath),
    };
}
//# sourceMappingURL=patch.js.map