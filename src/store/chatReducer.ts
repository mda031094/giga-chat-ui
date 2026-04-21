import type { Chat, ChatMessage, ChatState, ThemeMode } from '../types';

export type CreateChatPayload = {
  chat: Chat;
};

export type AddMessagePayload = {
  chatId: string;
  message: ChatMessage;
  nextTitle?: string;
};

export type UpdateMessagePayload = {
  chatId: string;
  messageId: string;
  content: string;
  mode: 'append' | 'replace';
};

type AuthPayload = ChatState['auth'];

export type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: AddMessagePayload }
  | { type: 'CREATE_CHAT'; payload: CreateChatPayload }
  | { type: 'DELETE_CHAT'; payload: { chatId: string } }
  | { type: 'HYDRATE'; payload: Pick<ChatState, 'activeChatId' | 'auth' | 'chats' | 'theme'> }
  | { type: 'RENAME_CHAT'; payload: { chatId: string; title: string } }
  | { type: 'SET_ACTIVE_CHAT'; payload: { chatId: string | null } }
  | { type: 'SET_AUTH'; payload: AuthPayload }
  | { type: 'SET_ERROR'; payload: { error: string | null } }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean } }
  | { type: 'SET_THEME'; payload: { theme: ThemeMode } }
  | { type: 'UPDATE_MESSAGE'; payload: UpdateMessagePayload };

export function createChatTitle(content: string, chatIndex: number) {
  const normalized = content.trim().replace(/\s+/g, ' ');
  if (normalized.length >= 3) {
    return normalized.slice(0, 40).trimEnd();
  }

  return chatIndex === 1 ? 'Новый чат' : `Диалог ${chatIndex}`;
}

export function createNewChat(chatIndex: number): Chat {
  const timestamp = Date.now();

  return {
    createdAt: timestamp,
    id: crypto.randomUUID(),
    messages: [],
    title: chatIndex === 1 ? 'Новый чат' : `Диалог ${chatIndex}`,
    updatedAt: timestamp,
  };
}

function upsertChat(chats: Chat[], payload: AddMessagePayload) {
  return chats.map((chat) => {
    if (chat.id !== payload.chatId) {
      return chat;
    }

    return {
      ...chat,
      messages: [...chat.messages, payload.message],
      title: payload.nextTitle ?? chat.title,
      updatedAt: payload.message.timestamp,
    };
  });
}

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        ...action.payload,
      };

    case 'SET_ACTIVE_CHAT':
      return {
        ...state,
        activeChatId: action.payload.chatId,
      };

    case 'CREATE_CHAT':
      return {
        ...state,
        activeChatId: action.payload.chat.id,
        chats: [action.payload.chat, ...state.chats],
      };

    case 'DELETE_CHAT': {
      const chats = state.chats.filter((chat) => chat.id !== action.payload.chatId);
      const nextActiveChatId = state.activeChatId === action.payload.chatId ? null : state.activeChatId;

      return {
        ...state,
        activeChatId: nextActiveChatId,
        chats,
      };
    }

    case 'RENAME_CHAT':
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.payload.chatId
            ? {
                ...chat,
                title: action.payload.title,
              }
            : chat,
        ),
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        chats: upsertChat(state.chats, action.payload),
      };

    case 'UPDATE_MESSAGE':
      return {
        ...state,
        chats: state.chats.map((chat) => {
          if (chat.id !== action.payload.chatId) {
            return chat;
          }

          return {
            ...chat,
            messages: chat.messages.map((message) =>
              message.id === action.payload.messageId
                ? {
                    ...message,
                    content:
                      action.payload.mode === 'append'
                        ? `${message.content}${action.payload.content}`
                        : action.payload.content,
                  }
                : message,
            ),
            updatedAt: Date.now(),
          };
        }),
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload.error,
      };

    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload.theme,
      };

    case 'SET_AUTH':
      return {
        ...state,
        auth: action.payload,
      };

    default:
      return state;
  }
}
