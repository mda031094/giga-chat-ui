import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '../../types';

type MessageProps = {
  message: ChatMessage;
};

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard?.writeText(message.content);
  };

  return (
    <article className={`message-row ${isUser ? 'message-row-user' : 'message-row-assistant'}`}>
      {!isUser ? <div className="assistant-avatar" aria-hidden="true">G</div> : null}
      <div className={`message-bubble ${isUser ? 'message-user' : 'message-assistant'}`}>
        <div className="message-meta">
          <span>{message.senderName}</span>
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
