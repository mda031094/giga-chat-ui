import { FormEvent, KeyboardEvent, useRef, useState } from 'react';
import { ErrorMessage } from '../feedback/ErrorMessage';

type InputAreaProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function InputArea({ onSubmit }: InputAreaProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const canSubmit = value.trim().length > 0;

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      setError('Введите сообщение перед отправкой.');
      return;
    }

    setError('');
    onSubmit(event);
    setValue('');
    window.requestAnimationFrame(resizeTextarea);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <form className="input-area" onSubmit={handleSubmit}>
      {error ? <ErrorMessage text={error} /> : null}
      <div className="composer">
        <button type="button" className="icon-button muted-button" aria-label="Прикрепить изображение">
          📎
        </button>
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          placeholder="Спросите что-нибудь..."
          onChange={(event) => {
            setValue(event.target.value);
            setError('');
            resizeTextarea();
          }}
          onKeyDown={handleKeyDown}
        />
        <button type="button" className="secondary-button">
          Стоп
        </button>
        <button type="submit" className="primary-button" disabled={!canSubmit}>
          Отправить
        </button>
      </div>
    </form>
  );
}
