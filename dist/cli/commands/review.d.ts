import { BaseCommand, type CommandOptions } from './base.js';
import type { CommandResult } from '../../types/state.js';
export declare class ReviewCommand extends BaseCommand {
    constructor(cwd: string, options?: CommandOptions);
    execute(): Promise<CommandResult>;
    private checkGit;
    private assessRisks;
    private getNextSteps;
}
//# sourceMappingURL=review.d.ts.map