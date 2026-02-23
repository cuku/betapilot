import type { CommandResult } from '../types/state.js';
export interface ShellOptions {
    cwd?: string;
    env?: Record<string, string>;
    timeout?: number;
}
export declare function executeCommand(command: string, options?: ShellOptions): Promise<CommandResult>;
export declare function isCommandAllowed(command: string, allowList: string[], denyList: string[]): {
    allowed: boolean;
    reason?: string;
};
export declare function safeExecute(command: string, allowList: string[], denyList: string[], options?: ShellOptions): Promise<CommandResult>;
//# sourceMappingURL=shell.d.ts.map