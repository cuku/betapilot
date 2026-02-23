import type { Provider, ChatOptions, ChatResponse } from './types.js';

export class MockProvider implements Provider {
  private modelName: string;
  private responses: Map<string, string>;

  constructor(modelName: string = 'mock-model') {
    this.modelName = modelName;
    this.responses = new Map();
    this.setupDefaultResponses();
  }

  private setupDefaultResponses(): void {
    this.responses.set(
      'spec',
      `# Project Specification

## Overview
A new feature implementation based on user requirements.

## Requirements
- Feature requirement 1
- Feature requirement 2
- Feature requirement 3

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3`
    );

    this.responses.set(
      'plan',
      `# Implementation Plan

## Step 1: Setup
Initialize necessary files and configurations.

## Step 2: Implementation
Implement the core functionality.

## Step 3: Testing
Write and run tests to verify the implementation.

## Step 4: Review
Review changes and ensure quality.`
    );

    this.responses.set(
      'implement',
      `I've analyzed the plan and will implement the required changes. Here's the patch:

\`\`\`diff
--- a/src/index.ts
+++ b/src/index.ts
@@ -1,3 +1,5 @@
+import { newFeature } from './features';
+
 export function hello() {
+  return newFeature();
 }
 \`\`\``
    );

    this.responses.set(
      'review',
      `# Code Review Summary

## Changes Made
- Modified 3 files
- Added 50 lines, removed 10 lines

## Risks
- Low risk: Changes are localized to specific modules

## Next Steps
1. Run full test suite
2. Update documentation
3. Consider follow-up improvements

## Open Questions
- Should we add more integration tests?`
    );
  }

  setResponse(key: string, response: string): void {
    this.responses.set(key, response);
  }

  async chat(options: ChatOptions): Promise<ChatResponse> {
    const lastMessage = options.messages[options.messages.length - 1]?.content || '';
    
    let response = 'Mock response from BetaPilot';
    
    if (lastMessage.toLowerCase().includes('custom')) {
      response = this.responses.get('custom') || response;
    } else if (lastMessage.toLowerCase().includes('spec')) {
      response = this.responses.get('spec') || response;
    } else if (lastMessage.toLowerCase().includes('plan')) {
      response = this.responses.get('plan') || response;
    } else if (lastMessage.toLowerCase().includes('implement')) {
      response = this.responses.get('implement') || response;
    } else if (lastMessage.toLowerCase().includes('review')) {
      response = this.responses.get('review') || response;
    }

    return {
      content: response,
      model: this.modelName,
      usage: {
        inputTokens: 100,
        outputTokens: 200,
      },
    };
  }

  getModelName(): string {
    return this.modelName;
  }
}
