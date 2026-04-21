import { useMemo, useState } from 'react';
import type { Chat } from '../../types';
import { ChatList } from './ChatList';
import { SearchInput } from './SearchInput';

type SidebarProps = {
  activeChatId: string | null;
  chats: Chat[];
  isOpen: boolean;
  onChatCreate: () => void;
  onChatDelete: (chatId: string) => void;
  onChatRename: (chatId: string) => void;
  onChatSelect: (chatId: string) => void;
  onClose: () => void;
};

export function Sidebar({
  activeChatId,
  chats,
  isOpen,
  onChatCreate,
  onChatDelete,
  onChatRename,
  onChatSelect,
  onClose,
}: SidebarProps) {
  const [query, setQuery] = useState('');

  const handleDeleteChat = (chatId: string) => {
    const confirmed = window.confirm('Удалить этот чат?');
    if (!confirmed) {
      return;
    }

    onChatDelete(chatId);
  };

  const filteredChats = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return chats;
    }

    return chats.filter((chat) => {
      const lastMessage = chat.messages[chat.messages.length - 1]?.content.toLowerCase() ?? '';
      return chat.title.toLowerCase().includes(normalizedQuery) || lastMessage.includes(normalizedQuery);
    });
  }, [chats, query]);

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <button className="new-chat-button" type="button" onClick={onChatCreate}>
            <span aria-hidden="true">+</span>
            Новый чат
          </button>
          <button className="sidebar-close" type="button" onClick={onClose} aria-label="Закрыть меню">
            ×
          </button>
        </div>

        <SearchInput value={query} onChange={setQuery} />
        <ChatList
          chats={filteredChats}
          activeChatId={activeChatId}
          onChatDelete={handleDeleteChat}
          onChatRename={onChatRename}
          onChatSelect={onChatSelect}
        />
      </aside>
      {isOpen ? <button className="sidebar-backdrop" type="button" aria-label="Закрыть меню" onClick={onClose} /> : null}
    </>
  );
}
