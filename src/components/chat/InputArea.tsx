import { KeyboardEvent, useRef, useState } from 'react';
import { ErrorMessage } from '../feedback/ErrorMessage';

type InputAreaProps = {
  isLoading?: boolean;
  onSubmit: (value: string) => void;
  onStop?: () => void;
};

export function InputArea({ isLoading = false, onStop, onSubmit }: InputAreaProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const canSubmit = value.trim().length > 0 && !isLoading;

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      if (!isLoading) {
        setError('Введите сообщение перед отправкой.');
      }
      return;
    }

    setError('');
    onSubmit(value.trim());
    setValue('');
    window.requestAnimationFrame(resizeTextarea);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      className="input-area"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      {error ? <ErrorMessage text={error} /> : null}
      <div className="composer">
        <button type="button" className="icon-button muted-button" aria-label="Прикрепить изображение" disabled={isLoading}>
          📎
        </button>
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={isLoading}
          placeholder="Спросите что-нибудь..."
          onChange={(event) => {
            setValue(event.target.value);
            setError('');
            resizeTextarea();
          }}
          onKeyDown={handleKeyDown}
        />
        {isLoading ? (
          <button type="button" className="secondary-button stop-button" onClick={onStop}>
            Стоп
          </button>
        ) : (
          <button type="submit" className="primary-button" disabled={!canSubmit}>
            Отправить
          </button>
        )}
      </div>
    </form>
  );
}
