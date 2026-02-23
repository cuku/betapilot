import type { WorkflowState, CommandResult } from '../types/state.js';

const STATE_TRANSITIONS: Record<WorkflowState, WorkflowState[]> = {
  UNINITIALIZED: ['SPEC_CREATED', 'ERROR'],
  SPEC_CREATED: ['PLAN_CREATED', 'ERROR'],
  PLAN_CREATED: ['IMPLEMENTING', 'ERROR'],
  IMPLEMENTING: ['TESTING', 'ERROR'],
  TESTING: ['REVIEW', 'ERROR'],
  REVIEW: ['COMPLETE', 'ERROR'],
  COMPLETE: [],
  ERROR: ['UNINITIALIZED', 'SPEC_CREATED'],
};

export class StateMachine {
  private currentState: WorkflowState;
  private history: WorkflowState[];
  private forceMode: boolean;

  constructor(initialState: WorkflowState = 'UNINITIALIZED', forceMode: boolean = false) {
    this.currentState = initialState;
    this.history = [initialState];
    this.forceMode = forceMode;
  }

  getState(): WorkflowState {
    return this.currentState;
  }

  getHistory(): WorkflowState[] {
    return [...this.history];
  }

  canTransitionTo(newState: WorkflowState): boolean {
    if (this.forceMode) {
      return true;
    }
    
    const allowed = STATE_TRANSITIONS[this.currentState];
    return allowed.includes(newState);
  }

  transition(newState: WorkflowState): CommandResult {
    if (!this.canTransitionTo(newState)) {
      return {
        success: false,
        message: `Cannot transition from ${this.currentState} to ${newState}`,
        error: `Use --force to override. Allowed transitions: ${STATE_TRANSITIONS[this.currentState].join(', ')}`,
      };
    }

    this.currentState = newState;
    this.history.push(newState);
    
    return {
      success: true,
      message: `Transitioned from ${this.history[this.history.length - 2]} to ${newState}`,
      data: { state: newState, history: this.history },
    };
  }

  reset(): void {
    this.currentState = 'UNINITIALIZED';
    this.history = ['UNINITIALIZED'];
  }

  requiresState(requiredState: WorkflowState, command: string): CommandResult {
    const order = ['UNINITIALIZED', 'SPEC_CREATED', 'PLAN_CREATED', 'IMPLEMENTING', 'TESTING', 'REVIEW', 'COMPLETE'];
    const currentIndex = order.indexOf(this.currentState);
    const requiredIndex = order.indexOf(requiredState);
    
    if (currentIndex < requiredIndex && !this.forceMode) {
      return {
        success: false,
        message: `Command /${command} requires ${requiredState} state`,
        error: `Current state: ${this.currentState}. Run previous commands first or use --force`,
      };
    }
    
    return { success: true, message: 'State check passed' };
  }
}

export function getStateFromFiles(specExists: boolean, planExists: boolean): WorkflowState {
  if (planExists) return 'PLAN_CREATED';
  if (specExists) return 'SPEC_CREATED';
  return 'UNINITIALIZED';
}
