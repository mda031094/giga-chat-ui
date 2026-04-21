import type { Chat } from '../../types';

type ChatItemProps = {
  chat: Chat;
  isActive: boolean;
  onDelete: () => void;
  onRename: () => void;
  onSelect: () => void;
};

export function ChatItem({ chat, isActive, onDelete, onRename, onSelect }: ChatItemProps) {
  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
  }).format(chat.updatedAt);
  const lastMessage = chat.messages[chat.messages.length - 1]?.content ?? 'Сообщений пока нет';

  return (
    <button type="button" className={`chat-item ${isActive ? 'chat-item-active' : ''}`} onClick={onSelect}>
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
            onRename();
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
            onDelete();
          }}
        >
          ×
        </button>
      </span>
    </button>
  );
}
