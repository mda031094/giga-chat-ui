import type { Chat } from '../../types';
import { ChatItem } from './ChatItem';

type ChatListProps = {
  activeChatId: string | null;
  chats: Chat[];
  onChatDelete: (chatId: string) => void;
  onChatRename: (chatId: string) => void;
  onChatSelect: (chatId: string) => void;
};

export function ChatList({ activeChatId, chats, onChatDelete, onChatRename, onChatSelect }: ChatListProps) {
  return (
    <nav className="chat-list" aria-label="Список чатов">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={activeChatId === chat.id}
          onDelete={() => onChatDelete(chat.id)}
          onRename={() => onChatRename(chat.id)}
          onSelect={() => onChatSelect(chat.id)}
        />
      ))}
    </nav>
  );
}
