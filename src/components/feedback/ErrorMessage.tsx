type ErrorMessageProps = {
  text: string;
};

export function ErrorMessage({ text }: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <span aria-hidden="true">!</span>
      <p>{text}</p>
    </div>
  );
}
