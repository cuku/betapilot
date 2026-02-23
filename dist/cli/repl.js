"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPL = void 0;
const readline_1 = __importDefault(require("readline"));
const chalk_1 = __importDefault(require("chalk"));
const index_js_1 = require("./commands/index.js");
const COMMANDS = ['spec', 'plan', 'implement', 'test', 'review', 'deploy', 'help', 'doctor'];
class REPL {
    rl;
    cwd;
    options;
    running = true;
    constructor(cwd, options = {}) {
        this.cwd = cwd;
        this.options = options;
        this.rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }
    async start() {
        console.log(chalk_1.default.cyan(`
╔═══════════════════════════════════════════╗
║                                           ║
║   Welcome to BetaPilot!                    ║
║   Your AI-powered dev workflow assistant  ║
║                                           ║
╚═══════════════════════════════════════════╝
    `));
        console.log(chalk_1.default.gray('Type /help for available commands'));
        console.log(chalk_1.default.gray('Type /exit or Ctrl+C to quit'));
        console.log('');
        while (this.running) {
            await this.prompt();
        }
    }
    async prompt() {
        const input = await new Promise((resolve) => {
            this.rl.question(chalk_1.default.cyan('pilot> '), resolve);
        });
        const trimmed = input.trim();
        if (!trimmed) {
            return;
        }
        if (trimmed === '/exit' || trimmed === 'exit' || trimmed === '.exit') {
            this.running = false;
            console.log(chalk_1.default.gray('Goodbye!'));
            this.rl.close();
            return;
        }
        await this.processInput(trimmed);
    }
    async processInput(input) {
        if (!input.startsWith('/')) {
            const suggestion = this.suggestCommand(input);
            if (suggestion) {
                console.log(chalk_1.default.yellow(`Did you mean /${suggestion}?`));
            }
            else {
                console.log(chalk_1.default.yellow('Unknown command. Type /help for available commands.'));
            }
            return;
        }
        const command = input.slice(1).toLowerCase().trim();
        const [cmd, ...args] = command.split(/\s+/);
        if (!COMMANDS.includes(cmd)) {
            console.log(chalk_1.default.red(`Unknown command: /${cmd}`));
            console.log(chalk_1.default.gray('Type /help for available commands.'));
            return;
        }
        await this.executeCommand(cmd, args.join(' '));
    }
    suggestCommand(input) {
        const normalized = input.toLowerCase();
        for (const cmd of COMMANDS) {
            if (cmd.startsWith(normalized)) {
                return cmd;
            }
        }
        if (normalized.includes('spec') || normalized.includes('require'))
            return 'spec';
        if (normalized.includes('plan'))
            return 'plan';
        if (normalized.includes('implement') || normalized.includes('code'))
            return 'implement';
        if (normalized.includes('test'))
            return 'test';
        if (normalized.includes('review') || normalized.includes('check'))
            return 'review';
        if (normalized.includes('deploy') || normalized.includes('release'))
            return 'deploy';
        if (normalized.includes('help'))
            return 'help';
        if (normalized.includes('doctor') || normalized.includes('check'))
            return 'doctor';
        return null;
    }
    async executeCommand(command, _args) {
        const opts = { ...this.options };
        try {
            switch (command) {
                case 'spec':
                    await new index_js_1.SpecCommand(this.cwd, opts).execute();
                    break;
                case 'plan':
                    await new index_js_1.PlanCommand(this.cwd, opts).execute();
                    break;
                case 'implement':
                    await new index_js_1.ImplementCommand(this.cwd, opts).execute();
                    break;
                case 'test':
                    await new index_js_1.TestCommand(this.cwd, opts).execute();
                    break;
                case 'review':
                    await new index_js_1.ReviewCommand(this.cwd, opts).execute();
                    break;
                case 'deploy':
                    await new index_js_1.DeployCommand(this.cwd, opts).execute();
                    break;
                case 'help':
                    await new index_js_1.HelpCommand(this.cwd, opts).execute();
                    break;
                case 'doctor':
                    await new index_js_1.DoctorCommand(this.cwd, opts).execute();
                    break;
                default:
                    console.log(chalk_1.default.red(`Unknown command: ${command}`));
            }
        }
        catch (error) {
            console.error(chalk_1.default.red('Error executing command:'), error instanceof Error ? error.message : 'Unknown error');
        }
        console.log('');
    }
    stop() {
        this.running = false;
        this.rl.close();
    }
}
exports.REPL = REPL;
//# sourceMappingURL=repl.js.map