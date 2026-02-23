import chalk from 'chalk';
import { BaseCommand, type CommandOptions } from './base.js';
import { getGitDiff } from '../../tools/git.js';
import { readFile } from '../../fs/file-ops.js';
import type { CommandResult, ReviewSummary } from '../../types/state.js';

export class ReviewCommand extends BaseCommand {
  constructor(cwd: string, options: CommandOptions = {}) {
    super(cwd, options);
  }

  async execute(): Promise<CommandResult> {
    this.startSpinner('Initializing...');

    try {
      const context = await this.initContext();
      const orchestrator = await this.createOrchestrator(context);
      this.stopSpinner(true, 'Initialized');

      this.info('Generating code review...\n');

      this.startSpinner('Analyzing changes...');
      
      const isRepo = await this.checkGit();
      
      let reviewData: Partial<ReviewSummary> = {};
      
      if (isRepo) {
        const diff = await getGitDiff(this.cwd);
        reviewData = {
          filesChanged: diff.files.map(f => f.path),
          totalLinesAdded: diff.totalAdditions,
          totalLinesRemoved: diff.totalDeletions,
          risks: this.assessRisks(diff),
          nextSteps: this.getNextSteps(),
          openQuestions: [],
        };
      }

      const result = await orchestrator.generateReview();

      if (result.success) {
        this.stopSpinner(true, 'Review complete');
        
        const review = result.data as { review?: string };
        
        this.info('\n' + chalk.cyan('='.repeat(50)));
        this.info('CODE REVIEW SUMMARY');
        this.info(chalk.cyan('='.repeat(50)) + '\n');

        if (isRepo && reviewData.filesChanged?.length) {
          this.info(chalk.bold('Files Changed:'));
          for (const file of reviewData.filesChanged!) {
            this.info(`  - ${file}`);
          }
          this.info('');
          this.success(`  +${reviewData.totalLinesAdded} -${reviewData.totalLinesRemoved} lines\n`);
        }

        if (review?.review) {
          this.info(chalk.bold('AI Review:'));
          console.log(review.review);
          this.info('');
        }

        if (reviewData.risks?.length) {
          this.warn(chalk.bold('Potential Risks:'));
          for (const risk of reviewData.risks) {
            this.warn(`  ⚠ ${risk}`);
          }
          this.info('');
        }

        if (reviewData.nextSteps?.length) {
          this.info(chalk.bold('Next Steps:'));
          for (let i = 0; i < reviewData.nextSteps!.length; i++) {
            this.info(`  ${i + 1}. ${reviewData.nextSteps![i]}`);
          }
          this.info('');
        }
      } else {
        this.stopSpinner(false, 'Failed to generate review');
        this.error(result.error || 'Unknown error');
      }

      return result;
    } catch (error) {
      this.stopSpinner(false, 'Error');
      return {
        success: false,
        message: 'Review command failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async checkGit(): Promise<boolean> {
    try {
      const { isGitRepo } = await import('../../tools/git.js');
      return await isGitRepo(this.cwd);
    } catch {
      return false;
    }
  }

  private assessRisks(diff: { totalAdditions: number; totalDeletions: number; files: { path: string }[] }): string[] {
    const risks: string[] = [];

    if (diff.totalAdditions > 500) {
      risks.push('Large number of additions - consider breaking into smaller PRs');
    }

    const hasConfigChanges = diff.files.some(f => 
      f.path.includes('config') || f.path.includes('.json')
    );
    if (hasConfigChanges) {
      risks.push('Configuration files modified - ensure changes are intentional');
    }

    return risks;
  }

  private getNextSteps(): string[] {
    return [
      'Run full test suite to verify changes',
      'Update documentation if needed',
      'Consider adding integration tests',
      'Review for security implications',
    ];
  }
}
