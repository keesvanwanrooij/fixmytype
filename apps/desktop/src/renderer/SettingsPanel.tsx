import { useState } from "react";
import {
  actions,
  isPreferences,
  type Preferences,
} from "../shared/preferences.js";
import type { Words } from "./words.js";
type Props = {
  preferences: Preferences;
  save: (value: Preferences) => "invalid" | "unavailable" | undefined;
  words: Words;
};
export function SettingsPanel({ preferences, save, words: w }: Props) {
  const [draft, setDraft] = useState(preferences);
  const [terms, setTerms] = useState(preferences.vocabulary.join("\n"));
  const [message, setMessage] = useState<keyof Words | undefined>(undefined);
  function submit() {
    const next = {
      ...draft,
      vocabulary: terms
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (!isPreferences(next)) {
      setMessage("invalid");
      return;
    }
    const issue = save(next);
    setMessage(issue ?? "saved");
  }
  return (
    <>
      <header className="page-header">
        <span className="eyebrow">FIXMYTYPE / {w.settings}</span>
        <h1>{w.settings}</h1>
      </header>
      <div className="settings-grid">
        <section className="panel">
          <h2>{w.language}</h2>
          <label>
            {w.interfaceLanguage}
            <select
              value={draft.interfaceLanguage}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  interfaceLanguage: e.target
                    .value as Preferences["interfaceLanguage"],
                })
              }
            >
              <option value="en">English</option>
              <option value="nl">Nederlands</option>
            </select>
          </label>
          <label>
            {w.repairLanguage}
            <select
              value={draft.repairLanguage}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  repairLanguage: e.target
                    .value as Preferences["repairLanguage"],
                })
              }
            >
              <option value="auto">{w.detect}</option>
              <option value="en">English</option>
              <option value="nl">Nederlands</option>
            </select>
          </label>
        </section>
        <section className="panel">
          <h2>{w.protection}</h2>
          <label className="check-label">
            <input
              type="checkbox"
              checked={draft.protectionEnabled}
              onChange={(e) =>
                setDraft({ ...draft, protectionEnabled: e.target.checked })
              }
            />
            {w.protection}
          </label>
          <label>
            {w.sensitivity}: {draft.sensitivity}
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={draft.sensitivity}
              onChange={(e) =>
                setDraft({ ...draft, sensitivity: Number(e.target.value) })
              }
            />
          </label>
          <label>
            {w.intensity}: {draft.intensity}
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={draft.intensity}
              onChange={(e) =>
                setDraft({ ...draft, intensity: Number(e.target.value) })
              }
            />
          </label>
        </section>
        <section className="panel">
          <h2>{w.personal}</h2>
          <label>
            {w.style}
            <textarea
              rows={4}
              maxLength={4000}
              value={draft.styleCard}
              onChange={(e) =>
                setDraft({ ...draft, styleCard: e.target.value })
              }
            />
          </label>
          <p className="help-text">{w.styleHelp}</p>
          <label>
            {w.vocabulary}
            <textarea
              rows={5}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            />
          </label>
          <p className="help-text">{w.vocabularyHelp}</p>
        </section>
        <section className="panel">
          <h2>{w.keys}</h2>
          <p className="help-text">{w.keysHelp}</p>
          {actions.map((action) => (
            <label key={action}>
              {w[action]}
              <input
                type="text"
                value={draft.shortcuts[action]}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    shortcuts: { ...draft.shortcuts, [action]: e.target.value },
                  })
                }
              />
            </label>
          ))}
        </section>
      </div>
      <div className="save-row">
        <button type="button" className="primary-button" onClick={submit}>
          {w.save}
        </button>
        <span role="status">{message ? w[message] : ""}</span>
      </div>
    </>
  );
}
