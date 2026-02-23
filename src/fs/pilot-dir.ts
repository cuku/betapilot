import * as fs from 'fs/promises';
import * as path from 'path';
import { DEFAULT_CONFIG, type PilotConfig } from '../types/config.js';

export const PILOT_DIR = '.pilot';
export const CONFIG_FILE = 'config.json';
export const SPEC_FILE = 'spec.md';
export const PLAN_FILE = 'plan.md';
export const RUNLOG_FILE = 'runlog.md';
export const CONTEXT_FILE = 'context.md';
export const STATE_FILE = 'state.json';

export function getPilotDir(cwd: string): string {
  return path.join(cwd, PILOT_DIR);
}

export function getPilotFilePath(cwd: string, filename: string): string {
  return path.join(getPilotDir(cwd), filename);
}

export async function ensurePilotDir(cwd: string): Promise<string> {
  const pilotDir = getPilotDir(cwd);
  await fs.mkdir(pilotDir, { recursive: true });
  return pilotDir;
}

export async function pilotDirExists(cwd: string): Promise<boolean> {
  try {
    const stat = await fs.stat(getPilotDir(cwd));
    return stat.isDirectory();
  } catch {
    return false;
  }
}

export async function loadConfig(cwd: string): Promise<PilotConfig> {
  const configPath = getPilotFilePath(cwd, CONFIG_FILE);
  
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(content);
    return { ...DEFAULT_CONFIG, ...config };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function saveConfig(cwd: string, config: PilotConfig): Promise<void> {
  const pilotDir = await ensurePilotDir(cwd);
  const configPath = path.join(pilotDir, CONFIG_FILE);
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

export async function initPilotDir(cwd: string): Promise<string> {
  const pilotDir = await ensurePilotDir(cwd);
  const configPath = path.join(pilotDir, CONFIG_FILE);
  
  try {
    await fs.access(configPath);
  } catch {
    await fs.writeFile(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf-8');
  }

  const files = [SPEC_FILE, PLAN_FILE, RUNLOG_FILE, CONTEXT_FILE];
  for (const file of files) {
    const filePath = path.join(pilotDir, file);
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, '', 'utf-8');
    }
  }

  return pilotDir;
}
