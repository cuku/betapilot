import { BaseCommand, type CommandOptions } from './base.js';
import { TestRunner, LintRunner } from '../../tools/runner.js';
import type { CommandResult } from '../../types/state.js';

export class TestCommand extends BaseCommand {
  constructor(cwd: string, options: CommandOptions = {}) {
    super(cwd, options);
  }

  async execute(): Promise<CommandResult> {
    this.startSpinner('Initializing...');

    try {
      const context = await this.initContext();
      this.stopSpinner(true, 'Initialized');

      this.info(`Running tests with command: ${context.config.testCommand}\n`);

      const testRunner = new TestRunner(context.config, this.cwd);
      
      this.startSpinner('Running tests...');
      const result = await testRunner.run();

      if (result.passed) {
        this.stopSpinner(true, 'Tests passed');
        this.success(`\n✓ Tests passed (${result.duration}ms)`);
      } else {
        this.stopSpinner(false, 'Tests failed');
        this.error(`\n✗ Tests failed`);
      }

      if (result.output) {
        this.info('\n--- Test Output ---');
        console.log(result.output.slice(0, 1000));
        if (result.output.length > 1000) {
          this.info('... (output truncated)');
        }
      }

      return {
        success: result.passed,
        message: result.passed ? 'Tests passed' : 'Tests failed',
        data: result,
      };
    } catch (error) {
      this.stopSpinner(false, 'Error');
      return {
        success: false,
        message: 'Test command failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export class LintCommand extends BaseCommand {
  constructor(cwd: string, options: CommandOptions = {}) {
    super(cwd, options);
  }

  async execute(): Promise<CommandResult> {
    this.startSpinner('Initializing...');

    try {
      const context = await this.initContext();
      this.stopSpinner(true, 'Initialized');

      if (!context.config.lintCommand) {
        this.warn('No lint command configured. Add lintCommand to .pilot/config.json');
        return { success: true, message: 'No lint command configured' };
      }

      this.info(`Running lint with command: ${context.config.lintCommand}\n`);

      const lintRunner = new LintRunner(context.config, this.cwd);
      
      this.startSpinner('Running lint...');
      const result = await lintRunner.run();

      if (result.passed) {
        this.stopSpinner(true, 'Lint passed');
        this.success(`\n✓ Lint passed (${result.duration}ms)`);
      } else {
        this.stopSpinner(false, 'Lint issues found');
        this.error(`\n✗ Lint found issues`);
      }

      if (result.output) {
        this.info('\n--- Lint Output ---');
        console.log(result.output.slice(0, 1000));
      }

      return {
        success: result.passed,
        message: result.passed ? 'Lint passed' : 'Lint found issues',
        data: result,
      };
    } catch (error) {
      this.stopSpinner(false, 'Error');
      return {
        success: false,
        message: 'Lint command failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
