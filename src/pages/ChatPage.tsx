import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChat } from '../app/providers/ChatProvider';
import { AppLayout } from '../components/layout/AppLayout';

export default function ChatPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { actions, state } = useChat();

  const activeChat = state.chats.find((chat) => chat.id === id) ?? null;

  useEffect(() => {
    if (!id) {
      return;
    }

    if (activeChat) {
      actions.selectChat(id);
      return;
    }

    if (state.chats.length > 0) {
      navigate('/', { replace: true });
    }
  }, [actions, activeChat, id, navigate, state.chats.length]);

  const handleChatSelect = useCallback(
    (chatId: string) => {
      actions.selectChat(chatId);
      navigate(`/chat/${chatId}`);
    },
    [actions, navigate],
  );

  const handleCreateChat = useCallback(() => {
    const chatId = actions.createChat();
    navigate(`/chat/${chatId}`);
  }, [actions, navigate]);

  const handleDeleteChat = useCallback(
    (chatId: string) => {
      actions.deleteChat(chatId);

      if (chatId === id) {
        navigate('/', { replace: true });
      }
    },
    [actions, id, navigate],
  );

  const handleRenameChat = useCallback(
    (chatId: string) => {
      const targetChat = state.chats.find((chat) => chat.id === chatId);
      if (!targetChat) {
        return;
      }

      const nextTitle = window.prompt('Новое название чата', targetChat.title)?.trim();
      if (!nextTitle) {
        return;
      }

      actions.renameChat(chatId, nextTitle);
    },
    [actions, state.chats],
  );

  const handleSendMessage = useCallback(
    async (content: string) => {
      const chatId = await actions.sendMessage(content, id);
      if (chatId && chatId !== id) {
        navigate(`/chat/${chatId}`);
      }
    },
    [actions, id, navigate],
  );

  return (
    <AppLayout
      activeChat={activeChat}
      activeChatId={id ?? state.activeChatId}
      chats={state.chats}
      error={state.error}
      isLoading={state.isLoading}
      onChatCreate={handleCreateChat}
      onChatDelete={handleDeleteChat}
      onChatRename={handleRenameChat}
      onChatSelect={handleChatSelect}
      onMessageSubmit={handleSendMessage}
      onStopGeneration={actions.stopGeneration}
      onThemeChange={actions.setTheme}
      theme={state.theme}
    />
  );
}
