import type { Provider, ChatOptions, ChatResponse } from './types.js';
export declare class MockProvider implements Provider {
    private modelName;
    private responses;
    constructor(modelName?: string);
    private setupDefaultResponses;
    setResponse(key: string, response: string): void;
    chat(options: ChatOptions): Promise<ChatResponse>;
    getModelName(): string;
}
//# sourceMappingURL=mock.d.ts.map