import type { Provider, ChatOptions, ChatResponse } from './types.js';
export declare class OpenAIProvider implements Provider {
    private client;
    private modelName;
    constructor(apiKey?: string, baseURL?: string, modelName?: string);
    chat(options: ChatOptions): Promise<ChatResponse>;
    getModelName(): string;
    private getDefaultSystemPrompt;
}
//# sourceMappingURL=openai.d.ts.map