"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCLI = createCLI;
exports.runCLI = runCLI;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const index_js_1 = require("./commands/index.js");
const repl_js_1 = require("./repl.js");
function createCLI() {
    const program = new commander_1.Command();
    program
        .name('pilot')
        .description('BetaPilot - AI-powered development workflow assistant')
        .version('1.0.0')
        .option('-v, --verbose', 'Enable verbose logging')
        .option('--dry-run', 'Show changes without applying (default: true for safety)')
        .option('-y, --yes', 'Skip confirmation prompts')
        .option('--force', 'Force command execution regardless of state')
        .hook('preAction', (thisCommand) => {
        const opts = thisCommand.opts();
        if (opts.verbose) {
            process.env.PILOT_VERBOSE = '1';
        }
    });
    program
        .command('spec')
        .description('Create project specification')
        .action(async (opts) => {
        const options = program.opts();
        await new index_js_1.SpecCommand(process.cwd(), { ...options, ...opts }).execute();
    });
    program
        .command('plan')
        .description('Create implementation plan from specification')
        .action(async (opts) => {
        const options = program.opts();
        await new index_js_1.PlanCommand(process.cwd(), { ...options, ...opts }).execute();
    });
    program
        .command('implement')
        .description('Execute implementation plan')
        .action(async (opts) => {
        const options = program.opts();
        await new index_js_1.ImplementCommand(process.cwd(), { ...options, ...opts }).execute();
    });
    program
        .command('test')
        .description('Run project tests')
        .action(async (opts) => {
        const options = program.opts();
        await new index_js_1.TestCommand(process.cwd(), { ...options, ...opts }).execute();
    });
    program
        .command('review')
        .description('Review code changes')
        .action(async (opts) => {
        const options = program.opts();
        await new index_js_1.ReviewCommand(process.cwd(), { ...options, ...opts }).execute();
    });
    program
        .command('deploy')
        .description('Run deployment checklist')
        .action(async (opts) => {
        const options = program.opts();
        await new index_js_1.DeployCommand(process.cwd(), { ...options, ...opts }).execute();
    });
    program
        .command('help')
        .description('Show help message')
        .action(async (opts) => {
        const options = program.opts();
        await new index_js_1.HelpCommand(process.cwd(), { ...options, ...opts }).execute();
    });
    program
        .command('doctor')
        .description('Check prerequisites')
        .action(async (opts) => {
        const options = program.opts();
        await new index_js_1.DoctorCommand(process.cwd(), { ...options, ...opts }).execute();
    });
    program
        .command('interactive', { isDefault: true })
        .description('Start interactive REPL mode')
        .action(async (opts) => {
        const options = program.opts();
        const repl = new repl_js_1.REPL(process.cwd(), options);
        await repl.start();
    });
    program.on('command:*', () => {
        console.error(chalk_1.default.red(`Invalid command: ${program.args.join(' ')}`));
        console.log(chalk_1.default.gray(`Run 'pilot help' for available commands`));
        process.exit(1);
    });
    return program;
}
async function runCLI(args) {
    const program = createCLI();
    if (args.length === 0) {
        const repl = new repl_js_1.REPL(process.cwd(), {});
        await repl.start();
        return;
    }
    await program.parse(args);
}
//# sourceMappingURL=index.js.map