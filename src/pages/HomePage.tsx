import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../app/providers/ChatProvider';
import { AppLayout } from '../components/layout/AppLayout';

export default function HomePage() {
  const navigate = useNavigate();
  const { actions, state } = useChat();
  const activeChat = state.chats.find((chat) => chat.id === state.activeChatId) ?? null;

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

      if (chatId === state.activeChatId) {
        navigate('/', { replace: true });
      }
    },
    [actions, navigate, state.activeChatId],
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
      const chatId = await actions.sendMessage(content, state.activeChatId);
      if (chatId && chatId !== state.activeChatId) {
        navigate(`/chat/${chatId}`);
      }
    },
    [actions, navigate, state.activeChatId],
  );

  return (
    <AppLayout
      activeChat={activeChat}
      activeChatId={state.activeChatId}
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
