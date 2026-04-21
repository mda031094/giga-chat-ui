export type ThemeMode = 'light' | 'dark';

export type ChatScope = 'GIGACHAT_API_PERS' | 'GIGACHAT_API_B2B' | 'GIGACHAT_API_CORP';

export type ChatRole = 'system' | 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
};

export type Chat = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
};

export type AuthState = {
  accessToken: string | null;
  credentials: string;
  expiresAt: number | null;
  isAuthorized: boolean;
  scope: ChatScope;
};

export type ChatState = {
  chats: Chat[];
  activeChatId: string | null;
  isLoading: boolean;
  error: string | null;
  theme: ThemeMode;
  auth: AuthState;
};

export type SettingsValues = {
  model: 'GigaChat' | 'GigaChat-Plus' | 'GigaChat-Pro' | 'GigaChat-Max';
  temperature: number;
  topP: number;
  maxTokens: number;
  systemPrompt: string;
  theme: ThemeMode;
};
