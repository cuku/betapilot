import chalk from 'chalk';
import ora from 'ora';
import { getPilotDir, initPilotDir, loadConfig } from '../../fs/pilot-dir.js';
import { createProvider } from '../../providers/index.js';
import { Orchestrator } from '../../core/orchestrator.js';
import type { PilotContext } from '../../types/config.js';
import type { CommandResult } from '../../types/state.js';

export interface CommandOptions {
  verbose?: boolean;
  dryRun?: boolean;
  yes?: boolean;
  force?: boolean;
}

export abstract class BaseCommand {
  protected spinner: ReturnType<typeof ora> | null = null;
  protected cwd: string;
  protected options: CommandOptions;

  constructor(cwd: string, options: CommandOptions = {}) {
    this.cwd = cwd;
    this.options = options;
  }

  protected async initContext(): Promise<PilotContext> {
    await initPilotDir(this.cwd);
    const config = await loadConfig(this.cwd);
    
    if (this.options.verbose) {
      config.verbose = true;
    }

    const pilotDir = getPilotDir(this.cwd);
    
    return {
      cwd: this.cwd,
      pilotDir,
      config,
      specPath: `${pilotDir}/spec.md`,
      planPath: `${pilotDir}/plan.md`,
      runlogPath: `${pilotDir}/runlog.md`,
      contextPath: `${pilotDir}/context.md`,
    };
  }

  protected async createOrchestrator(context: PilotContext): Promise<Orchestrator> {
    const provider = createProvider(context.config);
    return new Orchestrator(provider, context, this.options.force || false);
  }

  protected startSpinner(text: string): void {
    this.spinner = ora(text).start();
  }

  protected stopSpinner(success: boolean, text?: string): void {
    if (this.spinner) {
      if (success) {
        this.spinner.succeed(text);
      } else {
        this.spinner.fail(text);
      }
      this.spinner = null;
    }
  }

  protected log(message: string, color: string = 'white'): void {
    console.log((chalk as any)[color](message));
  }

  protected error(message: string): void {
    console.error(chalk.red(message));
  }

  protected success(message: string): void {
    console.log(chalk.green(message));
  }

  protected warn(message: string): void {
    console.log(chalk.yellow(message));
  }

  protected info(message: string): void {
    console.log(chalk.cyan(message));
  }

  public abstract execute(): Promise<CommandResult>;
}
