"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const pilot_dir_js_1 = require("../../fs/pilot-dir.js");
const index_js_1 = require("../../providers/index.js");
const orchestrator_js_1 = require("../../core/orchestrator.js");
class BaseCommand {
    spinner = null;
    cwd;
    options;
    constructor(cwd, options = {}) {
        this.cwd = cwd;
        this.options = options;
    }
    async initContext() {
        await (0, pilot_dir_js_1.initPilotDir)(this.cwd);
        const config = await (0, pilot_dir_js_1.loadConfig)(this.cwd);
        if (this.options.verbose) {
            config.verbose = true;
        }
        const pilotDir = (0, pilot_dir_js_1.getPilotDir)(this.cwd);
        return {
            cwd: this.cwd,
            pilotDir,
            config,
            specPath: `${pilotDir}/spec.md`,
            planPath: `${pilotDir}/plan.md`,
            runlogPath: `${pilotDir}/runlog.md`,
            contextPath: `${pilotDir}/context.md`,
        };
    }
    async createOrchestrator(context) {
        const provider = (0, index_js_1.createProvider)(context.config);
        return new orchestrator_js_1.Orchestrator(provider, context, this.options.force || false);
    }
    startSpinner(text) {
        this.spinner = (0, ora_1.default)(text).start();
    }
    stopSpinner(success, text) {
        if (this.spinner) {
            if (success) {
                this.spinner.succeed(text);
            }
            else {
                this.spinner.fail(text);
            }
            this.spinner = null;
        }
    }
    log(message, color = 'white') {
        console.log(chalk_1.default[color](message));
    }
    error(message) {
        console.error(chalk_1.default.red(message));
    }
    success(message) {
        console.log(chalk_1.default.green(message));
    }
    warn(message) {
        console.log(chalk_1.default.yellow(message));
    }
    info(message) {
        console.log(chalk_1.default.cyan(message));
    }
}
exports.BaseCommand = BaseCommand;
//# sourceMappingURL=base.js.map