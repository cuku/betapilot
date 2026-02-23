"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployRunner = exports.BuildRunner = exports.LintRunner = exports.TestRunner = void 0;
const shell_js_1 = require("./shell.js");
class TestRunner {
    config;
    cwd;
    constructor(config, cwd) {
        this.config = config;
        this.cwd = cwd;
    }
    async run() {
        const command = this.config.testCommand;
        if (!command) {
            return {
                passed: false,
                command: '',
                output: 'No test command configured',
                exitCode: -1,
            };
        }
        const startTime = Date.now();
        const result = await (0, shell_js_1.safeExecute)(command, this.config.allowShellCommands, this.config.denyShellCommands, { cwd: this.cwd });
        return {
            passed: result.success,
            command,
            output: result.data ? result.data.stdout || '' : result.error || '',
            exitCode: result.success ? 0 : 1,
            duration: Date.now() - startTime,
        };
    }
}
exports.TestRunner = TestRunner;
class LintRunner {
    config;
    cwd;
    constructor(config, cwd) {
        this.config = config;
        this.cwd = cwd;
    }
    async run() {
        const command = this.config.lintCommand;
        if (!command) {
            return {
                passed: true,
                command: '',
                output: 'No lint command configured',
                exitCode: 0,
            };
        }
        const startTime = Date.now();
        const result = await (0, shell_js_1.safeExecute)(command, this.config.allowShellCommands, this.config.denyShellCommands, { cwd: this.cwd });
        return {
            passed: result.success,
            command,
            output: result.data ? result.data.stdout || '' : result.error || '',
            exitCode: result.success ? 0 : 1,
            duration: Date.now() - startTime,
        };
    }
}
exports.LintRunner = LintRunner;
class BuildRunner {
    config;
    cwd;
    constructor(config, cwd) {
        this.config = config;
        this.cwd = cwd;
    }
    async run() {
        const command = this.config.buildCommand;
        if (!command) {
            return {
                passed: false,
                command: '',
                output: 'No build command configured',
                exitCode: -1,
            };
        }
        const startTime = Date.now();
        const result = await (0, shell_js_1.safeExecute)(command, this.config.allowShellCommands, this.config.denyShellCommands, { cwd: this.cwd });
        return {
            passed: result.success,
            command,
            output: result.data ? result.data.stdout || '' : result.error || '',
            exitCode: result.success ? 0 : 1,
            duration: Date.now() - startTime,
        };
    }
}
exports.BuildRunner = BuildRunner;
class DeployRunner {
    config;
    cwd;
    constructor(config, cwd) {
        this.config = config;
        this.cwd = cwd;
    }
    async run() {
        const command = this.config.deployCommand;
        if (!command) {
            return {
                passed: true,
                command: '',
                output: 'No deploy command configured. Add one to .pilot/config.json',
                exitCode: 0,
            };
        }
        const startTime = Date.now();
        const result = await (0, shell_js_1.safeExecute)(command, this.config.allowShellCommands, this.config.denyShellCommands, { cwd: this.cwd });
        return {
            passed: result.success,
            command,
            output: result.data ? result.data.stdout || '' : result.error || '',
            exitCode: result.success ? 0 : 1,
            duration: Date.now() - startTime,
        };
    }
    getChecklist() {
        return [
            'All tests passing',
            'Code reviewed and approved',
            'Build succeeds without errors',
            'No security vulnerabilities detected',
            'Documentation updated if needed',
            'Version bumped if applicable',
            'Changelog updated',
            'Deployment environment ready',
        ];
    }
}
exports.DeployRunner = DeployRunner;
//# sourceMappingURL=runner.js.map