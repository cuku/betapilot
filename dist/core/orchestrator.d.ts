import type { Provider } from '../providers/types.js';
import type { PilotContext } from '../types/config.js';
import type { CommandResult, ChatMessage } from '../types/state.js';
export declare class Orchestrator {
    private provider;
    private context;
    private stateMachine;
    private verbose;
    constructor(provider: Provider, context: PilotContext, forceMode?: boolean);
    private initializeState;
    chat(messages: ChatMessage[], systemPrompt?: string): Promise<string>;
    generateSpec(userRequirements: string): Promise<CommandResult>;
    generatePlan(): Promise<CommandResult>;
    generateImplementation(stepDescription: string): Promise<CommandResult>;
    generateReview(): Promise<CommandResult>;
    private generateReviewOnly;
    getState(): WorkflowState;
    private logAction;
}
export type WorkflowState = 'UNINITIALIZED' | 'SPEC_CREATED' | 'PLAN_CREATED' | 'IMPLEMENTING' | 'TESTING' | 'REVIEW' | 'COMPLETE' | 'ERROR';
//# sourceMappingURL=orchestrator.d.ts.map