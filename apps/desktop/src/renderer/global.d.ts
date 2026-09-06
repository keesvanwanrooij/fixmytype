import type { Action, Preferences } from "../shared/preferences.js";
import type { Sample, Proposal } from "../shared/calibration.js";

declare global {
  interface Window {
    fixMyType: {
      status: () => Promise<{ ai: boolean; speech: boolean; worker: boolean }>;
      calibrate: (samples: Sample[]) => Promise<Proposal>;
      copy: (text: string) => Promise<void>;
      saveWord: (
        text: string,
        language: "nl" | "en",
      ) => Promise<"saved" | "cancelled" | "busy" | "invalid" | "failed">;
      openWord: () => Promise<"opened" | "openFailed" | "missing" | "busy">;
      microphone: (enabled: boolean) => Promise<boolean>;
      cancel: () => Promise<void>;
      repair: (text: string, preferences: Preferences) => Promise<string>;
      rewrite: (text: string, preferences: Preferences) => Promise<string>;
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
