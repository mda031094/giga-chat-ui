import { lazy, Suspense, useCallback, useState } from 'react';
import { ChatWindow } from '../chat/ChatWindow';
import type { Chat, ThemeMode } from '../../types';

const Sidebar = lazy(() => import('../sidebar/Sidebar').then((module) => ({ default: module.Sidebar })));
const SettingsPanel = lazy(() =>
  import('../settings/SettingsPanel').then((module) => ({ default: module.SettingsPanel })),
);

type AppLayoutProps = {
  activeChat: Chat | null;
  activeChatId: string | null;
  chats: Chat[];
  error: string | null;
  isLoading: boolean;
  onChatCreate: () => void;
  onChatDelete: (chatId: string) => void;
  onChatRename: (chatId: string) => void;
  theme: ThemeMode;
  onMessageSubmit: (content: string) => Promise<void>;
  onStopGeneration: () => void;
  onChatSelect: (chatId: string) => void;
  onThemeChange: (theme: ThemeMode) => void;
};

export function AppLayout({
  activeChat,
  activeChatId,
  chats,
  error,
  isLoading,
  onChatCreate,
  onChatDelete,
  onChatRename,
  onMessageSubmit,
  onStopGeneration,
  theme,
  onChatSelect,
  onThemeChange,
}: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleChatSelect = useCallback((chatId: string) => {
    onChatSelect(chatId);
    setIsSidebarOpen(false);
  }, [onChatSelect]);

  return (
    <div className="app-shell">
      <button className="burger-button" type="button" onClick={() => setIsSidebarOpen(true)} aria-label="Открыть меню">
        ☰
      </button>

      <Suspense fallback={<aside className="sidebar sidebar-skeleton" aria-hidden="true" />}>
        <Sidebar
          activeChatId={activeChatId}
          chats={chats}
          isOpen={isSidebarOpen}
          onChatCreate={onChatCreate}
          onChatDelete={onChatDelete}
          onChatRename={onChatRename}
          onChatSelect={handleChatSelect}
          onClose={() => setIsSidebarOpen(false)}
        />
      </Suspense>

      <ChatWindow
        activeChat={activeChat}
        error={error}
        isLoading={isLoading}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onStopGeneration={onStopGeneration}
        onSubmit={onMessageSubmit}
      />

      <Suspense fallback={null}>
        <SettingsPanel
          isOpen={isSettingsOpen}
          theme={theme}
          onClose={() => setIsSettingsOpen(false)}
          onThemeChange={onThemeChange}
        />
      </Suspense>
    </div>
  );
}
