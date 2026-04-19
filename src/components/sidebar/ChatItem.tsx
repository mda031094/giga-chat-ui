import type { ChatPreview } from '../../types';

type ChatItemProps = {
  chat: ChatPreview;
  isActive: boolean;
  onSelect: () => void;
};

export function ChatItem({ chat, isActive, onSelect }: ChatItemProps) {
  return (
    <button type="button" className={`chat-item ${isActive ? 'chat-item-active' : ''}`} onClick={onSelect}>
      <span className="chat-item-copy">
        <span className="chat-title">{chat.title}</span>
        <span className="chat-date">{chat.lastMessageDate}</span>
      </span>
      <span className="chat-actions" aria-hidden="true">
        <span>✎</span>
        <span>×</span>
      </span>
    </button>
  );
}
