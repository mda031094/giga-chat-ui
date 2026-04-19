import type { ChatPreview } from '../../types';
import { ChatItem } from './ChatItem';

type ChatListProps = {
  activeChatId: string;
  chats: ChatPreview[];
  onChatSelect: (chatId: string) => void;
};

export function ChatList({ activeChatId, chats, onChatSelect }: ChatListProps) {
  return (
    <nav className="chat-list" aria-label="Список чатов">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={activeChatId === chat.id}
          onSelect={() => onChatSelect(chat.id)}
        />
      ))}
    </nav>
  );
}
