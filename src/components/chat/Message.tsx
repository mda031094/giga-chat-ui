import { useEffect, useState } from 'react';
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
  const [copied, setCopied] = useState(false);
  const formattedTime = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(message.timestamp);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timerId = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timerId);
  }, [copied]);

  const handleCopy = async () => {
    if (isUser) {
      return;
    }

    await navigator.clipboard.writeText(message.content);
    setCopied(true);
  };

  return (
    <article className={`message-row ${isUser ? 'message-row-user' : 'message-row-assistant'}`}>
      {!isUser ? <div className="assistant-avatar" aria-hidden="true">G</div> : null}
      <div className={`message-bubble ${isUser ? 'message-user' : 'message-assistant'}`}>
        <div className="message-meta">
          <span>
            {senderNames[variant]} <span className="message-time">{formattedTime}</span>
          </span>
          {!isUser ? (
            <button type="button" className={`copy-button ${copied ? 'copy-button-active' : ''}`} onClick={handleCopy}>
              {copied ? 'Скопировано' : 'Копировать'}
            </button>
          ) : null}
        </div>
        <div className="markdown-body">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
