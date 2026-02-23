import OpenAI from 'openai';
import type { Provider, ChatOptions, ChatResponse } from './types.js';

export class OpenAIProvider implements Provider {
  private client: OpenAI;
  private modelName: string;

  constructor(apiKey?: string, baseURL?: string, modelName: string = 'gpt-4') {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    this.client = new OpenAI({
      apiKey: key,
      baseURL: baseURL || process.env.OPENAI_BASE_URL || undefined,
    });
    this.modelName = modelName;
  }

  async chat(options: ChatOptions): Promise<ChatResponse> {
    const systemPrompt = options.systemPrompt || this.getDefaultSystemPrompt();
    
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...options.messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    const response = await this.client.chat.completions.create({
      model: this.modelName,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
    });

    const choice = response.choices[0];
    if (!choice?.message?.content) {
      throw new Error('No response content from OpenAI');
    }

    return {
      content: choice.message.content,
      model: this.modelName,
      usage: {
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
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
