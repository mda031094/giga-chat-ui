import { useMemo, useState } from 'react';
import type { ChatPreview } from '../../types';
import { ChatList } from './ChatList';
import { SearchInput } from './SearchInput';

type SidebarProps = {
  activeChatId: string;
  chats: ChatPreview[];
  isOpen: boolean;
  onChatSelect: (chatId: string) => void;
  onClose: () => void;
};

export function Sidebar({ activeChatId, chats, isOpen, onChatSelect, onClose }: SidebarProps) {
  const [query, setQuery] = useState('');

  const filteredChats = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return chats;
    }

    return chats.filter((chat) => chat.title.toLowerCase().includes(normalizedQuery));
  }, [chats, query]);

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <button className="new-chat-button" type="button">
            <span aria-hidden="true">+</span>
            Новый чат
          </button>
          <button className="sidebar-close" type="button" onClick={onClose} aria-label="Закрыть меню">
            ×
          </button>
        </div>

        <SearchInput value={query} onChange={setQuery} />
        <ChatList chats={filteredChats} activeChatId={activeChatId} onChatSelect={onChatSelect} />
      </aside>
      {isOpen ? <button className="sidebar-backdrop" type="button" aria-label="Закрыть меню" onClick={onClose} /> : null}
    </>
  );
}
