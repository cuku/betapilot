"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImplementCommand = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const base_js_1 = require("./base.js");
const file_ops_js_1 = require("../../fs/file-ops.js");
const patch_js_1 = require("../../fs/patch.js");
const git_js_1 = require("../../tools/git.js");
class ImplementCommand extends base_js_1.BaseCommand {
    constructor(cwd, options = {}) {
        super(cwd, options);
    }
    async execute() {
        const dryRun = this.options.dryRun ?? false;
        this.startSpinner('Initializing...');
        try {
            const context = await this.initContext();
            const orchestrator = await this.createOrchestrator(context);
            this.stopSpinner(true, 'Initialized');
            const plan = await (0, file_ops_js_1.readFile)(context.planPath);
            if (!plan || plan.trim().length === 0) {
                this.error('No implementation plan found. Please run /plan first.');
                return {
                    success: false,
                    message: 'No plan found',
                    error: 'Run /plan to create an implementation plan first',
                };
            }
            const steps = this.parsePlanSteps(plan);
            if (steps.length === 0) {
                this.warn('No implementation steps found in plan.');
                return { success: true, message: 'No steps to implement' };
            }
            this.info(`Found ${steps.length} implementation step(s)\n`);
            for (let i = 0; i < steps.length; i++) {
                const step = steps[i];
                this.info(`Step ${i + 1}/${steps.length}: ${step}`);
                this.startSpinner('Generating implementation...');
                const result = await orchestrator.generateImplementation(step);
                if (!result.success) {
                    this.stopSpinner(false, `Failed at step ${i + 1}`);
                    this.error(result.error || 'Unknown error');
                    return result;
                }
                const diff = result.data;
                if (diff?.diff) {
                    this.stopSpinner(true, 'Generated patch');
                    this.info('\n' + this.formatDiff(diff.diff));
                    if (dryRun) {
                        this.warn('\n(Dry run mode - not applying changes)');
                    }
                    else {
                        const confirmed = this.options.yes || await this.confirmApply(diff.diff);
                        if (confirmed) {
                            const applyResult = await this.applyDiffs(diff.diff);
                            if (!applyResult.success) {
                                return applyResult;
                            }
                            this.success('Changes applied');
                        }
                        else {
                            this.warn('Skipped applying changes');
                        }
                    }
                }
            }
            const isRepo = await (0, git_js_1.isGitRepo)(this.cwd);
            if (isRepo) {
                const gitDiff = await (0, git_js_1.getGitDiff)(this.cwd);
                this.info(`\nSummary: ${gitDiff.totalAdditions} additions, ${gitDiff.totalDeletions} deletions`);
            }
            return {
                success: true,
                message: 'Implementation complete',
            };
        }
        catch (error) {
            this.stopSpinner(false, 'Error');
            return {
                success: false,
                message: 'Implement command failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    parsePlanSteps(plan) {
        const steps = [];
        const lines = plan.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (/^\d+[\.\)]\s+/.test(trimmed) || /^-\s+/.test(trimmed)) {
                const step = trimmed.replace(/^(\d+[\.\)]\s+|-\s+)/, '').trim();
                if (step.length > 0) {
                    steps.push(step);
                }
            }
        }
        return steps;
    }
    formatDiff(diff) {
        const lines = diff.split('\n');
        return lines.slice(0, 30).join('\n') + (lines.length > 30 ? '\n... (truncated)' : '');
    }
    async confirmApply(_patch) {
        const answer = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'apply',
                message: 'Apply this patch?',
                default: false,
            },
        ]);
        return answer.apply;
    }
    async applyDiffs(patchContent) {
        const lines = patchContent.split('\n');
        const files = new Map();
        let currentFile = '';
        for (const line of lines) {
            const fileMatch = line.match(/^\+\+\+ b\/(.+)$/);
            if (fileMatch) {
                currentFile = fileMatch[1];
                files.set(currentFile, []);
            }
            else if (currentFile) {
                files.get(currentFile).push(line);
            }
        }
        const results = [];
        for (const [filePath, patchLines] of files) {
            const fullPath = `${this.cwd}/${filePath}`;
            const patchText = patchLines.join('\n');
            const result = await (0, patch_js_1.applyPatch)(fullPath, patchText, this.options.dryRun);
            if (result.success) {
                results.push(`Applied: ${filePath}`);
            }
            else {
                results.push(`Failed: ${filePath} - ${result.error}`);
            }
        }
        return {
            success: true,
            message: results.join('\n'),
        };
    }
}
exports.ImplementCommand = ImplementCommand;
//# sourceMappingURL=implement.js.map