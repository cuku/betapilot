import { exec } from 'child_process';
import { promisify } from 'util';
import type { CommandResult } from '../types/state.js';

const execAsync = promisify(exec);

export interface ShellOptions {
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
}

export async function executeCommand(
  command: string,
  options: ShellOptions = {}
): Promise<CommandResult> {
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
  } catch (error) {
    const err = error as { stdout?: string; stderr?: string; message?: string };
    return {
      success: false,
      message: 'Command failed',
      error: err.message || 'Unknown error',
      data: { stdout: err.stdout || '', stderr: err.stderr || '' },
    };
  }
}

export function isCommandAllowed(
  command: string,
  allowList: string[],
  denyList: string[]
): { allowed: boolean; reason?: string } {
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

export async function safeExecute(
  command: string,
  allowList: string[],
  denyList: string[],
  options: ShellOptions = {}
): Promise<CommandResult> {
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
