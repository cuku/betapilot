import { BaseCommand, type CommandOptions } from './base.js';
import type { CommandResult } from '../../types/state.js';
export declare class ImplementCommand extends BaseCommand {
    constructor(cwd: string, options?: CommandOptions);
    execute(): Promise<CommandResult>;
    private parsePlanSteps;
    private formatDiff;
    private confirmApply;
    private applyDiffs;
}
//# sourceMappingURL=implement.d.ts.map