import type { TestResult } from '../types/state.js';
import type { PilotConfig } from '../types/config.js';
export declare class TestRunner {
    private config;
    private cwd;
    constructor(config: PilotConfig, cwd: string);
    run(): Promise<TestResult>;
}
export declare class LintRunner {
    private config;
    private cwd;
    constructor(config: PilotConfig, cwd: string);
    run(): Promise<TestResult>;
}
export declare class BuildRunner {
    private config;
    private cwd;
    constructor(config: PilotConfig, cwd: string);
    run(): Promise<TestResult>;
}
export declare class DeployRunner {
    private config;
    private cwd;
    constructor(config: PilotConfig, cwd: string);
    run(): Promise<TestResult>;
    getChecklist(): string[];
}
//# sourceMappingURL=runner.d.ts.map