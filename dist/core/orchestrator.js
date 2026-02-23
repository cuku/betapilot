"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orchestrator = void 0;
const index_js_1 = require("../fs/index.js");
const state_machine_js_1 = require("./state-machine.js");
class Orchestrator {
    provider;
    context;
    stateMachine;
    verbose;
    constructor(provider, context, forceMode = false) {
        this.provider = provider;
        this.context = context;
        this.verbose = context.config.verbose;
        this.stateMachine = new state_machine_js_1.StateMachine('UNINITIALIZED', forceMode);
        this.initializeState();
    }
    initializeState() {
        const specPath = this.context.specPath;
        const planPath = this.context.planPath;
        try {
            const specExists = require('fs').existsSync(specPath);
            const planExists = require('fs').existsSync(planPath);
            const initialState = (0, state_machine_js_1.getStateFromFiles)(specExists, planExists);
            this.stateMachine = new state_machine_js_1.StateMachine(initialState, false);
        }
        catch {
            this.stateMachine = new state_machine_js_1.StateMachine('UNINITIALIZED', false);
        }
    }
    async chat(messages, systemPrompt) {
        if (this.verbose) {
            console.log(`[BetaPilot] Sending ${messages.length} messages to ${this.provider.getModelName()}`);
        }
        const response = await this.provider.chat({ messages, systemPrompt });
        if (this.verbose) {
            console.log(`[BetaPilot] Received response (${response.usage?.outputTokens || 0} tokens)`);
        }
        return response.content;
    }
    async generateSpec(userRequirements) {
        const specPath = this.context.specPath;
        const systemPrompt = `You are BetaPilot, a requirements analyst. 
Create a detailed specification document based on user requirements.
Use markdown format with sections: Overview, Requirements, Acceptance Criteria.
Be specific and actionable.`;
        const messages = [
            { role: 'user', content: `Create a specification for: ${userRequirements}` },
        ];
        try {
            const spec = await this.chat(messages, systemPrompt);
            await (0, index_js_1.writeFile)(specPath, spec);
            this.stateMachine.transition('SPEC_CREATED');
            await this.logAction('spec', 'Created specification');
            return {
                success: true,
                message: `Specification created at ${specPath}`,
                data: { specPath, spec },
            };
        }
        catch (error) {
            this.stateMachine.transition('ERROR');
            return {
                success: false,
                message: 'Failed to generate specification',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    async generatePlan() {
        const specPath = this.context.specPath;
        const planPath = this.context.planPath;
        const check = this.stateMachine.requiresState('SPEC_CREATED', 'plan');
        if (!check.success)
            return check;
        try {
            const spec = await (0, index_js_1.readFile)(specPath);
            if (!spec) {
                return { success: false, message: 'No specification found', error: 'Run /spec first' };
            }
            const systemPrompt = `You are BetaPilot, a project planner.
Create a step-by-step implementation plan based on the specification.
Use markdown with numbered steps. Each step should be specific and actionable.`;
            const messages = [
                { role: 'user', content: `Create implementation plan:\n\n${spec}` },
            ];
            const plan = await this.chat(messages, systemPrompt);
            await (0, index_js_1.writeFile)(planPath, plan);
            this.stateMachine.transition('PLAN_CREATED');
            await this.logAction('plan', 'Created implementation plan');
            return {
                success: true,
                message: `Plan created at ${planPath}`,
                data: { planPath, plan },
            };
        }
        catch (error) {
            this.stateMachine.transition('ERROR');
            return {
                success: false,
                message: 'Failed to generate plan',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    async generateImplementation(stepDescription) {
        const planPath = this.context.planPath;
        const check = this.stateMachine.requiresState('PLAN_CREATED', 'implement');
        if (!check.success)
            return check;
        try {
            const plan = await (0, index_js_1.readFile)(planPath);
            const context = await (0, index_js_1.readFile)(this.context.contextPath);
            const systemPrompt = `You are BetaPilot, a code implementation assistant.
Generate code changes based on the plan step.
Output a diff in standard unified diff format.
Only output the diff, nothing else.`;
            const messages = [
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
        }
        catch (error) {
            this.stateMachine.transition('ERROR');
            return {
                success: false,
                message: 'Failed to generate implementation',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    async generateReview() {
        const check = this.stateMachine.requiresState('TESTING', 'review');
        if (!check.success) {
            return this.generateReviewOnly();
        }
        return this.generateReviewOnly();
    }
    async generateReviewOnly() {
        const systemPrompt = `You are BetaPilot, a code reviewer.
Analyze the changes and provide a review summary.
Include: Changes Made, Risks, Next Steps, Open Questions.
Be concise and practical.`;
        const context = await (0, index_js_1.readFile)(this.context.contextPath);
        const messages = [
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
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to generate review',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    getState() {
        return this.stateMachine.getState();
    }
    async logAction(command, message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${command}: ${message}\n`;
        await (0, index_js_1.appendFile)(this.context.runlogPath, logEntry);
    }
}
exports.Orchestrator = Orchestrator;
//# sourceMappingURL=orchestrator.js.map