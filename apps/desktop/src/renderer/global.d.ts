import type { Action, Preferences } from "../shared/preferences.js";

declare global {
  interface Window {
    fixMyType: {
      status: () => Promise<{ ai: boolean; speech: boolean; worker: boolean }>;
      copy: (text: string) => Promise<void>;
      microphone: (enabled: boolean) => Promise<boolean>;
      cancel: () => Promise<void>;
      repair: (text: string, preferences: Preferences) => Promise<string>;
      transcribe: (audio: Uint8Array, language: string) => Promise<string>;
      onCaptureStop: (listener: () => void) => () => void;
      onAction: (listener: (action: Action) => void) => () => void;
      syncPreferences: (preferences: Preferences) => Promise<boolean>;
      onProtectionChanged: (listener: (enabled: boolean) => void) => () => void;
      support: () => Promise<void>;
    };
  }
}

export {};
