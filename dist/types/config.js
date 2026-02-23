"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = void 0;
exports.DEFAULT_CONFIG = {
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
    allowShellCommands: [
        'npm test',
        'npm run',
        'npm build',
        'npm install',
        'npx',
        'make test',
        'make build',
        'yarn test',
        'yarn build',
        'pnpm test',
        'pnpm build',
    ],
    denyShellCommands: [
        'rm -rf',
        'rm -r',
        'del /s /q',
        'format',
        'shutdown',
        'reboot',
        'mkfs',
        'dd if=',
    ],
    testCommand: 'npm test',
    lintCommand: 'npm run lint',
    buildCommand: 'npm run build',
    deployCommand: '',
    dryRunDefault: true,
    verbose: false,
    branchPrefix: 'pilot/',
};
//# sourceMappingURL=config.js.map