import { defaultSettings } from '../mockData';
import type { ChatState } from '../types';

const STORAGE_KEY = 'gigachat-chat-ui-state-v2';

type PersistedState = Pick<ChatState, 'activeChatId' | 'auth' | 'chats' | 'theme'>;

function isPersistedState(value: unknown): value is PersistedState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<PersistedState>;
  return Array.isArray(candidate.chats) && typeof candidate.theme === 'string';
}

export function loadPersistedState(): PersistedState | null {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as unknown;
    return isPersistedState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function savePersistedState(state: PersistedState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function createEmptyPersistedState(): PersistedState {
  return {
    activeChatId: null,
    auth: {
      accessToken: null,
      credentials: '',
      expiresAt: null,
      isAuthorized: false,
      scope: 'GIGACHAT_API_PERS',
    },
    chats: [],
    theme: defaultSettings.theme,
  };
}
