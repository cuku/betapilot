import { Command } from 'commander';
import chalk from 'chalk';
import { SpecCommand, PlanCommand, ImplementCommand, TestCommand, ReviewCommand, DeployCommand, HelpCommand, DoctorCommand } from './commands/index.js';
import { REPL } from './repl.js';

export function createCLI(): Command {
  const program = new Command();

  program
    .name('pilot')
    .description('BetaPilot - AI-powered development workflow assistant')
    .version('1.0.0')
    .option('-v, --verbose', 'Enable verbose logging')
    .option('--dry-run', 'Show changes without applying (default: true for safety)')
    .option('-y, --yes', 'Skip confirmation prompts')
    .option('--force', 'Force command execution regardless of state')
    .hook('preAction', (thisCommand) => {
      const opts = thisCommand.opts();
      if (opts.verbose) {
        process.env.PILOT_VERBOSE = '1';
      }
    });

  program
    .command('spec')
    .description('Create project specification')
    .action(async (opts) => {
      const options = program.opts();
      await new SpecCommand(process.cwd(), { ...options, ...opts }).execute();
    });

  program
    .command('plan')
    .description('Create implementation plan from specification')
    .action(async (opts) => {
      const options = program.opts();
      await new PlanCommand(process.cwd(), { ...options, ...opts }).execute();
    });

  program
    .command('implement')
    .description('Execute implementation plan')
    .action(async (opts) => {
      const options = program.opts();
      await new ImplementCommand(process.cwd(), { ...options, ...opts }).execute();
    });

  program
    .command('test')
    .description('Run project tests')
    .action(async (opts) => {
      const options = program.opts();
      await new TestCommand(process.cwd(), { ...options, ...opts }).execute();
    });

  program
    .command('review')
    .description('Review code changes')
    .action(async (opts) => {
      const options = program.opts();
      await new ReviewCommand(process.cwd(), { ...options, ...opts }).execute();
    });

  program
    .command('deploy')
    .description('Run deployment checklist')
    .action(async (opts) => {
      const options = program.opts();
      await new DeployCommand(process.cwd(), { ...options, ...opts }).execute();
    });

  program
    .command('help')
    .description('Show help message')
    .action(async (opts) => {
      const options = program.opts();
      await new HelpCommand(process.cwd(), { ...options, ...opts }).execute();
    });

  program
    .command('doctor')
    .description('Check prerequisites')
    .action(async (opts) => {
      const options = program.opts();
      await new DoctorCommand(process.cwd(), { ...options, ...opts }).execute();
    });

  program
    .command('interactive', { isDefault: true })
    .description('Start interactive REPL mode')
    .action(async (opts) => {
      const options = program.opts();
      const repl = new REPL(process.cwd(), options);
      await repl.start();
    });

  program.on('command:*', () => {
    console.error(chalk.red(`Invalid command: ${program.args.join(' ')}`));
    console.log(chalk.gray(`Run 'pilot help' for available commands`));
    process.exit(1);
  });

  return program;
}

export async function runCLI(args: string[]): Promise<void> {
  const program = createCLI();
  
  if (args.length === 0) {
    const repl = new REPL(process.cwd(), {});
    await repl.start();
    return;
  }

  await program.parse(args);
}
