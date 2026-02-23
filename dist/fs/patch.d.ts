import type { PatchInfo } from '../types/state.js';
export declare function generateDiff(originalContent: string, newContent: string, filePath: string): string;
export declare function parsePatch(patchContent: string): PatchInfo[];
export declare function applyPatch(filePath: string, patchContent: string, dryRun?: boolean): Promise<{
    success: boolean;
    error?: string;
}>;
export declare function createPatchInfo(filePath: string, originalContent: string, newContent: string): PatchInfo;
//# sourceMappingURL=patch.d.ts.map