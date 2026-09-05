import type { Preferences } from "../shared/preferences.js";
import type { Words } from "./words.js";
type Props = {
  preferences: Preferences;
  update: (value: Preferences) => void;
  text: string;
  onText: (value: string) => void;
  words: Words;
};
export function Workspace({
  preferences,
  update,
  text,
  onText,
  words: w,
}: Props) {
  return (
    <>
      <header className="page-header">
        <span className="eyebrow">FIXMYTYPE / {w.workspace}</span>
        <h1>{w.title}</h1>
        <p>{w.subtitle}</p>
      </header>
      <section className="writing-controls" aria-label={w.mode}>
        <div className="mode-control">
          <span className="field-caption">{w.mode}</span>
          <div className="segmented" role="group" aria-label={w.mode}>
            {(["off", "suggest", "automatic"] as const).map((mode) => (
              <button
                type="button"
                key={mode}
                aria-pressed={preferences.aiMode === mode}
                onClick={() => update({ ...preferences, aiMode: mode })}
              >
                {w[mode]}
              </button>
            ))}
          </div>
        </div>
        <label className="profile-select">
          <span>{w.profile}</span>
          <select
            value={preferences.profile}
            onChange={(event) =>
              update({
                ...preferences,
                profile: event.target.value as Preferences["profile"],
              })
            }
          >
            {(["prompt", "prose", "code", "spreadsheet"] as const).map(
              (profile) => (
                <option key={profile} value={profile}>
                  {w[profile]}
                </option>
              ),
            )}
          </select>
        </label>
      </section>
      <p className="help-text">{w.modeHelp}</p>
      <section className="editor-card">
        <label className="sr-only" htmlFor="writing-editor">
          {w.editor}
        </label>
        <textarea
          id="writing-editor"
          spellCheck={false}
          value={text}
          placeholder={w.placeholder}
          onChange={(event) => onText(event.target.value)}
        />
        <div className="editor-bottom">
          <span>{w.session}</span>
          <span>
            {text.trim() ? text.trim().split(/\s+/).length : 0} {w.words} ·{" "}
            {text.length} {w.characters}
          </span>
        </div>
      </section>
      <div className="status-grid">
        <article>
          <span className="status-dot" />
          <h2>{w.foundation}</h2>
          <p>{w.nativePending}</p>
        </article>
        <article>
          <span className="status-dot waiting" />
          <h2>{w.ai}</h2>
          <p>{w.aiPending}</p>
        </article>
      </div>
    </>
  );
}
