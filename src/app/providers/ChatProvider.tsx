import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type PropsWithChildren,
} from 'react';
import { createChatCompletion, requestAccessToken } from '../../api/gigachat';
import { defaultSettings } from '../../mockData';
import type { Chat, ChatMessage, ChatScope, ChatState, ThemeMode } from '../../types';
import { chatReducer, createChatTitle, createNewChat, type ChatAction } from '../../store/chatReducer';
import { createEmptyPersistedState, loadPersistedState, savePersistedState } from '../../utils/storage';

type ChatContextValue = {
  state: ChatState;
  actions: {
    createChat: () => string;
    deleteChat: (chatId: string) => void;
    login: (credentials: string, scope: ChatScope) => Promise<void>;
    renameChat: (chatId: string, title: string) => void;
    selectChat: (chatId: string | null) => void;
    sendMessage: (content: string, chatId?: string | null) => Promise<string>;
    setError: (error: string | null) => void;
    setTheme: (theme: ThemeMode) => void;
    stopGeneration: () => void;
  };
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function createInitialState(): ChatState {
  const persisted = typeof window !== 'undefined' ? loadPersistedState() : null;
  const fallback = createEmptyPersistedState();

  return {
    ...(persisted ?? fallback),
    error: null,
    isLoading: false,
  };
}

export function ChatProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(chatReducer, undefined, createInitialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    savePersistedState({
      activeChatId: state.activeChatId,
      auth: state.auth,
      chats: state.chats,
      theme: state.theme,
    });
  }, [state.activeChatId, state.auth, state.chats, state.theme]);

  const setTheme = useCallback((theme: ThemeMode) => {
    dispatch({ type: 'SET_THEME', payload: { theme } });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: { error } });
  }, []);

  const selectChat = useCallback((chatId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: { chatId } });
  }, []);

  const createChat = useCallback(() => {
    const chat = createNewChat(state.chats.length + 1);
    dispatch({ type: 'CREATE_CHAT', payload: { chat } });
    return chat.id;
  }, [state.chats.length]);

  const renameChat = useCallback((chatId: string, title: string) => {
    dispatch({
      type: 'RENAME_CHAT',
      payload: {
        chatId,
        title,
      },
    });
  }, []);

  const deleteChat = useCallback(
    (chatId: string) => {
      if (state.activeChatId === chatId && abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
        dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
      }

      dispatch({
        type: 'DELETE_CHAT',
        payload: { chatId },
      });
    },
    [state.activeChatId],
  );

  const login = useCallback(async (credentials: string, scope: ChatScope) => {
    dispatch({ type: 'SET_ERROR', payload: { error: null } });

    try {
      const session = await requestAccessToken(credentials, scope);

      dispatch({
        type: 'SET_AUTH',
        payload: {
          accessToken: session.accessToken,
          credentials,
          expiresAt: session.expiresAt,
          isAuthorized: true,
          scope,
        },
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          error: error instanceof Error ? error.message : 'Не удалось авторизоваться в GigaChat.',
        },
      });
    }
  }, []);

  const ensureAccessToken = useCallback(async () => {
    const expiresAtMs = state.auth.expiresAt ? state.auth.expiresAt * 1000 : 0;
    const hasValidToken = Boolean(
      state.auth.accessToken && expiresAtMs > Date.now() + 60_000,
    );

    if (hasValidToken && state.auth.accessToken) {
      return state.auth.accessToken;
    }

    if (!state.auth.credentials) {
      throw new Error('Сначала выполните авторизацию в GigaChat.');
    }

    const session = await requestAccessToken(state.auth.credentials, state.auth.scope);

    dispatch({
      type: 'SET_AUTH',
      payload: {
        ...state.auth,
        accessToken: session.accessToken,
        expiresAt: session.expiresAt,
        isAuthorized: true,
      },
    });

    return session.accessToken;
  }, [state.auth]);

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
  }, []);

  const sendMessage = useCallback(
    async (content: string, chatId?: string | null) => {
      const trimmedContent = content.trim();
      if (!trimmedContent) {
        return chatId ?? state.activeChatId ?? '';
      }

      let targetChat = state.chats.find((item) => item.id === (chatId ?? state.activeChatId));

      if (!targetChat) {
        targetChat = createNewChat(state.chats.length + 1);
        dispatch({ type: 'CREATE_CHAT', payload: { chat: targetChat } });
      }

      dispatch({ type: 'SET_ACTIVE_CHAT', payload: { chatId: targetChat.id } });
      dispatch({ type: 'SET_ERROR', payload: { error: null } });

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmedContent,
        timestamp: Date.now(),
      };

      const assistantMessageId = crypto.randomUUID();
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      const hadUserMessages = targetChat.messages.some((message) => message.role === 'user');
      const nextTitle =
        !hadUserMessages || targetChat.title.startsWith('Новый чат') || targetChat.title.startsWith('Диалог ')
          ? createChatTitle(trimmedContent, state.chats.length + 1)
          : undefined;

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          chatId: targetChat.id,
          message: userMessage,
          nextTitle,
        },
      });

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          chatId: targetChat.id,
          message: assistantMessage,
        },
      });

      dispatch({ type: 'SET_LOADING', payload: { isLoading: true } });

      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      try {
        const accessToken = await ensureAccessToken();

        const history = [...targetChat.messages, userMessage]
          .filter((message) => message.role === 'user' || message.role === 'assistant')
          .map((message) => ({
            role: message.role,
            content: message.content,
            timestamp: message.timestamp,
            id: message.id,
          }));

        const assistantContent = await createChatCompletion({
          messages: [
            {
              id: 'system-message',
              role: 'system',
              content: defaultSettings.systemPrompt,
              timestamp: Date.now(),
            },
            ...history,
          ],
          model: defaultSettings.model,
          onDelta: (chunk) => {
            dispatch({
              type: 'UPDATE_MESSAGE',
              payload: {
                chatId: targetChat!.id,
                content: chunk,
                messageId: assistantMessageId,
                mode: 'append',
              },
            });
          },
          signal: abortControllerRef.current.signal,
          stream: true,
          token: accessToken,
        });

        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            chatId: targetChat.id,
            content: assistantContent,
            messageId: assistantMessageId,
            mode: 'replace',
          },
        });
      } catch (error) {
        const wasAborted =
          error instanceof DOMException && error.name === 'AbortError';

        dispatch({
          type: 'SET_ERROR',
          payload: {
            error: wasAborted ? 'Генерация остановлена.' : error instanceof Error ? error.message : 'Ошибка запроса к GigaChat.',
          },
        });
      } finally {
        abortControllerRef.current = null;
        dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
      }

      return targetChat.id;
    },
    [ensureAccessToken, state.activeChatId, state.chats],
  );

  const value = useMemo<ChatContextValue>(
    () => ({
      actions: {
        createChat,
        deleteChat,
        login,
        renameChat,
        selectChat,
        sendMessage,
        setError,
        setTheme,
        stopGeneration,
      },
      state,
    }),
    [createChat, deleteChat, login, renameChat, selectChat, sendMessage, setError, setTheme, state, stopGeneration],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }

  return context;
}
