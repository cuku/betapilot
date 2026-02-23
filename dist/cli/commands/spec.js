"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecCommand = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const base_js_1 = require("./base.js");
class SpecCommand extends base_js_1.BaseCommand {
    constructor(cwd, options = {}) {
        super(cwd, options);
    }
    async execute() {
        this.startSpinner('Initializing...');
        try {
            const context = await this.initContext();
            const orchestrator = await this.createOrchestrator(context);
            this.stopSpinner(true, 'Initialized');
            this.info('Let\'s create a specification for your project.');
            this.info('Please answer the following questions:\n');
            const answers = await inquirer_1.default.prompt([
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
${answers.requirements.split(',').map((r) => `- ${r.trim()}`).join('\n')}

## Acceptance Criteria
${answers.criteria.split(',').map((c) => `- [ ] ${c.trim()}`).join('\n')}
`;
            this.startSpinner('Generating specification...');
            const result = await orchestrator.generateSpec(`${answers.projectName}: ${answers.overview}\n${requirements}`);
            if (result.success) {
                this.stopSpinner(true, 'Specification created');
                this.success(`\nSaved to: ${context.specPath}`);
                this.info('\nYou can edit the specification at any time.');
            }
            else {
                this.stopSpinner(false, 'Failed to create specification');
                this.error(result.error || 'Unknown error');
            }
            return result;
        }
        catch (error) {
            this.stopSpinner(false, 'Error');
            return {
                success: false,
                message: 'Spec command failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
}
exports.SpecCommand = SpecCommand;
//# sourceMappingURL=spec.js.map