import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { copyFor } from "./copy.js";
import "./styles.css";
import {
  setInterfaceLanguage,
  setProtectionEnabled,
  setRepairLanguage,
  type InterfaceLanguage,
  type RepairLanguage,
  type Settings
} from "../shared/settings.js";
import { loadSettings } from "../shared/settings-storage.js";
import { resetSettingsView, updateSettingsView, type SettingsView } from "../shared/settings-view.js";

type Section = "general" | "language" | "about";

const storedSettings = (): SettingsView => loadSettings(window.localStorage);

const App = () => {
  const [view, setView] = useState<SettingsView>(storedSettings);
  const [section, setSection] = useState<Section>("general");
  const { issue, settings } = view;
  const copy = copyFor(settings.interfaceLanguage);

  const updateSettings = (nextSettings: Settings): void => {
    setView(updateSettingsView(view, nextSettings, window.localStorage));
  };

  useEffect(() => {
    document.documentElement.lang = settings.interfaceLanguage;
    void window.fixMyType.syncSettings(settings);
  }, [settings]);

  useEffect(() => window.fixMyType.onProtectionChanged((enabled) => {
    const nextSettings = setProtectionEnabled(settings, enabled);
    setView(updateSettingsView(view, nextSettings, window.localStorage));
  }), [settings, view]);

  const issueMessage = issue === "invalid" ? copy.savedDataInvalid : issue === "unavailable" ? copy.savedDataUnavailable : undefined;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">F</span>
          <div>
            <strong>{copy.appName}</strong>
            <span>{copy.localSettings}</span>
          </div>
        </div>

        <nav aria-label={copy.settings}>
          {([
            ["general", copy.general],
            ["language", copy.language],
            ["about", copy.about]
          ] as const).map(([name, label]) => (
            <button
              className="navigation-item"
              type="button"
              key={name}
              aria-current={section === name ? "page" : undefined}
              onClick={() => setSection(name)}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="settings-content">
        <header>
          <p className="eyebrow">{copy.localSettings}</p>
          <h1>{section === "general" ? copy.general : section === "language" ? copy.language : copy.about}</h1>
        </header>

        {issueMessage && (
          <div className="notice" role="alert">
            <p>{issueMessage}</p>
            {issue === "invalid" && (
              <button type="button" onClick={() => setView(resetSettingsView(window.localStorage))}>
                {copy.resetSettings}
              </button>
            )}
          </div>
        )}

        {section === "general" && (
          <section className="settings-card" aria-labelledby="protection-heading">
            <div>
              <h2 id="protection-heading">{copy.protection}</h2>
              <p>{copy.protectionBody}</p>
            </div>
            <button
              className="switch"
              type="button"
              role="switch"
              aria-checked={settings.protectionEnabled}
              onClick={() => updateSettings(setProtectionEnabled(settings, !settings.protectionEnabled))}
            >
              <span>{settings.protectionEnabled ? copy.protectionOn : copy.protectionOff}</span>
              <span className="switch-track" aria-hidden="true"><span /></span>
            </button>
          </section>
        )}

        {section === "language" && (
          <section className="settings-card language-card" aria-labelledby="language-heading">
            <div>
              <h2 id="language-heading">{copy.language}</h2>
              <p>{copy.languageBody}</p>
            </div>

            <label>
              <span>{copy.appLanguage}</span>
              <select
                value={settings.interfaceLanguage}
                onChange={(event) => updateSettings(setInterfaceLanguage(settings, event.target.value as InterfaceLanguage))}
              >
                <option value="en">English</option>
                <option value="nl">Nederlands</option>
              </select>
            </label>

            <label>
              <span>{copy.repairLanguage}</span>
              <select
                value={settings.repairLanguage}
                onChange={(event) => updateSettings(setRepairLanguage(settings, event.target.value as RepairLanguage))}
              >
                <option value="auto">{copy.automatic}</option>
                <option value="en">English</option>
                <option value="nl">Nederlands</option>
              </select>
            </label>
          </section>
        )}

        {section === "about" && (
          <section className="settings-card" aria-labelledby="about-heading">
            <div>
              <h2 id="about-heading">{copy.appName}</h2>
              <p>{copy.aboutBody}</p>
            </div>
          </section>
        )}

        <footer className="support-footer">
          <button type="button" onClick={() => void window.fixMyType.support()}>{copy.support}</button>
        </footer>
      </main>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
