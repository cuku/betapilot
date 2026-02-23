import type { WorkflowState, CommandResult } from '../types/state.js';
export declare class StateMachine {
    private currentState;
    private history;
    private forceMode;
    constructor(initialState?: WorkflowState, forceMode?: boolean);
    getState(): WorkflowState;
    getHistory(): WorkflowState[];
    canTransitionTo(newState: WorkflowState): boolean;
    transition(newState: WorkflowState): CommandResult;
    reset(): void;
    requiresState(requiredState: WorkflowState, command: string): CommandResult;
}
export declare function getStateFromFiles(specExists: boolean, planExists: boolean): WorkflowState;
//# sourceMappingURL=state-machine.d.ts.map