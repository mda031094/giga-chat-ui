import type { ChatMessage, ChatPreview, SettingsValues } from './types';

export const mockChats: ChatPreview[] = [
  { id: '1', title: 'Планирование интерфейса GigaChat', lastMessageDate: 'Сегодня' },
  { id: '2', title: 'Идеи для промптов и системной роли', lastMessageDate: 'Вчера' },
  { id: '3', title: 'Разбор markdown-ответов модели', lastMessageDate: '16 апр' },
  { id: '4', title: 'Подготовка архитектуры React приложения', lastMessageDate: '12 апр' },
  { id: '5', title: 'Сравнение режимов temperature и top-p', lastMessageDate: '8 апр' },
  { id: '6', title: 'Очень длинное название чата для проверки text overflow ellipsis', lastMessageDate: '1 апр' },
];

export const mockMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'user',
    senderName: 'Вы',
    content: 'Помоги спланировать оболочку приложения для чата с GigaChat.',
  },
  {
    id: 'm2',
    role: 'assistant',
    senderName: 'GigaChat',
    content:
      'Конечно. Начнем с **основной структуры**: sidebar для истории, центральная область сообщений и нижняя зона ввода.',
  },
  {
    id: 'm3',
    role: 'user',
    senderName: 'Вы',
    content: 'Какие компоненты стоит выделить на первом этапе?',
  },
  {
    id: 'm4',
    role: 'assistant',
    senderName: 'GigaChat',
    content:
      'Минимальный набор:\n\n- `AppLayout`\n- `Sidebar`\n- `ChatWindow`\n- `MessageList`\n- `Message`\n- `InputArea`\n- `SettingsPanel`',
  },
  {
    id: 'm5',
    role: 'user',
    senderName: 'Вы',
    content: 'Добавь пример блока кода, чтобы проверить markdown.',
  },
  {
    id: 'm6',
    role: 'assistant',
    senderName: 'GigaChat',
    content:
      'Вот небольшой пример:\n\n```ts\nconst sendMessage = (text: string) => {\n  return text.trim().length > 0;\n};\n```\n\n*Позже* здесь появится реальная отправка запроса.',
  },
];

export const defaultSettings: SettingsValues = {
  model: 'GigaChat',
  temperature: 1,
  topP: 0.9,
  maxTokens: 2048,
  systemPrompt: 'Ты полезный ассистент.',
  theme: 'light',
};
