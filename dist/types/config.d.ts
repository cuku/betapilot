export interface PilotConfig {
    provider: 'anthropic' | 'openai' | 'mock';
    model: string;
    allowShellCommands: string[];
    denyShellCommands: string[];
    testCommand: string;
    lintCommand: string;
    buildCommand: string;
    deployCommand: string;
    dryRunDefault: boolean;
    verbose: boolean;
    branchPrefix: string;
}
export interface ToolConfig {
    name: string;
    command: string;
    args?: string[];
    env?: Record<string, string>;
}
export interface PilotContext {
    cwd: string;
    pilotDir: string;
    config: PilotConfig;
    specPath: string;
    planPath: string;
    runlogPath: string;
    contextPath: string;
}
export declare const DEFAULT_CONFIG: PilotConfig;
//# sourceMappingURL=config.d.ts.map