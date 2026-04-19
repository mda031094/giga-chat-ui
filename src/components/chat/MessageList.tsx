import type { ChatMessage } from '../../types';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';

type MessageListProps = {
  messages: ChatMessage[];
  isTyping?: boolean;
};

export function MessageList({ messages, isTyping = false }: MessageListProps) {
  return (
    <div className="message-list" aria-live="polite">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <TypingIndicator isVisible={isTyping} />
    </div>
  );
}
