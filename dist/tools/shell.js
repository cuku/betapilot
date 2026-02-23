"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCommand = executeCommand;
exports.isCommandAllowed = isCommandAllowed;
exports.safeExecute = safeExecute;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function executeCommand(command, options = {}) {
    try {
        const { stdout, stderr } = await execAsync(command, {
            cwd: options.cwd,
            env: { ...process.env, ...options.env },
            timeout: options.timeout || 60000,
        });
        return {
            success: true,
            message: 'Command executed successfully',
            data: { stdout, stderr },
        };
    }
    catch (error) {
        const err = error;
        return {
            success: false,
            message: 'Command failed',
            error: err.message || 'Unknown error',
            data: { stdout: err.stdout || '', stderr: err.stderr || '' },
        };
    }
}
function isCommandAllowed(command, allowList, denyList) {
    const normalizedCommand = command.toLowerCase().trim();
    for (const denied of denyList) {
        if (normalizedCommand.includes(denied.toLowerCase())) {
            return {
                allowed: false,
                reason: `Command contains denied pattern: ${denied}`
            };
        }
    }
    for (const allowed of allowList) {
        if (normalizedCommand.startsWith(allowed.toLowerCase()) ||
            normalizedCommand.includes(allowed.toLowerCase())) {
            return { allowed: true };
        }
    }
    return {
        allowed: false,
        reason: 'Command not in allow-list. Add it to .pilot/config.json'
    };
}
async function safeExecute(command, allowList, denyList, options = {}) {
    const check = isCommandAllowed(command, allowList, denyList);
    if (!check.allowed) {
        return {
            success: false,
            message: 'Command not allowed',
            error: check.reason,
        };
    }
    return executeCommand(command, options);
}
//# sourceMappingURL=shell.js.map