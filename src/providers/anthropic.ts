import Anthropic from '@anthropic-ai/sdk';
import type { Provider, ChatOptions, ChatResponse } from './types.js';

export class AnthropicProvider implements Provider {
  private client: Anthropic;
  private modelName: string;

  constructor(apiKey?: string, modelName: string = 'claude-sonnet-4-20250514') {
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }
    this.client = new Anthropic({ apiKey: key });
    this.modelName = modelName;
  }

  async chat(options: ChatOptions): Promise<ChatResponse> {
    const systemPrompt = options.systemPrompt || this.getDefaultSystemPrompt();
    
    const messages = options.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    const response = await this.client.messages.create({
      model: this.modelName,
      system: systemPrompt,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic');
    }

    return {
      content: content.text,
      model: this.modelName,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  }

  getModelName(): string {
    return this.modelName;
  }

  private getDefaultSystemPrompt(): string {
    return `You are BetaPilot, a helpful AI assistant for software development. 
You help users define specifications, create implementation plans, write code, run tests, and review changes.
Be concise, practical, and focused on delivering working software.`;
  }
}
