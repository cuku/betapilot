import inquirer from 'inquirer';
import { BaseCommand, type CommandOptions } from './base.js';
import type { CommandResult } from '../../types/state.js';

export class SpecCommand extends BaseCommand {
  constructor(cwd: string, options: CommandOptions = {}) {
    super(cwd, options);
  }

  async execute(): Promise<CommandResult> {
    this.startSpinner('Initializing...');

    try {
      const context = await this.initContext();
      const orchestrator = await this.createOrchestrator(context);
      this.stopSpinner(true, 'Initialized');

      this.info('Let\'s create a specification for your project.');
      this.info('Please answer the following questions:\n');

      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Project name:',
          default: 'My Project',
        },
        {
          type: 'input',
          name: 'overview',
          message: 'Brief project overview:',
        },
        {
          type: 'input',
          name: 'requirements',
          message: 'What are the main requirements? (comma-separated)',
        },
        {
          type: 'input',
          name: 'criteria',
          message: 'What are the acceptance criteria? (comma-separated)',
        },
      ]);

      const requirements = `
## Requirements
${answers.requirements.split(',').map((r: string) => `- ${r.trim()}`).join('\n')}

## Acceptance Criteria
${answers.criteria.split(',').map((c: string) => `- [ ] ${c.trim()}`).join('\n')}
`;

      this.startSpinner('Generating specification...');
      const result = await orchestrator.generateSpec(
        `${answers.projectName}: ${answers.overview}\n${requirements}`
      );

      if (result.success) {
        this.stopSpinner(true, 'Specification created');
        this.success(`\nSaved to: ${context.specPath}`);
        this.info('\nYou can edit the specification at any time.');
      } else {
        this.stopSpinner(false, 'Failed to create specification');
        this.error(result.error || 'Unknown error');
      }

      return result;
    } catch (error) {
      this.stopSpinner(false, 'Error');
      return {
        success: false,
        message: 'Spec command failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
