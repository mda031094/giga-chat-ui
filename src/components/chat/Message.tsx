import ReactMarkdown from 'react-markdown';
import type { ChatMessage, ChatRole } from '../../types';

type MessageProps = {
  message: ChatMessage;
  variant: ChatRole;
};

const senderNames: Record<ChatRole, string> = {
  user: 'Вы',
  assistant: 'GigaChat',
};

export function Message({ message, variant }: MessageProps) {
  const isUser = variant === 'user';
  const formattedTime = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(message.timestamp);

  const handleCopy = async () => {
    await navigator.clipboard?.writeText(message.content);
  };

  return (
    <article className={`message-row ${isUser ? 'message-row-user' : 'message-row-assistant'}`}>
      {!isUser ? <div className="assistant-avatar" aria-hidden="true">G</div> : null}
      <div className={`message-bubble ${isUser ? 'message-user' : 'message-assistant'}`}>
        <div className="message-meta">
          <span>
            {senderNames[variant]} <span className="message-time">{formattedTime}</span>
          </span>
          <button type="button" className="copy-button" onClick={handleCopy}>
            Копировать
          </button>
        </div>
        <div className="markdown-body">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
