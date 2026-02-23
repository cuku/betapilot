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
exports.isGitRepo = isGitRepo;
exports.getGitStatus = getGitStatus;
exports.getGitDiff = getGitDiff;
exports.createBranch = createBranch;
exports.applyPatch = applyPatch;
exports.stageFiles = stageFiles;
const child_process_1 = require("child_process");
const util_1 = require("util");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function isGitRepo(cwd) {
    try {
        await execAsync('git rev-parse --git-dir', { cwd });
        return true;
    }
    catch {
        return false;
    }
}
async function getGitStatus(cwd) {
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
            modified: [],
            staged: [],
            untracked: [],
        };
        for (const line of statusStdout.split('\n').filter(Boolean)) {
            const status = line.substring(0, 2);
            const filePath = line.substring(3);
            if (status.includes('M'))
                files.modified.push(filePath);
            if (status.includes('A'))
                files.staged.push(filePath);
            if (status === '??')
                files.untracked.push(filePath);
        }
        return { isRepo: true, branch, files };
    }
    catch {
        return {
            isRepo: true,
            files: { modified: [], staged: [], untracked: [] },
        };
    }
}
async function getGitDiff(cwd, filePath) {
    const isRepo = await isGitRepo(cwd);
    if (!isRepo) {
        return { files: [], totalAdditions: 0, totalDeletions: 0 };
    }
    try {
        const args = filePath ? `git diff ${filePath}` : 'git diff';
        const { stdout } = await execAsync(args, { cwd });
        const diff = {
            files: [],
            totalAdditions: 0,
            totalDeletions: 0,
        };
        const fileDiffs = stdout.split(/^diff --git/m).filter(Boolean);
        for (const fileDiff of fileDiffs) {
            const pathMatch = fileDiff.match(/^diff --git a\/(.+?) b\/(.+)$/m);
            if (!pathMatch)
                continue;
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
    }
    catch {
        return { files: [], totalAdditions: 0, totalDeletions: 0 };
    }
}
async function createBranch(cwd, branchName) {
    try {
        await execAsync(`git checkout -b ${branchName}`, { cwd });
        return { success: true, message: `Created and switched to branch: ${branchName}` };
    }
    catch (error) {
        return {
            success: false,
            message: 'Failed to create branch',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
async function applyPatch(cwd, patchContent) {
    try {
        const patchFile = path.join(cwd, '.pilot_temp.patch');
        await fs.writeFile(patchFile, patchContent, 'utf-8');
        await execAsync(`git apply ${patchFile}`, { cwd });
        await fs.unlink(patchFile);
        return { success: true, message: 'Patch applied successfully' };
    }
    catch (error) {
        return {
            success: false,
            message: 'Failed to apply patch',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
async function stageFiles(cwd, files) {
    if (files.length === 0) {
        return { success: true, message: 'No files to stage' };
    }
    try {
        await execAsync(`git add ${files.join(' ')}`, { cwd });
        return { success: true, message: `Staged ${files.length} file(s)` };
    }
    catch (error) {
        return {
            success: false,
            message: 'Failed to stage files',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
//# sourceMappingURL=git.js.map