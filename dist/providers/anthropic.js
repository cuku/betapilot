"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnthropicProvider = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
class AnthropicProvider {
    client;
    modelName;
    constructor(apiKey, modelName = 'claude-sonnet-4-20250514') {
        const key = apiKey || process.env.ANTHROPIC_API_KEY;
        if (!key) {
            throw new Error('ANTHROPIC_API_KEY environment variable is required');
        }
        this.client = new sdk_1.default({ apiKey: key });
        this.modelName = modelName;
    }
    async chat(options) {
        const systemPrompt = options.systemPrompt || this.getDefaultSystemPrompt();
        const messages = options.messages.map(msg => ({
            role: msg.role,
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
    getModelName() {
        return this.modelName;
    }
    getDefaultSystemPrompt() {
        return `You are BetaPilot, a helpful AI assistant for software development. 
You help users define specifications, create implementation plans, write code, run tests, and review changes.
Be concise, practical, and focused on delivering working software.`;
    }
}
exports.AnthropicProvider = AnthropicProvider;
//# sourceMappingURL=anthropic.js.map