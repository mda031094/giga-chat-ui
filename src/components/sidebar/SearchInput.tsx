type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <label className="search-input">
      <span className="visually-hidden">Поиск по чатам</span>
      <input
        type="search"
        value={value}
        placeholder="Поиск по чатам"
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
