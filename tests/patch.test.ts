import { describe, it, expect } from 'vitest';
import { generateDiff, createPatchInfo, parsePatch } from '../src/fs/patch.js';

describe('Patch Operations', () => {
  describe('generateDiff', () => {
    it('should generate a unified diff', () => {
      const original = 'line 1\nline 2\nline 3\n';
      const newContent = 'line 1\nmodified line 2\nline 3\n';
      
      const diff = generateDiff(original, newContent, 'test.txt');
      
      expect(diff).toContain('--- a/test.txt');
      expect(diff).toContain('+++ b/test.txt');
      expect(diff).toContain('-line 2');
      expect(diff).toContain('+modified line 2');
    });

    it('should handle additions', () => {
      const original = 'line 1\n';
      const newContent = 'line 1\nline 2\n';
      
      const diff = generateDiff(original, newContent, 'test.txt');
      
      expect(diff).toContain('+line 2');
    });

    it('should handle deletions', () => {
      const original = 'line 1\nline 2\n';
      const newContent = 'line 1\n';
      
      const diff = generateDiff(original, newContent, 'test.txt');
      
      expect(diff).toContain('-line 2');
    });

    it('should handle empty files', () => {
      const original = '';
      const newContent = 'new content\n';
      
      const diff = generateDiff(original, newContent, 'test.txt');
      
      expect(diff).toContain('+new content');
    });
  });

  describe('createPatchInfo', () => {
    it('should create patch info with diff', () => {
      const original = 'hello world\n';
      const newContent = 'hello universe\n';
      
      const patch = createPatchInfo('test.txt', original, newContent);
      
      expect(patch.filePath).toBe('test.txt');
      expect(patch.originalContent).toBe(original);
      expect(patch.newContent).toBe(newContent);
      expect(patch.diff).toBeTruthy();
    });
  });

  describe('parsePatch', () => {
    it('should parse a simple patch', () => {
      const patch = `--- a/test.txt
+++ b/test.txt
@@ -1 +1 @@
-hello
+world
`;
      
      const patches = parsePatch(patch);
      
      expect(patches.length).toBeGreaterThan(0);
    });

    it('should return empty array for invalid patch', () => {
      const patch = 'not a valid patch';
      const patches = parsePatch(patch);
      
      expect(patches).toEqual([]);
    });
  });
});
