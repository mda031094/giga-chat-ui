import { FormEvent, useState } from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { ChatWindow } from '../chat/ChatWindow';
import { SettingsPanel } from '../settings/SettingsPanel';
import type { ChatMessage, ChatPreview, ThemeMode } from '../../types';

type AppLayoutProps = {
  activeChatId: string;
  chats: ChatPreview[];
  messages: ChatMessage[];
  theme: ThemeMode;
  title: string;
  onChatSelect: (chatId: string) => void;
  onMessageSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onThemeChange: (theme: ThemeMode) => void;
};

export function AppLayout({
  activeChatId,
  chats,
  messages,
  theme,
  title,
  onChatSelect,
  onMessageSubmit,
  onThemeChange,
}: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleChatSelect = (chatId: string) => {
    onChatSelect(chatId);
    setIsSidebarOpen(false);
  };

  return (
    <div className="app-shell" data-theme={theme}>
      <button className="burger-button" type="button" onClick={() => setIsSidebarOpen(true)} aria-label="Открыть меню">
        ☰
      </button>

      <Sidebar
        activeChatId={activeChatId}
        chats={chats}
        isOpen={isSidebarOpen}
        onChatSelect={handleChatSelect}
        onClose={() => setIsSidebarOpen(false)}
      />

      <ChatWindow
        title={title}
        messages={messages}
        onOpenSettings={() => setIsSettingsOpen(true)}
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
