import type { Provider, ChatOptions, ChatResponse } from './types.js';
export declare class AnthropicProvider implements Provider {
    private client;
    private modelName;
    constructor(apiKey?: string, modelName?: string);
    chat(options: ChatOptions): Promise<ChatResponse>;
    getModelName(): string;
    private getDefaultSystemPrompt;
}
//# sourceMappingURL=anthropic.d.ts.map