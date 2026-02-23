"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanCommand = void 0;
const base_js_1 = require("./base.js");
const file_ops_js_1 = require("../../fs/file-ops.js");
class PlanCommand extends base_js_1.BaseCommand {
    constructor(cwd, options = {}) {
        super(cwd, options);
    }
    async execute() {
        this.startSpinner('Initializing...');
        try {
            const context = await this.initContext();
            const orchestrator = await this.createOrchestrator(context);
            this.stopSpinner(true, 'Initialized');
            const spec = await (0, file_ops_js_1.readFile)(context.specPath);
            if (!spec || spec.trim().length === 0) {
                this.error('No specification found. Please run /spec first.');
                return {
                    success: false,
                    message: 'No specification found',
                    error: 'Run /spec to create a specification first',
                };
            }
            this.info('Creating implementation plan from specification...\n');
            this.startSpinner('Generating plan...');
            const result = await orchestrator.generatePlan();
            if (result.success) {
                this.stopSpinner(true, 'Plan created');
                this.success(`\nSaved to: ${context.planPath}`);
                if (!this.options.dryRun) {
                    this.info('\nNext steps:');
                    this.info('  1. Run /implement to start implementing');
                }
                else {
                    this.info('\n(Dry run mode - no files written)');
                }
            }
            else {
                this.stopSpinner(false, 'Failed to create plan');
                this.error(result.error || 'Unknown error');
            }
            return result;
        }
        catch (error) {
            this.stopSpinner(false, 'Error');
            return {
                success: false,
                message: 'Plan command failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
}
exports.PlanCommand = PlanCommand;
//# sourceMappingURL=plan.js.map