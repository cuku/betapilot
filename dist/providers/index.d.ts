import type { Provider } from './types.js';
import { MockProvider } from './mock.js';
import { AnthropicProvider } from './anthropic.js';
import { OpenAIProvider } from './openai.js';
import type { PilotConfig } from '../types/config.js';
export type ProviderType = 'anthropic' | 'openai' | 'mock';
export declare function createProvider(config: PilotConfig): Provider;
export declare function getProviderFromEnv(): ProviderType;
export declare function getModelFromEnv(defaultModel: string): string;
export { MockProvider, AnthropicProvider, OpenAIProvider };
export type { Provider } from './types.js';
//# sourceMappingURL=index.d.ts.map