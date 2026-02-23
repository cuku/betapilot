import readline from 'readline';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { SpecCommand, PlanCommand, ImplementCommand, TestCommand, ReviewCommand, DeployCommand, HelpCommand, DoctorCommand } from './commands/index.js';
import type { CommandOptions } from './commands/base.js';

const COMMANDS = ['spec', 'plan', 'implement', 'test', 'review', 'deploy', 'help', 'doctor'];

export class REPL {
  private rl: readline.Interface;
  private cwd: string;
  private options: CommandOptions;
  private running: boolean = true;

  constructor(cwd: string, options: CommandOptions = {}) {
    this.cwd = cwd;
    this.options = options;
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async start(): Promise<void> {
    console.log(chalk.cyan(`
╔═══════════════════════════════════════════╗
║                                           ║
║   Welcome to BetaPilot!                    ║
║   Your AI-powered dev workflow assistant  ║
║                                           ║
╚═══════════════════════════════════════════╝
    `));
    
    console.log(chalk.gray('Type /help for available commands'));
    console.log(chalk.gray('Type /exit or Ctrl+C to quit'));
    console.log('');

    while (this.running) {
      await this.prompt();
    }
  }

  private async prompt(): Promise<void> {
    const input = await new Promise<string>((resolve) => {
      this.rl.question(chalk.cyan('pilot> '), resolve);
    });

    const trimmed = input.trim();
    
    if (!trimmed) {
      return;
    }

    if (trimmed === '/exit' || trimmed === 'exit' || trimmed === '.exit') {
      this.running = false;
      console.log(chalk.gray('Goodbye!'));
      this.rl.close();
      return;
    }

    await this.processInput(trimmed);
  }

  private async processInput(input: string): Promise<void> {
    if (!input.startsWith('/')) {
      const suggestion = this.suggestCommand(input);
      if (suggestion) {
        console.log(chalk.yellow(`Did you mean /${suggestion}?`));
      } else {
        console.log(chalk.yellow('Unknown command. Type /help for available commands.'));
      }
      return;
    }

    const command = input.slice(1).toLowerCase().trim();
    const [cmd, ...args] = command.split(/\s+/);

    if (!COMMANDS.includes(cmd)) {
      console.log(chalk.red(`Unknown command: /${cmd}`));
      console.log(chalk.gray('Type /help for available commands.'));
      return;
    }

    await this.executeCommand(cmd, args.join(' '));
  }

  private suggestCommand(input: string): string | null {
    const normalized = input.toLowerCase();
    
    for (const cmd of COMMANDS) {
      if (cmd.startsWith(normalized)) {
        return cmd;
      }
    }

    if (normalized.includes('spec') || normalized.includes('require')) return 'spec';
    if (normalized.includes('plan')) return 'plan';
    if (normalized.includes('implement') || normalized.includes('code')) return 'implement';
    if (normalized.includes('test')) return 'test';
    if (normalized.includes('review') || normalized.includes('check')) return 'review';
    if (normalized.includes('deploy') || normalized.includes('release')) return 'deploy';
    if (normalized.includes('help')) return 'help';
    if (normalized.includes('doctor') || normalized.includes('check')) return 'doctor';

    return null;
  }

  private async executeCommand(command: string, _args: string): Promise<void> {
    const opts = { ...this.options };

    try {
      switch (command) {
        case 'spec':
          await new SpecCommand(this.cwd, opts).execute();
          break;
        case 'plan':
          await new PlanCommand(this.cwd, opts).execute();
          break;
        case 'implement':
          await new ImplementCommand(this.cwd, opts).execute();
          break;
        case 'test':
          await new TestCommand(this.cwd, opts).execute();
          break;
        case 'review':
          await new ReviewCommand(this.cwd, opts).execute();
          break;
        case 'deploy':
          await new DeployCommand(this.cwd, opts).execute();
          break;
        case 'help':
          await new HelpCommand(this.cwd, opts).execute();
          break;
        case 'doctor':
          await new DoctorCommand(this.cwd, opts).execute();
          break;
        default:
          console.log(chalk.red(`Unknown command: ${command}`));
      }
    } catch (error) {
      console.error(chalk.red('Error executing command:'), error instanceof Error ? error.message : 'Unknown error');
    }

    console.log('');
  }

  stop(): void {
    this.running = false;
    this.rl.close();
  }
}
