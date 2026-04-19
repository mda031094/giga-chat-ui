import { FormEvent } from 'react';
import type { ChatMessage } from '../../types';
import { EmptyState } from '../feedback/EmptyState';
import { InputArea } from './InputArea';
import { MessageList } from './MessageList';

type ChatWindowProps = {
  title: string;
  messages: ChatMessage[];
  onOpenSettings: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ChatWindow({ title, messages, onOpenSettings, onSubmit }: ChatWindowProps) {
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

      {messages.length > 0 ? <MessageList messages={messages} isTyping /> : <EmptyState />}

      <InputArea onSubmit={onSubmit} />
    </section>
  );
}
