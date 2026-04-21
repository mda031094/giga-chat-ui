type ErrorMessageProps = {
  actionLabel?: string;
  onAction?: () => void;
  text: string;
};

export function ErrorMessage({ actionLabel, onAction, text }: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <span aria-hidden="true">!</span>
      <div className="error-message-copy">
        <p>{text}</p>
        {actionLabel && onAction ? (
          <button className="error-action-button" type="button" onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
