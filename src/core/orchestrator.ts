import type { Provider } from '../providers/types.js';
import type { PilotContext, PilotConfig } from '../types/config.js';
import type { CommandResult, ChatMessage } from '../types/state.js';
import { readFile, writeFile, appendFile, getPilotFilePath } from '../fs/index.js';
import { StateMachine, getStateFromFiles } from './state-machine.js';

export class Orchestrator {
  private provider: Provider;
  private context: PilotContext;
  private stateMachine: StateMachine;
  private verbose: boolean;

  constructor(provider: Provider, context: PilotContext, forceMode: boolean = false) {
    this.provider = provider;
    this.context = context;
    this.verbose = context.config.verbose;
    this.stateMachine = new StateMachine('UNINITIALIZED', forceMode);
    this.initializeState();
  }

  private initializeState(): void {
    const specPath = this.context.specPath;
    const planPath = this.context.planPath;
    
    try {
      const specExists = require('fs').existsSync(specPath);
      const planExists = require('fs').existsSync(planPath);
      const initialState = getStateFromFiles(specExists, planExists);
      this.stateMachine = new StateMachine(initialState, false);
    } catch {
      this.stateMachine = new StateMachine('UNINITIALIZED', false);
    }
  }

  async chat(messages: ChatMessage[], systemPrompt?: string): Promise<string> {
    if (this.verbose) {
      console.log(`[BetaPilot] Sending ${messages.length} messages to ${this.provider.getModelName()}`);
    }

    const response = await this.provider.chat({ messages, systemPrompt });
    
    if (this.verbose) {
      console.log(`[BetaPilot] Received response (${response.usage?.outputTokens || 0} tokens)`);
    }

    return response.content;
  }

  async generateSpec(userRequirements: string): Promise<CommandResult> {
    const specPath = this.context.specPath;
    
    const systemPrompt = `You are BetaPilot, a requirements analyst. 
Create a detailed specification document based on user requirements.
Use markdown format with sections: Overview, Requirements, Acceptance Criteria.
Be specific and actionable.`;

    const messages: ChatMessage[] = [
      { role: 'user', content: `Create a specification for: ${userRequirements}` },
    ];

    try {
      const spec = await this.chat(messages, systemPrompt);
      await writeFile(specPath, spec);
      
      this.stateMachine.transition('SPEC_CREATED');
      await this.logAction('spec', 'Created specification');
      
      return {
        success: true,
        message: `Specification created at ${specPath}`,
        data: { specPath, spec },
      };
    } catch (error) {
      this.stateMachine.transition('ERROR');
      return {
        success: false,
        message: 'Failed to generate specification',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async generatePlan(): Promise<CommandResult> {
    const specPath = this.context.specPath;
    const planPath = this.context.planPath;
    
    const check = this.stateMachine.requiresState('SPEC_CREATED', 'plan');
    if (!check.success) return check;

    try {
      const spec = await readFile(specPath);
      if (!spec) {
        return { success: false, message: 'No specification found', error: 'Run /spec first' };
      }

      const systemPrompt = `You are BetaPilot, a project planner.
Create a step-by-step implementation plan based on the specification.
Use markdown with numbered steps. Each step should be specific and actionable.`;

      const messages: ChatMessage[] = [
        { role: 'user', content: `Create implementation plan:\n\n${spec}` },
      ];

      const plan = await this.chat(messages, systemPrompt);
      await writeFile(planPath, plan);
      
      this.stateMachine.transition('PLAN_CREATED');
      await this.logAction('plan', 'Created implementation plan');
      
      return {
        success: true,
        message: `Plan created at ${planPath}`,
        data: { planPath, plan },
      };
    } catch (error) {
      this.stateMachine.transition('ERROR');
      return {
        success: false,
        message: 'Failed to generate plan',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async generateImplementation(stepDescription: string): Promise<CommandResult> {
    const planPath = this.context.planPath;
    
    const check = this.stateMachine.requiresState('PLAN_CREATED', 'implement');
    if (!check.success) return check;

    try {
      const plan = await readFile(planPath);
      const context = await readFile(this.context.contextPath);

      const systemPrompt = `You are BetaPilot, a code implementation assistant.
Generate code changes based on the plan step.
Output a diff in standard unified diff format.
Only output the diff, nothing else.`;

      const messages: ChatMessage[] = [
        { role: 'user', content: `Context:\n${context}\n\nPlan:\n${plan}\n\nImplement step: ${stepDescription}` },
      ];

      this.stateMachine.transition('IMPLEMENTING');
      
      const diff = await this.chat(messages, systemPrompt);
      await this.logAction('implement', `Generated diff for: ${stepDescription}`);
      
      return {
        success: true,
        message: 'Implementation generated',
        data: { diff },
      };
    } catch (error) {
      this.stateMachine.transition('ERROR');
      return {
        success: false,
        message: 'Failed to generate implementation',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async generateReview(): Promise<CommandResult> {
    const check = this.stateMachine.requiresState('TESTING', 'review');
    if (!check.success) {
      return this.generateReviewOnly();
    }
    return this.generateReviewOnly();
  }

  private async generateReviewOnly(): Promise<CommandResult> {
    const systemPrompt = `You are BetaPilot, a code reviewer.
Analyze the changes and provide a review summary.
Include: Changes Made, Risks, Next Steps, Open Questions.
Be concise and practical.`;

    const context = await readFile(this.context.contextPath);

    const messages: ChatMessage[] = [
      { role: 'user', content: `Generate a code review summary for changes:\n${context}` },
    ];

    try {
      const review = await this.chat(messages, systemPrompt);
      this.stateMachine.transition('REVIEW');
      await this.logAction('review', 'Generated code review');
      
      return {
        success: true,
        message: 'Review generated',
        data: { review },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to generate review',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  getState(): WorkflowState {
    return this.stateMachine.getState();
  }

  private async logAction(command: string, message: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${command}: ${message}\n`;
    await appendFile(this.context.runlogPath, logEntry);
  }
}

export type WorkflowState = 'UNINITIALIZED' | 'SPEC_CREATED' | 'PLAN_CREATED' | 'IMPLEMENTING' | 'TESTING' | 'REVIEW' | 'COMPLETE' | 'ERROR';
