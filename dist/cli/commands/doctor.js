"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorCommand = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const chalk_1 = __importDefault(require("chalk"));
const base_js_1 = require("./base.js");
const git_js_1 = require("../../tools/git.js");
const pilot_dir_js_1 = require("../../fs/pilot-dir.js");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class DoctorCommand extends base_js_1.BaseCommand {
    constructor(cwd, options = {}) {
        super(cwd, options);
    }
    async execute() {
        this.info(chalk_1.default.cyan('='.repeat(50)));
        this.info(chalk_1.default.cyan.bold('  BetaPilot Doctor'));
        this.info(chalk_1.default.cyan('='.repeat(50)));
        this.info('');
        const result = {
            node: { installed: false },
            git: { installed: false, isRepo: false },
            apiKey: { hasKey: false },
            config: { exists: false, valid: false },
        };
        this.info(chalk_1.default.bold('Checking prerequisites...\n'));
        await this.checkNode(result);
        await this.checkGit(result);
        await this.checkApiKey(result);
        await this.checkConfig(result);
        this.info('');
        this.info(chalk_1.default.bold('Results:'));
        this.info('');
        this.printCheck('Node.js', result.node.installed, result.node.version || 'unknown');
        this.printCheck('Git', result.git.installed, result.git.isRepo ? 'repo' : 'not a repo');
        this.printCheck('API Key', result.apiKey.hasKey, result.apiKey.provider || 'none');
        this.printCheck('Config', result.config.exists && result.config.valid, result.config.exists ? (result.config.valid ? 'valid' : 'invalid') : 'missing');
        this.info('');
        const allPassed = result.node.installed &&
            result.git.installed &&
            result.apiKey.hasKey &&
            result.config.exists;
        if (allPassed) {
            this.success(chalk_1.default.green('✓ All checks passed!'));
            this.info('\nYou can now use BetaPilot commands.');
        }
        else {
            this.warn(chalk_1.default.yellow('⚠ Some checks failed. Please fix the issues above.'));
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
    async checkNode(result) {
        try {
            const { stdout } = await execAsync('node --version');
            result.node.installed = true;
            result.node.version = stdout.trim();
            this.info(chalk_1.default.green('  ✓') + ` Node.js: ${result.node.version}`);
        }
        catch {
            result.node.installed = false;
            this.info(chalk_1.default.red('  ✗') + ' Node.js: not found');
        }
    }
    async checkGit(result) {
        try {
            await execAsync('git --version');
            result.git.installed = true;
            result.git.isRepo = await (0, git_js_1.isGitRepo)(this.cwd);
            if (result.git.isRepo) {
                this.info(chalk_1.default.green('  ✓') + ' Git: installed and initialized');
            }
            else {
                this.info(chalk_1.default.yellow('  ⚠') + ' Git: installed but not a repo');
            }
        }
        catch {
            result.git.installed = false;
            this.info(chalk_1.default.red('  ✗') + ' Git: not found');
        }
    }
    async checkApiKey(result) {
        const anthropicKey = process.env.ANTHROPIC_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;
        if (anthropicKey) {
            result.apiKey.hasKey = true;
            result.apiKey.provider = 'anthropic';
            this.info(chalk_1.default.green('  ✓') + ' API Key: ANTHROPIC_API_KEY set');
        }
        else if (openaiKey) {
            result.apiKey.hasKey = true;
            result.apiKey.provider = 'openai';
            this.info(chalk_1.default.green('  ✓') + ' API Key: OPENAI_API_KEY set');
        }
        else {
            result.apiKey.hasKey = false;
            this.info(chalk_1.default.red('  ✗') + ' API Key: not set');
        }
    }
    async checkConfig(result) {
        try {
            const exists = await (0, pilot_dir_js_1.pilotDirExists)(this.cwd);
            result.config.exists = exists;
            if (exists) {
                const config = await (0, pilot_dir_js_1.loadConfig)(this.cwd);
                result.config.valid = !!config.provider && !!config.model;
                if (result.config.valid) {
                    this.info(chalk_1.default.green('  ✓') + ` Config: ${config.provider}/${config.model}`);
                }
                else {
                    this.info(chalk_1.default.red('  ✗') + ' Config: invalid');
                }
            }
            else {
                this.info(chalk_1.default.yellow('  ⚠') + ' Config: not initialized (will create on first run)');
            }
        }
        catch {
            result.config.exists = false;
            result.config.valid = false;
            this.info(chalk_1.default.red('  ✗') + ' Config: error loading');
        }
    }
    printCheck(name, passed, detail) {
        if (passed) {
            this.success(chalk_1.default.green(`  ✓ ${name}: ${detail}`));
        }
        else {
            this.error(chalk_1.default.red(`  ✗ ${name}: ${detail}`));
        }
    }
}
exports.DoctorCommand = DoctorCommand;
//# sourceMappingURL=doctor.js.map