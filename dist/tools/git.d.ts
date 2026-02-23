import type { CommandResult } from '../types/state.js';
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
export declare function isGitRepo(cwd: string): Promise<boolean>;
export declare function getGitStatus(cwd: string): Promise<GitStatus>;
export declare function getGitDiff(cwd: string, filePath?: string): Promise<GitDiff>;
export declare function createBranch(cwd: string, branchName: string): Promise<CommandResult>;
export declare function applyPatch(cwd: string, patchContent: string): Promise<CommandResult>;
export declare function stageFiles(cwd: string, files: string[]): Promise<CommandResult>;
//# sourceMappingURL=git.d.ts.map