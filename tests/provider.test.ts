import { describe, it, expect } from 'vitest';
import { MockProvider } from '../src/providers/mock.js';

describe('MockProvider', () => {
  it('should return mock model name', () => {
    const provider = new MockProvider('test-model');
    expect(provider.getModelName()).toBe('test-model');
  });

  it('should return spec response for spec requests', async () => {
    const provider = new MockProvider();
    const response = await provider.chat({
      messages: [{ role: 'user', content: 'Create a spec' }],
    });
    
    expect(response.content).toContain('Project Specification');
    expect(response.model).toBe('mock-model');
  });

  it('should return plan response for plan requests', async () => {
    const provider = new MockProvider();
    const response = await provider.chat({
      messages: [{ role: 'user', content: 'Create a plan' }],
    });
    
    expect(response.content).toContain('Implementation Plan');
  });

  it('should return implement response for implement requests', async () => {
    const provider = new MockProvider();
    const response = await provider.chat({
      messages: [{ role: 'user', content: 'Implement the changes' }],
    });
    
    expect(response.content).toContain('diff');
  });

  it('should return review response for review requests', async () => {
    const provider = new MockProvider();
    const response = await provider.chat({
      messages: [{ role: 'user', content: 'Review the code' }],
    });
    
    expect(response.content).toContain('Code Review Summary');
  });

  it('should include usage information', async () => {
    const provider = new MockProvider();
    const response = await provider.chat({
      messages: [{ role: 'user', content: 'test' }],
    });
    
    expect(response.usage).toBeDefined();
    expect(response.usage?.inputTokens).toBeGreaterThan(0);
    expect(response.usage?.outputTokens).toBeGreaterThan(0);
  });

  it('should allow setting custom responses', async () => {
    const provider = new MockProvider();
    provider.setResponse('custom', 'Custom response');
    
    const response = await provider.chat({
      messages: [{ role: 'user', content: 'custom' }],
    });
    
    expect(response.content).toBe('Custom response');
  });
});
