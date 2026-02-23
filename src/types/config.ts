export interface PilotConfig {
  provider: 'anthropic' | 'openai' | 'mock';
  model: string;
  allowShellCommands: string[];
  denyShellCommands: string[];
  testCommand: string;
  lintCommand: string;
  buildCommand: string;
  deployCommand: string;
  dryRunDefault: boolean;
  verbose: boolean;
  branchPrefix: string;
}

export interface ToolConfig {
  name: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

export interface PilotContext {
  cwd: string;
  pilotDir: string;
  config: PilotConfig;
  specPath: string;
  planPath: string;
  runlogPath: string;
  contextPath: string;
}

export const DEFAULT_CONFIG: PilotConfig = {
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
