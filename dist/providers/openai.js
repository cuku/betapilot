"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const openai_1 = __importDefault(require("openai"));
class OpenAIProvider {
    client;
    modelName;
    constructor(apiKey, baseURL, modelName = 'gpt-4') {
        const key = apiKey || process.env.OPENAI_API_KEY;
        if (!key) {
            throw new Error('OPENAI_API_KEY environment variable is required');
        }
        this.client = new openai_1.default({
            apiKey: key,
            baseURL: baseURL || process.env.OPENAI_BASE_URL || undefined,
        });
        this.modelName = modelName;
    }
    async chat(options) {
        const systemPrompt = options.systemPrompt || this.getDefaultSystemPrompt();
        const messages = [
            { role: 'system', content: systemPrompt },
            ...options.messages.map(msg => ({
                role: msg.role,
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
    getModelName() {
        return this.modelName;
    }
    getDefaultSystemPrompt() {
        return `You are BetaPilot, a helpful AI assistant for software development. 
You help users define specifications, create implementation plans, write code, run tests, and review changes.
Be concise, practical, and focused on delivering working software.`;
    }
}
exports.OpenAIProvider = OpenAIProvider;
//# sourceMappingURL=openai.js.map