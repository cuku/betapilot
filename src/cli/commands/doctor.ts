import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import { BaseCommand, type CommandOptions } from './base.js';
import { isGitRepo } from '../../tools/git.js';
import { pilotDirExists, loadConfig, getPilotDir } from '../../fs/pilot-dir.js';
import type { CommandResult, DoctorResult } from '../../types/state.js';

const execAsync = promisify(exec);

export class DoctorCommand extends BaseCommand {
  constructor(cwd: string, options: CommandOptions = {}) {
    super(cwd, options);
  }

  async execute(): Promise<CommandResult> {
    this.info(chalk.cyan('='.repeat(50)));
    this.info(chalk.cyan.bold('  BetaPilot Doctor'));
    this.info(chalk.cyan('='.repeat(50)));
    this.info('');

    const result: DoctorResult = {
      node: { installed: false },
      git: { installed: false, isRepo: false },
      apiKey: { hasKey: false },
      config: { exists: false, valid: false },
    };

    this.info(chalk.bold('Checking prerequisites...\n'));

    await this.checkNode(result);
    await this.checkGit(result);
    await this.checkApiKey(result);
    await this.checkConfig(result);

    this.info('');
    this.info(chalk.bold('Results:'));
    this.info('');

    this.printCheck('Node.js', result.node.installed, result.node.version || 'unknown');
    this.printCheck('Git', result.git.installed, result.git.isRepo ? 'repo' : 'not a repo');
    this.printCheck('API Key', result.apiKey.hasKey, result.apiKey.provider || 'none');
    this.printCheck('Config', result.config.exists && result.config.valid, 
      result.config.exists ? (result.config.valid ? 'valid' : 'invalid') : 'missing');

    this.info('');
    
    const allPassed = result.node.installed && 
                      result.git.installed && 
                      result.apiKey.hasKey && 
                      result.config.exists;

    if (allPassed) {
      this.success(chalk.green('✓ All checks passed!'));
      this.info('\nYou can now use BetaPilot commands.');
    } else {
      this.warn(chalk.yellow('⚠ Some checks failed. Please fix the issues above.'));
      this.info('\nTo set up API keys:');
      this.info('  export ANTHROPIC_API_KEY=your_key');
      this.info('  # or');
      this.info('  export OPENAI_API_KEY=your_key');
    }

    return {
      success: allPassed,
      message: allPassed ? 'All checks passed' : 'Some checks failed',
      data: result,
    };
  }

  private async checkNode(result: DoctorResult): Promise<void> {
    try {
      const { stdout } = await execAsync('node --version');
      result.node.installed = true;
      result.node.version = stdout.trim();
      this.info(chalk.green('  ✓') + ` Node.js: ${result.node.version}`);
    } catch {
      result.node.installed = false;
      this.info(chalk.red('  ✗') + ' Node.js: not found');
    }
  }

  private async checkGit(result: DoctorResult): Promise<void> {
    try {
      await execAsync('git --version');
      result.git.installed = true;
      result.git.isRepo = await isGitRepo(this.cwd);
      
      if (result.git.isRepo) {
        this.info(chalk.green('  ✓') + ' Git: installed and initialized');
      } else {
        this.info(chalk.yellow('  ⚠') + ' Git: installed but not a repo');
      }
    } catch {
      result.git.installed = false;
      this.info(chalk.red('  ✗') + ' Git: not found');
    }
  }

  private async checkApiKey(result: DoctorResult): Promise<void> {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (anthropicKey) {
      result.apiKey.hasKey = true;
      result.apiKey.provider = 'anthropic';
      this.info(chalk.green('  ✓') + ' API Key: ANTHROPIC_API_KEY set');
    } else if (openaiKey) {
      result.apiKey.hasKey = true;
      result.apiKey.provider = 'openai';
      this.info(chalk.green('  ✓') + ' API Key: OPENAI_API_KEY set');
    } else {
      result.apiKey.hasKey = false;
      this.info(chalk.red('  ✗') + ' API Key: not set');
    }
  }

  private async checkConfig(result: DoctorResult): Promise<void> {
    try {
      const exists = await pilotDirExists(this.cwd);
      result.config.exists = exists;

      if (exists) {
        const config = await loadConfig(this.cwd);
        result.config.valid = !!config.provider && !!config.model;
        
        if (result.config.valid) {
          this.info(chalk.green('  ✓') + ` Config: ${config.provider}/${config.model}`);
        } else {
          this.info(chalk.red('  ✗') + ' Config: invalid');
        }
      } else {
        this.info(chalk.yellow('  ⚠') + ' Config: not initialized (will create on first run)');
      }
    } catch {
      result.config.exists = false;
      result.config.valid = false;
      this.info(chalk.red('  ✗') + ' Config: error loading');
    }
  }

  private printCheck(name: string, passed: boolean, detail: string): void {
    if (passed) {
      this.success(chalk.green(`  ✓ ${name}: ${detail}`));
    } else {
      this.error(chalk.red(`  ✗ ${name}: ${detail}`));
    }
  }
}
