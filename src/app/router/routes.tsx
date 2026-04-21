import { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { AuthForm } from '../../components/auth/AuthForm';
import { AppLayout } from '../../components/layout/AppLayout';
import { useChat } from '../providers/ChatProvider';

function ChatPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { actions, state } = useChat();

  const activeChatId = id ?? state.activeChatId;
  const activeChat = state.chats.find((chat) => chat.id === activeChatId) ?? null;

  useEffect(() => {
    if (id) {
      if (activeChat) {
        actions.selectChat(id);
      } else if (state.chats.length > 0) {
        navigate('/', { replace: true });
      }
    }
  }, [actions, activeChat, id, navigate, state.chats.length]);

  const handleChatSelect = (chatId: string) => {
    actions.selectChat(chatId);
    navigate(`/chat/${chatId}`);
  };

  const handleCreateChat = () => {
    const chatId = actions.createChat();
    navigate(`/chat/${chatId}`);
  };

  const handleDeleteChat = (chatId: string) => {
    const confirmed = window.confirm('Удалить этот чат?');
    if (!confirmed) {
      return;
    }

    actions.deleteChat(chatId);

    if (chatId === activeChatId) {
      navigate('/', { replace: true });
    }
  };

  const handleRenameChat = (chatId: string) => {
    const targetChat = state.chats.find((chat) => chat.id === chatId);
    if (!targetChat) {
      return;
    }

    const nextTitle = window.prompt('Новое название чата', targetChat.title)?.trim();
    if (!nextTitle) {
      return;
    }

    actions.renameChat(chatId, nextTitle);
  };

  const handleSendMessage = async (content: string) => {
    const chatId = await actions.sendMessage(content, activeChatId);
    if (chatId && chatId !== activeChatId) {
      navigate(`/chat/${chatId}`);
    }
  };

  return (
    <AppLayout
      activeChat={activeChat}
      activeChatId={activeChatId}
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

export function AppRoutes() {
  const { actions, state } = useChat();

  if (!state.auth.isAuthorized) {
    return (
      <AuthForm
        error={state.error ?? ''}
        onSubmit={actions.login}
        onThemeChange={actions.setTheme}
        theme={state.theme}
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route path="/chat/:id" element={<ChatPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
