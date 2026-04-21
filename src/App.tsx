import { useEffect } from 'react';
import { AppRoutes } from './app/router/routes';
import { useChat } from './app/providers/ChatProvider';

export function App() {
  const { state } = useChat();

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  return <AppRoutes />;
}
