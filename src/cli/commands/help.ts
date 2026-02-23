import chalk from 'chalk';
import { BaseCommand, type CommandOptions } from './base.js';
import type { CommandResult } from '../../types/state.js';

export class HelpCommand extends BaseCommand {
  constructor(cwd: string, options: CommandOptions = {}) {
    super(cwd, options);
  }

  async execute(): Promise<CommandResult> {
    this.info(chalk.cyan('='.repeat(60)));
    this.info(chalk.cyan.bold('  BetaPilot - Command Reference'));
    this.info(chalk.cyan('='.repeat(60)));
    this.info('');

    this.info(chalk.bold('/spec'));
    this.info('  Interactive requirements capture. Creates .pilot/spec.md');
    this.info('  Usage: /spec or pilot spec');
    this.info('');

    this.info(chalk.bold('/plan'));
    this.info('  Converts specification to implementation plan. Creates .pilot/plan.md');
    this.info('  Usage: /plan or pilot plan');
    this.info('');

    this.info(chalk.bold('/implement'));
    this.info('  Executes plan steps, generates patches, and applies changes');
    this.info('  Usage: /implement or pilot implement');
    this.info('  Flags: --dry-run, --yes');
    this.info('');

    this.info(chalk.bold('/test'));
    this.info('  Runs project test command and captures output');
    this.info('  Usage: /test or pilot test');
    this.info('');

    this.info(chalk.bold('/review'));
    this.info('  Generates code review summary with diff analysis');
    this.info('  Usage: /review or pilot review');
    this.info('');

    this.info(chalk.bold('/deploy'));
    this.info('  Shows deployment checklist and optionally runs deploy script');
    this.info('  Usage: /deploy or pilot deploy');
    this.info('');

    this.info(chalk.bold('/help'));
    this.info('  Shows this help message');
    this.info('  Usage: /help or pilot help');
    this.info('');

    this.info(chalk.bold('/doctor'));
    this.info('  Checks prerequisites (Node.js, git, API keys, config)');
    this.info('  Usage: /doctor or pilot doctor');
    this.info('');

    this.info(chalk.cyan('='.repeat(60)));
    this.info(chalk.bold('  Global Flags'));
    this.info(chalk.cyan('='.repeat(60)));
    this.info('');

    this.info(chalk.bold('--dry-run'));
    this.info('  Show intended changes without writing (default for safety)');
    this.info('');

    this.info(chalk.bold('--yes, -y'));
    this.info('  Skip confirmation prompts for destructive operations');
    this.info('');

    this.info(chalk.bold('--verbose'));
    this.info('  Enable verbose logging');
    this.info('');

    this.info(chalk.bold('--force'));
    this.info('  Force command execution regardless of state');
    this.info('');

    this.info(chalk.cyan('='.repeat(60)));
    this.info(chalk.bold('  Getting Started'));
    this.info(chalk.cyan('='.repeat(60)));
    this.info('');
    this.info('1. Run ' + chalk.green('pilot spec') + ' to define requirements');
    this.info('2. Run ' + chalk.green('pilot plan') + ' to create implementation plan');
    this.info('3. Run ' + chalk.green('pilot implement') + ' to apply changes');
    this.info('4. Run ' + chalk.green('pilot test') + ' to verify with tests');
    this.info('5. Run ' + chalk.green('pilot review') + ' to review changes');
    this.info('');
    this.info('Or use interactive mode: ' + chalk.green('pilot'));
    this.info('');

    return { success: true, message: 'Help displayed' };
  }
}
