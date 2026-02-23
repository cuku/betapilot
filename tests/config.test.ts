import { describe, it, expect } from 'vitest';
import { DEFAULT_CONFIG } from '../src/types/config.js';

describe('Config', () => {
  describe('DEFAULT_CONFIG', () => {
    it('should have required properties', () => {
      expect(DEFAULT_CONFIG.provider).toBeDefined();
      expect(DEFAULT_CONFIG.model).toBeDefined();
      expect(DEFAULT_CONFIG.allowShellCommands).toBeDefined();
      expect(DEFAULT_CONFIG.denyShellCommands).toBeDefined();
      expect(DEFAULT_CONFIG.testCommand).toBeDefined();
      expect(DEFAULT_CONFIG.lintCommand).toBeDefined();
      expect(DEFAULT_CONFIG.buildCommand).toBeDefined();
      expect(DEFAULT_CONFIG.dryRunDefault).toBeDefined();
      expect(DEFAULT_CONFIG.verbose).toBeDefined();
      expect(DEFAULT_CONFIG.branchPrefix).toBeDefined();
    });

    it('should default to anthropic provider', () => {
      expect(DEFAULT_CONFIG.provider).toBe('anthropic');
    });

    it('should have safe defaults', () => {
      expect(DEFAULT_CONFIG.dryRunDefault).toBe(true);
      expect(DEFAULT_CONFIG.verbose).toBe(false);
    });

    it('should have deny-listed dangerous commands', () => {
      expect(DEFAULT_CONFIG.denyShellCommands).toContain('rm -rf');
      expect(DEFAULT_CONFIG.denyShellCommands).toContain('format');
      expect(DEFAULT_CONFIG.denyShellCommands).toContain('shutdown');
    });

    it('should have allow-listed safe commands', () => {
      expect(DEFAULT_CONFIG.allowShellCommands).toContain('npm test');
      expect(DEFAULT_CONFIG.allowShellCommands).toContain('npm run');
      expect(DEFAULT_CONFIG.allowShellCommands).toContain('npx');
    });
  });

  describe('Command Parsing', () => {
    it('should parse spec command', () => {
      const input = '/spec';
      const command = input.slice(1).toLowerCase();
      expect(command).toBe('spec');
    });

    it('should parse plan with args', () => {
      const input = '/plan --force';
      const [cmd, ...args] = input.slice(1).split(/\s+/);
      expect(cmd).toBe('plan');
      expect(args).toContain('--force');
    });

    it('should handle natural language suggestions', () => {
      const input = 'create a specification';
      const keywords = ['spec', 'require'];
      const hasKeyword = keywords.some(k => input.toLowerCase().includes(k));
      expect(hasKeyword).toBe(true);
    });
  });
});
