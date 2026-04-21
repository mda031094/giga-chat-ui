import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';

type MessageListProps = {
  messages: ChatMessage[];
  isTyping?: boolean;
};

export function MessageList({ messages, isTyping = false }: MessageListProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="message-list" aria-live="polite">
      {messages.map((message) => (
        <Message key={message.id} message={message} variant={message.role} />
      ))}
      <TypingIndicator isVisible={isTyping} />
      <div ref={endRef} />
    </div>
  );
}
