import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Message } from './Message';
import type { ChatMessage } from '../../types';

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: Date.now(),
  };
}

describe('Message', () => {
  const writeText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    writeText.mockClear();
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText,
      },
    });
  });

  it('рендерит пользовательское сообщение с нужным классом', () => {
    const { container } = render(<Message message={createMessage('user', 'Текст пользователя')} variant="user" />);

    expect(screen.getByText('Текст пользователя')).toBeInTheDocument();
    expect(container.querySelector('.message-row-user')).toBeInTheDocument();
  });

  it('рендерит сообщение ассистента с нужным классом', () => {
    const { container } = render(<Message message={createMessage('assistant', 'Ответ ассистента')} variant="assistant" />);

    expect(screen.getByText('Ответ ассистента')).toBeInTheDocument();
    expect(container.querySelector('.message-row-assistant')).toBeInTheDocument();
  });

  it('показывает кнопку Копировать только для assistant и дает обратную связь', async () => {
    render(<Message message={createMessage('assistant', 'Ответ ассистента')} variant="assistant" />);

    const button = screen.getByRole('button', { name: 'Копировать' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('Ответ ассистента');
      expect(screen.getByRole('button', { name: 'Скопировано' })).toBeInTheDocument();
    });
  });

  it('не показывает кнопку Копировать для user', () => {
    render(<Message message={createMessage('user', 'Текст пользователя')} variant="user" />);

    expect(screen.queryByRole('button', { name: /копировать/i })).not.toBeInTheDocument();
  });
});
