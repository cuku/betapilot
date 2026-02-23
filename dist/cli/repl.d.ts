import type { CommandOptions } from './commands/base.js';
export declare class REPL {
    private rl;
    private cwd;
    private options;
    private running;
    constructor(cwd: string, options?: CommandOptions);
    start(): Promise<void>;
    private prompt;
    private processInput;
    private suggestCommand;
    private executeCommand;
    stop(): void;
}
//# sourceMappingURL=repl.d.ts.map