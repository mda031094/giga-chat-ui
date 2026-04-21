import { FormEvent, useState } from 'react';
import { ErrorMessage } from '../feedback/ErrorMessage';
import { Toggle } from '../ui/Toggle';
import type { ChatScope, ThemeMode } from '../../types';

const useServerAuth = import.meta.env.VITE_USE_SERVER_AUTH === 'true';
const defaultScope = (import.meta.env.VITE_GIGACHAT_SCOPE as ChatScope | undefined) ?? 'GIGACHAT_API_PERS';

type AuthFormProps = {
  error: string;
  theme: ThemeMode;
  onSubmit: (credentials: string, scope: ChatScope) => void;
  onThemeChange: (theme: ThemeMode) => void;
};

const scopes: ChatScope[] = ['GIGACHAT_API_PERS', 'GIGACHAT_API_B2B', 'GIGACHAT_API_CORP'];

export function AuthForm({ error, theme, onSubmit, onThemeChange }: AuthFormProps) {
  const [credentials, setCredentials] = useState('');
  const [scope, setScope] = useState<ChatScope>(defaultScope);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(credentials, scope);
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-header">
          <span className="brand-mark">G</span>
          <div>
            <h1>Вход в GigaChat UI</h1>
            <p>
              {useServerAuth
                ? 'Серверный ключ уже настроен. Остается только войти.'
                : 'Введите Credentials и выберите scope для будущей интеграции.'}
            </p>
          </div>
        </div>

        {useServerAuth ? (
          <div className="auth-hint">Authorization Key подключен через серверные переменные окружения.</div>
        ) : (
          <label className="field">
            <span>Credentials</span>
            <input
              type="password"
              value={credentials}
              placeholder="Base64-строка"
              onChange={(event) => setCredentials(event.target.value)}
            />
          </label>
        )}

        <fieldset className="scope-group">
          <legend>Scope</legend>
          {scopes.map((item) => (
            <label key={item} className="radio-row">
              <input
                type="radio"
                name="scope"
                value={item}
                checked={scope === item}
                onChange={() => setScope(item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </fieldset>

        {error ? <ErrorMessage text={error} /> : null}

        <div className="auth-actions">
          <Toggle checked={theme === 'dark'} label="Темная тема" onChange={(checked) => onThemeChange(checked ? 'dark' : 'light')} />
          <button type="submit" className="primary-button">
            Войти
          </button>
        </div>
      </form>
    </main>
  );
}
