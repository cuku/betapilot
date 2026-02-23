"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = exports.AnthropicProvider = exports.MockProvider = void 0;
exports.createProvider = createProvider;
exports.getProviderFromEnv = getProviderFromEnv;
exports.getModelFromEnv = getModelFromEnv;
const mock_js_1 = require("./mock.js");
Object.defineProperty(exports, "MockProvider", { enumerable: true, get: function () { return mock_js_1.MockProvider; } });
const anthropic_js_1 = require("./anthropic.js");
Object.defineProperty(exports, "AnthropicProvider", { enumerable: true, get: function () { return anthropic_js_1.AnthropicProvider; } });
const openai_js_1 = require("./openai.js");
Object.defineProperty(exports, "OpenAIProvider", { enumerable: true, get: function () { return openai_js_1.OpenAIProvider; } });
function createProvider(config) {
    switch (config.provider) {
        case 'anthropic':
            return new anthropic_js_1.AnthropicProvider(undefined, config.model);
        case 'openai':
            return new openai_js_1.OpenAIProvider(undefined, undefined, config.model);
        case 'mock':
        default:
            return new mock_js_1.MockProvider(config.model);
    }
}
function getProviderFromEnv() {
    const envProvider = process.env.PILOT_PROVIDER?.toLowerCase();
    if (envProvider === 'openai' || envProvider === 'anthropic' || envProvider === 'mock') {
        return envProvider;
    }
    return 'anthropic';
}
function getModelFromEnv(defaultModel) {
    return process.env.PILOT_MODEL || defaultModel;
}
//# sourceMappingURL=index.js.map