type TypingIndicatorProps = {
  isVisible?: boolean;
};

export function TypingIndicator({ isVisible = false }: TypingIndicatorProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="message-row message-row-assistant">
      <div className="assistant-avatar" aria-hidden="true">G</div>
      <div className="typing-indicator" aria-label="GigaChat печатает">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
