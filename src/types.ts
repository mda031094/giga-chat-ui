export type ThemeMode = 'light' | 'dark';

export type ChatScope = 'GIGACHAT_API_PERS' | 'GIGACHAT_API_B2B' | 'GIGACHAT_API_CORP';

export type ChatRole = 'user' | 'assistant';

export type ChatPreview = {
  id: string;
  title: string;
  lastMessageDate: string;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  senderName: string;
  content: string;
};

export type SettingsValues = {
  model: 'GigaChat' | 'GigaChat-Plus' | 'GigaChat-Pro' | 'GigaChat-Max';
  temperature: number;
  topP: number;
  maxTokens: number;
  systemPrompt: string;
  theme: ThemeMode;
};
