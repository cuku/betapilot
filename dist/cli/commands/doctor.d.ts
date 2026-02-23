import { BaseCommand, type CommandOptions } from './base.js';
import type { CommandResult } from '../../types/state.js';
export declare class DoctorCommand extends BaseCommand {
    constructor(cwd: string, options?: CommandOptions);
    execute(): Promise<CommandResult>;
    private checkNode;
    private checkGit;
    private checkApiKey;
    private checkConfig;
    private printCheck;
}
//# sourceMappingURL=doctor.d.ts.map