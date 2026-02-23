import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StateMachine } from '../src/core/state-machine.js';

describe('StateMachine', () => {
  let stateMachine: StateMachine;

  beforeEach(() => {
    stateMachine = new StateMachine();
  });

  it('should start in UNINITIALIZED state', () => {
    expect(stateMachine.getState()).toBe('UNINITIALIZED');
  });

  it('should transition from UNINITIALIZED to SPEC_CREATED', () => {
    const result = stateMachine.transition('SPEC_CREATED');
    expect(result.success).toBe(true);
    expect(stateMachine.getState()).toBe('SPEC_CREATED');
  });

  it('should not allow arbitrary transitions', () => {
    const result = stateMachine.transition('IMPLEMENTING');
    expect(result.success).toBe(false);
  });

  it('should allow force mode transitions', () => {
    const forced = new StateMachine('UNINITIALIZED', true);
    const result = forced.transition('COMPLETE');
    expect(result.success).toBe(true);
  });

  it('should validate required states', () => {
    const result = stateMachine.requiresState('PLAN_CREATED', 'plan');
    expect(result.success).toBe(false);
  });

  it('should allow commands in correct state', () => {
    stateMachine.transition('SPEC_CREATED');
    stateMachine.transition('PLAN_CREATED');
    
    const result = stateMachine.requiresState('PLAN_CREATED', 'implement');
    expect(result.success).toBe(true);
  });

  it('should track history', () => {
    stateMachine.transition('SPEC_CREATED');
    stateMachine.transition('PLAN_CREATED');
    
    const history = stateMachine.getHistory();
    expect(history).toContain('UNINITIALIZED');
    expect(history).toContain('SPEC_CREATED');
    expect(history).toContain('PLAN_CREATED');
  });

  it('should reset to initial state', () => {
    stateMachine.transition('SPEC_CREATED');
    stateMachine.transition('PLAN_CREATED');
    stateMachine.reset();
    
    expect(stateMachine.getState()).toBe('UNINITIALIZED');
    expect(stateMachine.getHistory()).toEqual(['UNINITIALIZED']);
  });
});
