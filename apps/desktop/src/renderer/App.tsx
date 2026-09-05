import { useEffect, useState } from "react";
import {
  createPreferences,
  loadPreferences,
  preferencesKey,
  savePreferences,
  type Preferences,
} from "../shared/preferences.js";
import { wordsFor } from "./words.js";
import { Workspace } from "./Workspace.js";
import { SettingsPanel } from "./SettingsPanel.js";
type Page = "workspace" | "history" | "setup" | "settings";
export function App() {
  const [loaded] = useState(() => loadPreferences(window.localStorage));
  const [preferences, setPreferences] = useState(loaded.preferences);
  const [page, setPage] = useState<Page>("workspace");
  const [text, setText] = useState("");
  const [notice, setNotice] = useState(loaded.issue ?? "");
  const w = wordsFor(preferences.interfaceLanguage);
  const update = (value: Preferences) => {
    const issue = savePreferences(window.localStorage, value);
    setPreferences(value);
    setNotice(issue ?? "");
  };
  useEffect(() => {
    document.documentElement.lang = preferences.interfaceLanguage;
    void window.fixMyType
      .syncPreferences(preferences)
      .then((ok) => {
        if (!ok) setNotice("shortcutError");
      })
      .catch(() => setNotice("unavailable"));
  }, [preferences]);
  useEffect(
    () =>
      window.fixMyType.onProtectionChanged((enabled) => {
        setPreferences((current) => {
          const next = { ...current, protectionEnabled: enabled };
          const issue = savePreferences(window.localStorage, next);
          if (issue) setNotice(issue);
          return next;
        });
      }),
    [],
  );
  useEffect(
    () =>
      window.fixMyType.onAction((action) => {
        if (action === "show") {
          setPage("workspace");
          return;
        }
        setNotice("operationPending");
      }),
    [],
  );
  const reset = () => {
    try {
      window.localStorage.removeItem(preferencesKey);
      update(createPreferences());
    } catch {
      setNotice("unavailable");
    }
  };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#workspace"
          onClick={(e) => {
            e.preventDefault();
            setPage("workspace");
          }}
        >
          <span className="brand-mark">
            f<span>.</span>
          </span>
          <span>
            FixMyType<small>{w.local}</small>
          </span>
        </a>
        <nav aria-label="FixMyType">
          {(["workspace", "history", "setup", "settings"] as const).map(
            (name, i) => (
              <button
                type="button"
                key={name}
                aria-current={page === name ? "page" : undefined}
                className="navigation-item"
                onClick={() => setPage(name)}
              >
                <span className="nav-number">0{i + 1}</span>
                {w[name]}
              </button>
            ),
          )}
        </nav>
        <div className="sidebar-bottom">
          <span className="status-dot" />
          {w.local}
          <p>{w.footer}</p>
        </div>
      </aside>
      <main className="main-content">
        {notice && (
          <div className="notice" role="status">
            {notice in w ? w[notice as keyof typeof w] : notice}
            {notice === "invalid" && (
              <button type="button" onClick={reset}>
                {w.reset}
              </button>
            )}
          </div>
        )}
        {page === "workspace" && (
          <Workspace
            preferences={preferences}
            update={update}
            text={text}
            onText={setText}
            words={w}
          />
        )}
        {page === "settings" && (
          <SettingsPanel
            key={preferences.interfaceLanguage}
            preferences={preferences}
            save={update}
            words={w}
          />
        )}
        {page === "history" && (
          <>
            <header className="page-header">
              <span className="eyebrow">{w.history}</span>
              <h1>{w.historyTitle}</h1>
            </header>
            <section className="empty-state">
              <span>↶</span>
              <p>{w.historyBody}</p>
            </section>
          </>
        )}
        {page === "setup" && (
          <>
            <header className="page-header">
              <span className="eyebrow">{w.setup}</span>
              <h1>{w.setupTitle}</h1>
              <p>{w.setupBody}</p>
            </header>
            <div className="settings-grid">
              {(["typing", "ai", "voice"] as const).map((name) => (
                <section className="panel" key={name}>
                  <h2>{w[name]}</h2>
                  <span className="badge">{w.pending}</span>
                  <p className="help-text">
                    {name === "typing"
                      ? w.nativePending
                      : name === "ai"
                        ? w.aiPending
                        : w.speechPending}
                  </p>
                </section>
              ))}
            </div>
          </>
        )}
        <footer className="support-footer">
          <span>FixMyType · {w.footer}</span>
          <button
            type="button"
            onClick={() =>
              void window.fixMyType
                .support()
                .catch(() => setNotice("unavailable"))
            }
          >
            {w.support} <span aria-hidden="true">↗</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
