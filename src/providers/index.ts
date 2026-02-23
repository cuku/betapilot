import type { Provider } from './types.js';
import { MockProvider } from './mock.js';
import { AnthropicProvider } from './anthropic.js';
import { OpenAIProvider } from './openai.js';
import type { PilotConfig } from '../types/config.js';

export type ProviderType = 'anthropic' | 'openai' | 'mock';

export function createProvider(config: PilotConfig): Provider {
  switch (config.provider) {
    case 'anthropic':
      return new AnthropicProvider(undefined, config.model);
    case 'openai':
      return new OpenAIProvider(undefined, undefined, config.model);
    case 'mock':
    default:
      return new MockProvider(config.model);
  }
}

export function getProviderFromEnv(): ProviderType {
  const envProvider = process.env.PILOT_PROVIDER?.toLowerCase();
  if (envProvider === 'openai' || envProvider === 'anthropic' || envProvider === 'mock') {
    return envProvider;
  }
  return 'anthropic';
}

export function getModelFromEnv(defaultModel: string): string {
  return process.env.PILOT_MODEL || defaultModel;
}

export { MockProvider, AnthropicProvider, OpenAIProvider };
export type { Provider } from './types.js';
