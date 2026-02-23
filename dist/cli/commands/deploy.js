"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployCommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const base_js_1 = require("./base.js");
const runner_js_1 = require("../../tools/runner.js");
class DeployCommand extends base_js_1.BaseCommand {
    constructor(cwd, options = {}) {
        super(cwd, options);
    }
    async execute() {
        this.startSpinner('Initializing...');
        try {
            const context = await this.initContext();
            this.stopSpinner(true, 'Initialized');
            const deployRunner = new runner_js_1.DeployRunner(context.config, this.cwd);
            const checklist = deployRunner.getChecklist();
            this.info(chalk_1.default.cyan('='.repeat(50)));
            this.info('DEPLOYMENT CHECKLIST');
            this.info(chalk_1.default.cyan('='.repeat(50)) + '\n');
            let allChecked = true;
            for (let i = 0; i < checklist.length; i++) {
                const item = checklist[i];
                const answer = await inquirer_1.default.prompt([
                    {
                        type: 'confirm',
                        name: 'checked',
                        message: `${i + 1}. ${item}`,
                        default: false,
                    },
                ]);
                if (!answer.checked) {
                    allChecked = false;
                }
            }
            this.info('');
            if (!allChecked) {
                this.warn('Not all checklist items are complete.');
                this.info('Run /test and /review first to verify your changes.');
                return {
                    success: false,
                    message: 'Deployment checklist not complete',
                    error: 'Complete all checklist items before deploying',
                };
            }
            this.success('All checklist items verified!');
            if (context.config.deployCommand) {
                this.info(`\nRunning deploy command: ${context.config.deployCommand}\n`);
                this.startSpinner('Deploying...');
                const result = await deployRunner.run();
                if (result.passed) {
                    this.stopSpinner(true, 'Deployment complete');
                    this.success(`\n✓ Deployed successfully (${result.duration}ms)`);
                    if (result.output) {
                        this.info('\n--- Deployment Output ---');
                        console.log(result.output.slice(0, 500));
                    }
                    return {
                        success: true,
                        message: 'Deployment successful',
                        data: result,
                    };
                }
                else {
                    this.stopSpinner(false, 'Deployment failed');
                    this.error(`\n✗ Deployment failed`);
                    if (result.output) {
                        this.info('\n--- Error Output ---');
                        console.log(result.output.slice(0, 500));
                    }
                    return {
                        success: false,
                        message: 'Deployment failed',
                        data: result,
                    };
                }
            }
            else {
                this.info('\nNo deploy command configured.');
                this.info('Add deployCommand to .pilot/config.json to enable automated deployment.');
                return {
                    success: true,
                    message: 'Checklist complete, no deploy command',
                };
            }
        }
        catch (error) {
            this.stopSpinner(false, 'Error');
            return {
                success: false,
                message: 'Deploy command failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
}
exports.DeployCommand = DeployCommand;
//# sourceMappingURL=deploy.js.map