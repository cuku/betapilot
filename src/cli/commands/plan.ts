import { BaseCommand, type CommandOptions } from './base.js';
import { readFile } from '../../fs/file-ops.js';
import type { CommandResult } from '../../types/state.js';

export class PlanCommand extends BaseCommand {
  constructor(cwd: string, options: CommandOptions = {}) {
    super(cwd, options);
  }

  async execute(): Promise<CommandResult> {
    this.startSpinner('Initializing...');

    try {
      const context = await this.initContext();
      const orchestrator = await this.createOrchestrator(context);
      this.stopSpinner(true, 'Initialized');

      const spec = await readFile(context.specPath);
      
      if (!spec || spec.trim().length === 0) {
        this.error('No specification found. Please run /spec first.');
        return {
          success: false,
          message: 'No specification found',
          error: 'Run /spec to create a specification first',
        };
      }

      this.info('Creating implementation plan from specification...\n');

      this.startSpinner('Generating plan...');
      const result = await orchestrator.generatePlan();

      if (result.success) {
        this.stopSpinner(true, 'Plan created');
        this.success(`\nSaved to: ${context.planPath}`);
        
        if (!this.options.dryRun) {
          this.info('\nNext steps:');
          this.info('  1. Run /implement to start implementing');
        } else {
          this.info('\n(Dry run mode - no files written)');
        }
      } else {
        this.stopSpinner(false, 'Failed to create plan');
        this.error(result.error || 'Unknown error');
      }

      return result;
    } catch (error) {
      this.stopSpinner(false, 'Error');
      return {
        success: false,
        message: 'Plan command failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
