"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
const base_js_1 = require("./base.js");
class HelpCommand extends base_js_1.BaseCommand {
    constructor(cwd, options = {}) {
        super(cwd, options);
    }
    async execute() {
        this.info(chalk_1.default.cyan('='.repeat(60)));
        this.info(chalk_1.default.cyan.bold('  BetaPilot - Command Reference'));
        this.info(chalk_1.default.cyan('='.repeat(60)));
        this.info('');
        this.info(chalk_1.default.bold('/spec'));
        this.info('  Interactive requirements capture. Creates .pilot/spec.md');
        this.info('  Usage: /spec or pilot spec');
        this.info('');
        this.info(chalk_1.default.bold('/plan'));
        this.info('  Converts specification to implementation plan. Creates .pilot/plan.md');
        this.info('  Usage: /plan or pilot plan');
        this.info('');
        this.info(chalk_1.default.bold('/implement'));
        this.info('  Executes plan steps, generates patches, and applies changes');
        this.info('  Usage: /implement or pilot implement');
        this.info('  Flags: --dry-run, --yes');
        this.info('');
        this.info(chalk_1.default.bold('/test'));
        this.info('  Runs project test command and captures output');
        this.info('  Usage: /test or pilot test');
        this.info('');
        this.info(chalk_1.default.bold('/review'));
        this.info('  Generates code review summary with diff analysis');
        this.info('  Usage: /review or pilot review');
        this.info('');
        this.info(chalk_1.default.bold('/deploy'));
        this.info('  Shows deployment checklist and optionally runs deploy script');
        this.info('  Usage: /deploy or pilot deploy');
        this.info('');
        this.info(chalk_1.default.bold('/help'));
        this.info('  Shows this help message');
        this.info('  Usage: /help or pilot help');
        this.info('');
        this.info(chalk_1.default.bold('/doctor'));
        this.info('  Checks prerequisites (Node.js, git, API keys, config)');
        this.info('  Usage: /doctor or pilot doctor');
        this.info('');
        this.info(chalk_1.default.cyan('='.repeat(60)));
        this.info(chalk_1.default.bold('  Global Flags'));
        this.info(chalk_1.default.cyan('='.repeat(60)));
        this.info('');
        this.info(chalk_1.default.bold('--dry-run'));
        this.info('  Show intended changes without writing (default for safety)');
        this.info('');
        this.info(chalk_1.default.bold('--yes, -y'));
        this.info('  Skip confirmation prompts for destructive operations');
        this.info('');
        this.info(chalk_1.default.bold('--verbose'));
        this.info('  Enable verbose logging');
        this.info('');
        this.info(chalk_1.default.bold('--force'));
        this.info('  Force command execution regardless of state');
        this.info('');
        this.info(chalk_1.default.cyan('='.repeat(60)));
        this.info(chalk_1.default.bold('  Getting Started'));
        this.info(chalk_1.default.cyan('='.repeat(60)));
        this.info('');
        this.info('1. Run ' + chalk_1.default.green('pilot spec') + ' to define requirements');
        this.info('2. Run ' + chalk_1.default.green('pilot plan') + ' to create implementation plan');
        this.info('3. Run ' + chalk_1.default.green('pilot implement') + ' to apply changes');
        this.info('4. Run ' + chalk_1.default.green('pilot test') + ' to verify with tests');
        this.info('5. Run ' + chalk_1.default.green('pilot review') + ' to review changes');
        this.info('');
        this.info('Or use interactive mode: ' + chalk_1.default.green('pilot'));
        this.info('');
        return { success: true, message: 'Help displayed' };
    }
}
exports.HelpCommand = HelpCommand;
//# sourceMappingURL=help.js.map