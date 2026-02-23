import { type PilotConfig } from '../types/config.js';
export declare const PILOT_DIR = ".pilot";
export declare const CONFIG_FILE = "config.json";
export declare const SPEC_FILE = "spec.md";
export declare const PLAN_FILE = "plan.md";
export declare const RUNLOG_FILE = "runlog.md";
export declare const CONTEXT_FILE = "context.md";
export declare const STATE_FILE = "state.json";
export declare function getPilotDir(cwd: string): string;
export declare function getPilotFilePath(cwd: string, filename: string): string;
export declare function ensurePilotDir(cwd: string): Promise<string>;
export declare function pilotDirExists(cwd: string): Promise<boolean>;
export declare function loadConfig(cwd: string): Promise<PilotConfig>;
export declare function saveConfig(cwd: string, config: PilotConfig): Promise<void>;
export declare function initPilotDir(cwd: string): Promise<string>;
//# sourceMappingURL=pilot-dir.d.ts.map