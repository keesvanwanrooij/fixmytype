import { createRoot } from "react-dom/client";
import { useState } from "react";
import { createSettings, setInterfaceLanguage, setRepairLanguage } from "../shared/settings.js";

const App = () => {
  const [settings, setSettings] = useState(createSettings);

  return (
    <main>
      <h1>FixMyType</h1>
      <p>Local settings</p>

      <label>
        App language
        <select
          value={settings.interfaceLanguage}
          onChange={(event) => setSettings(setInterfaceLanguage(settings, event.target.value as "en" | "nl"))}
        >
          <option value="en">English</option>
          <option value="nl">Nederlands</option>
        </select>
      </label>

      <label>
        Repair language
        <select
          value={settings.repairLanguage}
          onChange={(event) => setSettings(setRepairLanguage(settings, event.target.value as "auto" | "en" | "nl"))}
        >
          <option value="auto">Automatic</option>
          <option value="en">English</option>
          <option value="nl">Nederlands</option>
        </select>
      </label>

      <footer>
        <button onClick={() => void window.fixMyType.support()}>Support FixMyType</button>
      </footer>
    </main>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
