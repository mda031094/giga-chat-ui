import { useEffect, useMemo, useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { AuthForm } from './components/auth/AuthForm';
import { mockChats, mockMessages } from './mockData';
import type { ChatScope, ThemeMode } from './types';

export function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeChatId, setActiveChatId] = useState(mockChats[0]?.id ?? '');
  const [theme, setTheme] = useState<ThemeMode>('light');

  const activeChatTitle = useMemo(
    () => mockChats.find((chat) => chat.id === activeChatId)?.title ?? 'Новый чат',
    [activeChatId],
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const handleLogin = (credentials: string, _scope: ChatScope) => {
    if (!credentials.trim()) {
      setAuthError('Введите Credentials для продолжения.');
      return;
    }

    setAuthError('');
    setIsAuthorized(true);
  };

  if (!isAuthorized) {
    return <AuthForm error={authError} onSubmit={handleLogin} theme={theme} onThemeChange={setTheme} />;
  }

  return (
    <AppLayout
      activeChatId={activeChatId}
      chats={mockChats}
      messages={mockMessages}
      theme={theme}
      title={activeChatTitle}
      onChatSelect={setActiveChatId}
      onThemeChange={setTheme}
    />
  );
}
