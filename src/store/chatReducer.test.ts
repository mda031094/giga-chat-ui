import { describe, expect, it, vi } from 'vitest';
import { chatReducer } from './chatReducer';
import type { Chat, ChatMessage, ChatState } from '../types';

function createMessage(id: string, role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id,
    role,
    content,
    timestamp: 1,
  };
}

function createChat(id: string, title: string, messages: ChatMessage[] = []): Chat {
  return {
    id,
    title,
    messages,
    createdAt: 1,
    updatedAt: 1,
  };
}

function createState(): ChatState {
  return {
    activeChatId: 'chat-1',
    auth: {
      accessToken: null,
      credentials: '',
      expiresAt: null,
      isAuthorized: false,
      scope: 'GIGACHAT_API_PERS',
    },
    chats: [createChat('chat-1', 'Первый чат', [createMessage('m1', 'user', 'Привет')])],
    error: null,
    isLoading: false,
    theme: 'light',
  };
}

describe('chatReducer', () => {
  it('ADD_MESSAGE добавляет сообщение в конец массива', () => {
    const state = createState();
    const message = createMessage('m2', 'assistant', 'Ответ');

    const nextState = chatReducer(state, {
      type: 'ADD_MESSAGE',
      payload: {
        chatId: 'chat-1',
        message,
      },
    });

    expect(nextState.chats[0].messages).toHaveLength(2);
    expect(nextState.chats[0].messages[1]).toEqual(message);
  });

  it('CREATE_CHAT создает новый чат и делает его активным', () => {
    const state = createState();
    const chat = createChat('chat-2', 'Новый чат');

    const nextState = chatReducer(state, {
      type: 'CREATE_CHAT',
      payload: { chat },
    });

    expect(nextState.chats[0].id).toBe('chat-2');
    expect(nextState.chats).toHaveLength(2);
    expect(nextState.activeChatId).toBe('chat-2');
  });

  it('DELETE_CHAT удаляет чат и сбрасывает activeChatId для активного чата', () => {
    const state = createState();

    const nextState = chatReducer(state, {
      type: 'DELETE_CHAT',
      payload: { chatId: 'chat-1' },
    });

    expect(nextState.chats).toHaveLength(0);
    expect(nextState.activeChatId).toBeNull();
  });

  it('RENAME_CHAT обновляет название чата по id', () => {
    const state = createState();

    const nextState = chatReducer(state, {
      type: 'RENAME_CHAT',
      payload: {
        chatId: 'chat-1',
        title: 'Переименованный чат',
      },
    });

    expect(nextState.chats[0].title).toBe('Переименованный чат');
  });
});
