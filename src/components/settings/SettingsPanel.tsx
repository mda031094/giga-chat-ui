import { useState } from 'react';
import { defaultSettings } from '../../mockData';
import type { SettingsValues, ThemeMode } from '../../types';

type SettingsPanelProps = {
  isOpen: boolean;
  theme: ThemeMode;
  onClose: () => void;
  onThemeChange: (theme: ThemeMode) => void;
};

export function SettingsPanel({ isOpen, theme, onClose, onThemeChange }: SettingsPanelProps) {
  const [values, setValues] = useState<SettingsValues>({ ...defaultSettings, theme });

  const updateValue = <Key extends keyof SettingsValues>(key: Key, value: SettingsValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleReset = () => {
    setValues(defaultSettings);
    onThemeChange(defaultSettings.theme);
  };

  const handleThemeChange = (nextTheme: ThemeMode) => {
    updateValue('theme', nextTheme);
    onThemeChange(nextTheme);
  };

  return (
    <>
      {isOpen ? <button className="settings-backdrop" type="button" aria-label="Закрыть настройки" onClick={onClose} /> : null}
      <aside className={`settings-panel ${isOpen ? 'settings-panel-open' : ''}`} aria-hidden={!isOpen}>
        <div className="settings-header">
          <div>
            <p className="eyebrow">Параметры</p>
            <h2>Настройки модели</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Закрыть настройки">
            ×
          </button>
        </div>

        <label className="field">
          <span>Модель</span>
          <select value={values.model} onChange={(event) => updateValue('model', event.target.value as SettingsValues['model'])}>
            <option>GigaChat</option>
            <option>GigaChat-Plus</option>
            <option>GigaChat-Pro</option>
            <option>GigaChat-Max</option>
          </select>
        </label>

        <label className="field range-field">
          <span>Temperature: {values.temperature.toFixed(1)}</span>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={values.temperature}
            onChange={(event) => updateValue('temperature', Number(event.target.value))}
          />
        </label>

        <label className="field range-field">
          <span>Top-P: {values.topP.toFixed(1)}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={values.topP}
            onChange={(event) => updateValue('topP', Number(event.target.value))}
          />
        </label>

        <label className="field">
          <span>Max Tokens</span>
          <input
            type="number"
            min="1"
            max="8192"
            value={values.maxTokens}
            onChange={(event) => updateValue('maxTokens', Number(event.target.value))}
          />
        </label>

        <label className="field">
          <span>System Prompt</span>
          <textarea
            rows={5}
            value={values.systemPrompt}
            onChange={(event) => updateValue('systemPrompt', event.target.value)}
          />
        </label>

        <label className="theme-toggle settings-toggle">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(event) => handleThemeChange(event.target.checked ? 'dark' : 'light')}
          />
          <span>Темная тема</span>
        </label>

        <div className="settings-actions">
          <button type="button" className="secondary-button" onClick={handleReset}>
            Сбросить
          </button>
          <button type="button" className="primary-button" onClick={onClose}>
            Сохранить
          </button>
        </div>
      </aside>
    </>
  );
}
