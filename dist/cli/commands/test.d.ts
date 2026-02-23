import { BaseCommand, type CommandOptions } from './base.js';
import type { CommandResult } from '../../types/state.js';
export declare class TestCommand extends BaseCommand {
    constructor(cwd: string, options?: CommandOptions);
    execute(): Promise<CommandResult>;
}
export declare class LintCommand extends BaseCommand {
    constructor(cwd: string, options?: CommandOptions);
    execute(): Promise<CommandResult>;
}
//# sourceMappingURL=test.d.ts.map