import type { Settings } from "../shared/settings.js";

import type { Action, Preferences } from "../shared/preferences.js";

declare global {
  interface Window {
    fixMyType: {
      onAction: (listener: (action: Action) => void) => () => void;
      syncPreferences: (preferences: Preferences) => Promise<boolean>;
      onProtectionChanged: (listener: (enabled: boolean) => void) => () => void;
      syncSettings: (settings: Settings) => Promise<void>;
      support: () => Promise<void>;
    };
  }
}

export {};
