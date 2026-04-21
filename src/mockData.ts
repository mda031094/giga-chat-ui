import type { SettingsValues } from './types';

export const defaultSettings: SettingsValues = {
  model: 'GigaChat',
  temperature: 1,
  topP: 0.9,
  maxTokens: 2048,
  systemPrompt: 'Ты полезный ассистент.',
  theme: 'light',
};
