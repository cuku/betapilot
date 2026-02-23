"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewCommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
const base_js_1 = require("./base.js");
const git_js_1 = require("../../tools/git.js");
class ReviewCommand extends base_js_1.BaseCommand {
    constructor(cwd, options = {}) {
        super(cwd, options);
    }
    async execute() {
        this.startSpinner('Initializing...');
        try {
            const context = await this.initContext();
            const orchestrator = await this.createOrchestrator(context);
            this.stopSpinner(true, 'Initialized');
            this.info('Generating code review...\n');
            this.startSpinner('Analyzing changes...');
            const isRepo = await this.checkGit();
            let reviewData = {};
            if (isRepo) {
                const diff = await (0, git_js_1.getGitDiff)(this.cwd);
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
                const review = result.data;
                this.info('\n' + chalk_1.default.cyan('='.repeat(50)));
                this.info('CODE REVIEW SUMMARY');
                this.info(chalk_1.default.cyan('='.repeat(50)) + '\n');
                if (isRepo && reviewData.filesChanged?.length) {
                    this.info(chalk_1.default.bold('Files Changed:'));
                    for (const file of reviewData.filesChanged) {
                        this.info(`  - ${file}`);
                    }
                    this.info('');
                    this.success(`  +${reviewData.totalLinesAdded} -${reviewData.totalLinesRemoved} lines\n`);
                }
                if (review?.review) {
                    this.info(chalk_1.default.bold('AI Review:'));
                    console.log(review.review);
                    this.info('');
                }
                if (reviewData.risks?.length) {
                    this.warn(chalk_1.default.bold('Potential Risks:'));
                    for (const risk of reviewData.risks) {
                        this.warn(`  ⚠ ${risk}`);
                    }
                    this.info('');
                }
                if (reviewData.nextSteps?.length) {
                    this.info(chalk_1.default.bold('Next Steps:'));
                    for (let i = 0; i < reviewData.nextSteps.length; i++) {
                        this.info(`  ${i + 1}. ${reviewData.nextSteps[i]}`);
                    }
                    this.info('');
                }
            }
            else {
                this.stopSpinner(false, 'Failed to generate review');
                this.error(result.error || 'Unknown error');
            }
            return result;
        }
        catch (error) {
            this.stopSpinner(false, 'Error');
            return {
                success: false,
                message: 'Review command failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    async checkGit() {
        try {
            const { isGitRepo } = await import('../../tools/git.js');
            return await isGitRepo(this.cwd);
        }
        catch {
            return false;
        }
    }
    assessRisks(diff) {
        const risks = [];
        if (diff.totalAdditions > 500) {
            risks.push('Large number of additions - consider breaking into smaller PRs');
        }
        const hasConfigChanges = diff.files.some(f => f.path.includes('config') || f.path.includes('.json'));
        if (hasConfigChanges) {
            risks.push('Configuration files modified - ensure changes are intentional');
        }
        return risks;
    }
    getNextSteps() {
        return [
            'Run full test suite to verify changes',
            'Update documentation if needed',
            'Consider adding integration tests',
            'Review for security implications',
        ];
    }
}
exports.ReviewCommand = ReviewCommand;
//# sourceMappingURL=review.js.map