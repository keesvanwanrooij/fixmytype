import type { Settings } from "../shared/settings.js";

declare global {
  interface Window {
    fixMyType: {
      onProtectionChanged: (listener: (enabled: boolean) => void) => () => void;
      syncSettings: (settings: Settings) => Promise<void>;
      support: () => Promise<void>;
    };
  }
}

export {};
