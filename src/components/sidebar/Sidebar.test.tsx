import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Sidebar } from './Sidebar';
import type { Chat } from '../../types';

const chats: Chat[] = [
  {
    id: 'chat-1',
    title: 'React архитектура',
    messages: [{ id: 'm1', role: 'user', content: 'useReducer', timestamp: 1 }],
    createdAt: 1,
    updatedAt: 1,
  },
  {
    id: 'chat-2',
    title: 'GigaChat integration',
    messages: [{ id: 'm2', role: 'assistant', content: 'streaming response', timestamp: 1 }],
    createdAt: 1,
    updatedAt: 1,
  },
];

describe('Sidebar', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn(() => true));
  });

  it('фильтрует список чатов по названию в реальном времени', async () => {
    const user = userEvent.setup();

    render(
      <Sidebar
        activeChatId="chat-1"
        chats={chats}
        isOpen
        onChatCreate={vi.fn()}
        onChatDelete={vi.fn()}
        onChatRename={vi.fn()}
        onChatSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    await user.type(screen.getByRole('searchbox'), 'react');

    expect(screen.getByText('React архитектура')).toBeInTheDocument();
    expect(screen.queryByText('GigaChat integration')).not.toBeInTheDocument();
  });

  it('при пустом поиске показывает все чаты', () => {
    render(
      <Sidebar
        activeChatId="chat-1"
        chats={chats}
        isOpen
        onChatCreate={vi.fn()}
        onChatDelete={vi.fn()}
        onChatRename={vi.fn()}
        onChatSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('React архитектура')).toBeInTheDocument();
    expect(screen.getByText('GigaChat integration')).toBeInTheDocument();
  });

  it('при удалении спрашивает подтверждение и вызывает onChatDelete', async () => {
    const user = userEvent.setup();
    const onChatDelete = vi.fn();

    render(
      <Sidebar
        activeChatId="chat-1"
        chats={chats}
        isOpen
        onChatCreate={vi.fn()}
        onChatDelete={onChatDelete}
        onChatRename={vi.fn()}
        onChatSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getAllByRole('button', { name: 'Удалить чат' })[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(onChatDelete).toHaveBeenCalledWith('chat-1');
  });
});
