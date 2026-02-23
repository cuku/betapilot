import { safeExecute } from './shell.js';
import type { TestResult } from '../types/state.js';
import type { PilotConfig } from '../types/config.js';

export class TestRunner {
  private config: PilotConfig;
  private cwd: string;

  constructor(config: PilotConfig, cwd: string) {
    this.config = config;
    this.cwd = cwd;
  }

  async run(): Promise<TestResult> {
    const command = this.config.testCommand;
    if (!command) {
      return {
        passed: false,
        command: '',
        output: 'No test command configured',
        exitCode: -1,
      };
    }

    const startTime = Date.now();
    const result = await safeExecute(
      command,
      this.config.allowShellCommands,
      this.config.denyShellCommands,
      { cwd: this.cwd }
    );

    return {
      passed: result.success,
      command,
      output: result.data ? (result.data as { stdout?: string; stderr?: string }).stdout || '' : result.error || '',
      exitCode: result.success ? 0 : 1,
      duration: Date.now() - startTime,
    };
  }
}

export class LintRunner {
  private config: PilotConfig;
  private cwd: string;

  constructor(config: PilotConfig, cwd: string) {
    this.config = config;
    this.cwd = cwd;
  }

  async run(): Promise<TestResult> {
    const command = this.config.lintCommand;
    if (!command) {
      return {
        passed: true,
        command: '',
        output: 'No lint command configured',
        exitCode: 0,
      };
    }

    const startTime = Date.now();
    const result = await safeExecute(
      command,
      this.config.allowShellCommands,
      this.config.denyShellCommands,
      { cwd: this.cwd }
    );

    return {
      passed: result.success,
      command,
      output: result.data ? (result.data as { stdout?: string; stderr?: string }).stdout || '' : result.error || '',
      exitCode: result.success ? 0 : 1,
      duration: Date.now() - startTime,
    };
  }
}

export class BuildRunner {
  private config: PilotConfig;
  private cwd: string;

  constructor(config: PilotConfig, cwd: string) {
    this.config = config;
    this.cwd = cwd;
  }

  async run(): Promise<TestResult> {
    const command = this.config.buildCommand;
    if (!command) {
      return {
        passed: false,
        command: '',
        output: 'No build command configured',
        exitCode: -1,
      };
    }

    const startTime = Date.now();
    const result = await safeExecute(
      command,
      this.config.allowShellCommands,
      this.config.denyShellCommands,
      { cwd: this.cwd }
    );

    return {
      passed: result.success,
      command,
      output: result.data ? (result.data as { stdout?: string; stderr?: string }).stdout || '' : result.error || '',
      exitCode: result.success ? 0 : 1,
      duration: Date.now() - startTime,
    };
  }
}

export class DeployRunner {
  private config: PilotConfig;
  private cwd: string;

  constructor(config: PilotConfig, cwd: string) {
    this.config = config;
    this.cwd = cwd;
  }

  async run(): Promise<TestResult> {
    const command = this.config.deployCommand;
    if (!command) {
      return {
        passed: true,
        command: '',
        output: 'No deploy command configured. Add one to .pilot/config.json',
        exitCode: 0,
      };
    }

    const startTime = Date.now();
    const result = await safeExecute(
      command,
      this.config.allowShellCommands,
      this.config.denyShellCommands,
      { cwd: this.cwd }
    );

    return {
      passed: result.success,
      command,
      output: result.data ? (result.data as { stdout?: string; stderr?: string }).stdout || '' : result.error || '',
      exitCode: result.success ? 0 : 1,
      duration: Date.now() - startTime,
    };
  }

  getChecklist(): string[] {
    return [
      'All tests passing',
      'Code reviewed and approved',
      'Build succeeds without errors',
      'No security vulnerabilities detected',
      'Documentation updated if needed',
      'Version bumped if applicable',
      'Changelog updated',
      'Deployment environment ready',
    ];
  }
}
