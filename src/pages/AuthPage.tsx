import { AuthForm } from '../components/auth/AuthForm';
import { useChat } from '../app/providers/ChatProvider';

export default function AuthPage() {
  const { actions, state } = useChat();

  return (
    <AuthForm
      error={state.error ?? ''}
      onSubmit={actions.login}
      onThemeChange={actions.setTheme}
      theme={state.theme}
    />
  );
}
