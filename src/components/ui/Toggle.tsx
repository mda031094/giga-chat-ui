type ToggleProps = {
  checked: boolean;
  className?: string;
  label: string;
  onChange: (checked: boolean) => void;
};

export function Toggle({ checked, className = '', label, onChange }: ToggleProps) {
  return (
    <label className={`toggle ${className}`.trim()}>
      <input
        type="checkbox"
        className="toggle-input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="toggle-track" aria-hidden="true" />
      <span className="toggle-label">{label}</span>
    </label>
  );
}
