import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChatMessage } from '../../types';
import { EmptyState } from '../feedback/EmptyState';
import { InputArea } from './InputArea';
import { MessageList } from './MessageList';

type ChatWindowProps = {
  initialMessages: ChatMessage[];
  title: string;
  onOpenSettings: () => void;
};

const assistantReplies = [
  'Готово. Я добавил сообщение пользователя в состояние и показал ответ ассистента после короткой задержки.',
  'Теперь интерфейс ощущается живее: сообщение уходит сразу, затем появляется индикатор печати и моковый ответ.',
  'Автоскролл тоже можно завести на этот же поток обновлений, чтобы последнее сообщение всегда оставалось в поле зрения.',
];

export function ChatWindow({ initialMessages, title, onOpenSettings }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setMessages(initialMessages);
    setIsLoading(false);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [initialMessages, title]);

  useEffect(() => () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  }, []);

  const canShowEmptyState = useMemo(() => messages.length === 0 && !isLoading, [isLoading, messages.length]);

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setIsLoading(true);

    const reply = assistantReplies[Math.floor(Math.random() * assistantReplies.length)];
    const delay = 1000 + Math.floor(Math.random() * 1000);

    timeoutRef.current = window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
      setIsLoading(false);
      timeoutRef.current = null;
    }, delay);
  };

  const handleStopGeneration = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsLoading(false);
  };

  return (
    <section className="chat-window">
      <header className="chat-header">
        <div>
          <p className="eyebrow">Текущий чат</p>
          <h1>{title}</h1>
        </div>
        <button className="icon-button" type="button" onClick={onOpenSettings} aria-label="Открыть настройки">
          ⚙
        </button>
      </header>

      {canShowEmptyState ? <EmptyState /> : <MessageList messages={messages} isTyping={isLoading} />}

      <InputArea isLoading={isLoading} onStop={handleStopGeneration} onSubmit={handleSendMessage} />
    </section>
  );
}
