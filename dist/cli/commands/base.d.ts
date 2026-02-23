import ora from 'ora';
import { Orchestrator } from '../../core/orchestrator.js';
import type { PilotContext } from '../../types/config.js';
import type { CommandResult } from '../../types/state.js';
export interface CommandOptions {
    verbose?: boolean;
    dryRun?: boolean;
    yes?: boolean;
    force?: boolean;
}
export declare abstract class BaseCommand {
    protected spinner: ReturnType<typeof ora> | null;
    protected cwd: string;
    protected options: CommandOptions;
    constructor(cwd: string, options?: CommandOptions);
    protected initContext(): Promise<PilotContext>;
    protected createOrchestrator(context: PilotContext): Promise<Orchestrator>;
    protected startSpinner(text: string): void;
    protected stopSpinner(success: boolean, text?: string): void;
    protected log(message: string, color?: string): void;
    protected error(message: string): void;
    protected success(message: string): void;
    protected warn(message: string): void;
    protected info(message: string): void;
    abstract execute(): Promise<CommandResult>;
}
//# sourceMappingURL=base.d.ts.map