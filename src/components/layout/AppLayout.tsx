import { useState } from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { ChatWindow } from '../chat/ChatWindow';
import { SettingsPanel } from '../settings/SettingsPanel';
import type { Chat, ThemeMode } from '../../types';

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

  const handleChatSelect = (chatId: string) => {
    onChatSelect(chatId);
    setIsSidebarOpen(false);
  };

  return (
    <div className="app-shell">
      <button className="burger-button" type="button" onClick={() => setIsSidebarOpen(true)} aria-label="Открыть меню">
        ☰
      </button>

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

      <ChatWindow
        activeChat={activeChat}
        error={error}
        isLoading={isLoading}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onStopGeneration={onStopGeneration}
        onSubmit={onMessageSubmit}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        theme={theme}
        onClose={() => setIsSettingsOpen(false)}
        onThemeChange={onThemeChange}
      />
    </div>
  );
}
