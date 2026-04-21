import { memo } from 'react';
import type { Chat } from '../../types';

type ChatItemProps = {
  chat: Chat;
  isActive: boolean;
  onDelete: (chatId: string) => void;
  onRename: (chatId: string) => void;
  onSelect: (chatId: string) => void;
};

function ChatItemComponent({ chat, isActive, onDelete, onRename, onSelect }: ChatItemProps) {
  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
  }).format(chat.updatedAt);
  const lastMessage = chat.messages[chat.messages.length - 1]?.content ?? 'Сообщений пока нет';

  return (
    <button type="button" className={`chat-item ${isActive ? 'chat-item-active' : ''}`} onClick={() => onSelect(chat.id)}>
      <span className="chat-item-copy">
        <span className="chat-title">{chat.title}</span>
        <span className="chat-date">{formattedDate}</span>
        <span className="chat-preview">{lastMessage}</span>
      </span>
      <span className="chat-actions">
        <button
          type="button"
          className="chat-action-button"
          aria-label="Переименовать чат"
          onClick={(event) => {
            event.stopPropagation();
            onRename(chat.id);
          }}
        >
          ✎
        </button>
        <button
          type="button"
          className="chat-action-button"
          aria-label="Удалить чат"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(chat.id);
          }}
        >
          ×
        </button>
      </span>
    </button>
  );
}

export const ChatItem = memo(ChatItemComponent);
