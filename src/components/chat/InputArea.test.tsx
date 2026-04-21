import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { InputArea } from './InputArea';

describe('InputArea', () => {
  it('вызывает onSubmit при клике на кнопку Отправить', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<InputArea onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText('Спросите что-нибудь...'), 'Привет');
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(onSubmit).toHaveBeenCalledWith('Привет');
  });

  it('вызывает onSubmit по Enter', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<InputArea onSubmit={onSubmit} />);

    const textarea = screen.getByPlaceholderText('Спросите что-нибудь...');
    await user.type(textarea, 'Привет');
    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalledWith('Привет');
  });

  it('не отправляет сообщение по Shift+Enter и делает перенос строки', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<InputArea onSubmit={onSubmit} />);

    const textarea = screen.getByPlaceholderText('Спросите что-нибудь...');
    await user.type(textarea, 'Привет');
    await user.keyboard('{Shift>}{Enter}{/Shift}');

    expect(onSubmit).not.toHaveBeenCalled();
    expect(textarea).toHaveValue('Привет\n');
  });

  it('держит кнопку Отправить disabled при пустом поле', () => {
    render(<InputArea onSubmit={vi.fn().mockResolvedValue(undefined)} />);

    expect(screen.getByRole('button', { name: 'Отправить' })).toBeDisabled();
  });
});
