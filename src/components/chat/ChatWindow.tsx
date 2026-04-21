import type { Chat } from '../../types';
import { ErrorBoundary } from '../ErrorBoundary';
import { EmptyState } from '../feedback/EmptyState';
import { ErrorMessage } from '../feedback/ErrorMessage';
import { InputArea } from './InputArea';
import { MessageList } from './MessageList';

type ChatWindowProps = {
  activeChat: Chat | null;
  error: string | null;
  isLoading: boolean;
  onOpenSettings: () => void;
  onStopGeneration: () => void;
  onSubmit: (content: string) => Promise<void>;
};

export function ChatWindow({ activeChat, error, isLoading, onOpenSettings, onStopGeneration, onSubmit }: ChatWindowProps) {
  return (
    <section className="chat-window">
      <header className="chat-header">
        <div>
          <p className="eyebrow">Текущий чат</p>
          <h1>{activeChat?.title ?? 'Новый чат'}</h1>
        </div>
        <button className="icon-button" type="button" onClick={onOpenSettings} aria-label="Открыть настройки">
          ⚙
        </button>
      </header>

      {activeChat?.messages.length ? (
        <ErrorBoundary fallbackText="Сообщения временно не отрисовались. Попробуйте еще раз." resetKey={activeChat.id}>
          <MessageList messages={activeChat.messages} isTyping={isLoading} />
        </ErrorBoundary>
      ) : (
        <EmptyState />
      )}

      {error ? <ErrorMessage text={error} /> : null}
      <InputArea isLoading={isLoading} onStop={onStopGeneration} onSubmit={onSubmit} />
    </section>
  );
}
