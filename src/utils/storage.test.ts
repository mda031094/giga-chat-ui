import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createEmptyPersistedState, loadPersistedState, savePersistedState } from './storage';

describe('storage', () => {
  const storage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', storage);
    vi.stubGlobal('window', {
      localStorage: storage,
    });
  });

  it('сохраняет состояние в localStorage', () => {
    const state = createEmptyPersistedState();
    state.activeChatId = 'chat-1';

    savePersistedState(state);

    expect(storage.setItem).toHaveBeenCalledOnce();
    expect(storage.setItem.mock.calls[0][0]).toBe('gigachat-chat-ui-state-v2');
  });

  it('восстанавливает корректные данные из localStorage', () => {
    const persistedState = createEmptyPersistedState();
    persistedState.activeChatId = 'chat-2';

    storage.getItem.mockReturnValue(JSON.stringify(persistedState));

    expect(loadPersistedState()).toEqual(persistedState);
  });

  it('возвращает null при битом JSON', () => {
    storage.getItem.mockReturnValue('{broken');

    expect(loadPersistedState()).toBeNull();
  });
});
