import { BaseCommand, type CommandOptions } from './base.js';
import type { CommandResult } from '../../types/state.js';
export declare class DeployCommand extends BaseCommand {
    constructor(cwd: string, options?: CommandOptions);
    execute(): Promise<CommandResult>;
}
//# sourceMappingURL=deploy.d.ts.map