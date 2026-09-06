import type { Preferences } from "../shared/preferences.js";
import type { Words } from "./words.js";
import { useRef } from "react";
import { ChatterFilter } from "../shared/typing-filter.js";
import type { useWriting } from "./useWriting.js";
import { HistoryList } from "./HistoryList.js";
import type { Calibrations } from "../shared/calibration.js";
type Props = {
  calibrations: Calibrations;
  preferences: Preferences;
  update: (value: Preferences) => void;
  writing: ReturnType<typeof useWriting>;
  words: Words;
};
export function Workspace({
  preferences,
  update,
  writing,
  words: w,
  calibrations,
}: Props) {
  const { text, onText } = writing;
  const filter = useRef(new ChatterFilter());
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
      <div className="toolbar">
        <button
          type="button"
          className="primary-button"
          disabled={
            writing.busy ||
            preferences.aiMode === "off" ||
            !text.trim() ||
            preferences.profile === "code" ||
            preferences.profile === "spreadsheet"
          }
          onClick={writing.repair}
        >
          {writing.busy ? w.repairing : w.repairNow}
        </button>
        <button
          type="button"
          data-rewrite
          disabled={
            writing.busy ||
            preferences.aiMode === "off" ||
            !text.trim() ||
            preferences.profile === "code" ||
            preferences.profile === "spreadsheet"
          }
          onClick={writing.rewrite}
          title={w.rewriteHelp}
        >
          {w.rewriteNow}
        </button>
        <button
          type="button"
          className={writing.recording ? "recording-button" : ""}
          disabled={writing.transcribing || writing.startingRecording}
          onClick={() => void writing.dictate()}
        >
          {writing.recording
            ? w.stopRecording
            : writing.transcribing
              ? w.transcribing
              : w.startRecording}
        </button>
        <button type="button" disabled={!text} onClick={() => writing.copy()}>
          {w.copy}
        </button>
        {(writing.busy || writing.recording || writing.transcribing) && (
          <button type="button" onClick={writing.cancel}>
            {w.cancel}
          </button>
        )}
        <label className="inline-check">
          <input
            type="checkbox"
            checked={preferences.protectionEnabled}
            onChange={(event) =>
              update({
                ...preferences,
                protectionEnabled: event.target.checked,
              })
            }
          />
          {w.filterHere}
        </label>
      </div>
      <div className="dictation-options">
        <label className="inline-check">
          <input
            type="checkbox"
            data-spoken-formatting
            checked={writing.spokenFormatting}
            disabled={
              writing.startingRecording ||
              writing.recording ||
              writing.transcribing
            }
            onChange={(event) =>
              writing.setSpokenFormatting(event.target.checked)
            }
          />
          {w.spokenFormatting}
        </label>
        <p className="help-text">
          {writing.spokenFormatting
            ? w.spokenFormattingHelp
            : w.literalDictationHelp}
        </p>
      </div>
      <p className="operation-status" role="status" aria-live="polite">
        {writing.message
          ? (w[writing.message as keyof Words] ?? w.runtimeError)
          : w.workspaceHelp}
      </p>
      <section className="editor-card">
        <label className="sr-only" htmlFor="writing-editor">
          {w.editor}
        </label>
        <textarea
          id="writing-editor"
          maxLength={100000}
          spellCheck={false}
          value={text}
          placeholder={w.placeholder}
          onChange={(event) => onText(event.target.value)}
          onCompositionStart={() => {
            writing.composing.current = true;
            filter.current.reset();
          }}
          onCompositionEnd={() => {
            writing.composing.current = false;
          }}
          onBlur={() => filter.current.reset()}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              writing.cancel();
              return;
            }
            if (
              !preferences.protectionEnabled ||
              preferences.profile === "code" ||
              preferences.profile === "spreadsheet"
            ) {
              filter.current.reset();
              return;
            }
            if (
              filter.current.suppress(
                { ...event, isComposing: event.nativeEvent.isComposing },
                calibrations[event.code]?.level ?? preferences.sensitivity,
              )
            )
              event.preventDefault();
          }}
        />
        <div className="editor-bottom">
          <span>{w.session}</span>
          <span>
            {text.trim() ? text.trim().split(/\s+/).length : 0} {w.words} ·{" "}
            {text.length} {w.characters}
          </span>
        </div>
      </section>
      <section className="word-export" aria-label={w.wordHeading}>
        <h2>{w.wordHeading}</h2>
        <p className="help-text">{w.wordHelp}</p>
        <div className="toolbar">
          <button
            type="button"
            data-save-word
            disabled={!text.trim() || writing.exporting}
            onClick={() => void writing.saveWord()}
          >
            {writing.exporting ? w.wordSaving : w.saveWord}
          </button>
          {writing.wordSaved && (
            <button
              type="button"
              data-open-word
              onClick={() => void writing.openWord()}
            >
              {w.openWord}
            </button>
          )}
        </div>
        {writing.wordOutdated && <p role="status">{w.wordOutdated}</p>}
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
          <p>
            {writing.status.ai ? w.aiReady : w.aiPending} ·{" "}
            {writing.status.speech ? w.speechReady : w.speechPending}
          </p>
        </article>
      </div>
      <HistoryList writing={writing} words={w} />
    </>
  );
}
