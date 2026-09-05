import { contextBridge, ipcRenderer } from "electron";

import type { Action, Preferences } from "../shared/preferences.js";
import type { Sample } from "../shared/calibration.js";

contextBridge.exposeInMainWorld("fixMyType", {
  status: () => ipcRenderer.invoke("workspace:status"),
  calibrate: (samples: Sample[]) =>
    ipcRenderer.invoke("workspace:calibrate", samples),
  copy: (text: string) => ipcRenderer.invoke("workspace:copy", text),
  microphone: (enabled: boolean) =>
    ipcRenderer.invoke("workspace:microphone", enabled),
  cancel: () => ipcRenderer.invoke("workspace:cancel"),
  repair: (text: string, preferences: Preferences) =>
    ipcRenderer.invoke("workspace:job", { kind: "repair", text, preferences }),
  transcribe: (audio: Uint8Array, language: string) =>
    ipcRenderer.invoke("workspace:job", { kind: "speech", audio, language }),
  onCaptureStop: (listener: () => void) => {
    const handler = () => listener();
    ipcRenderer.on("capture:stop", handler);
    return () => ipcRenderer.removeListener("capture:stop", handler);
  },
  onAction: (listener: (action: Action) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, action: unknown) => {
      if (
        typeof action === "string" &&
        ["dictate", "repair", "read", "pause", "show"].includes(action)
      )
        listener(action as Action);
    };
    ipcRenderer.on("action", handler);
    return () => ipcRenderer.removeListener("action", handler);
  },
  syncPreferences: (preferences: Preferences) =>
    ipcRenderer.invoke("preferences:sync", preferences) as Promise<boolean>,
  onProtectionChanged: (listener: (enabled: boolean) => void): (() => void) => {
    const handler = (
      _event: Electron.IpcRendererEvent,
      enabled: unknown,
    ): void => {
      if (typeof enabled === "boolean") {
        listener(enabled);
      }
    };

    ipcRenderer.on("protection:changed", handler);
    return () => ipcRenderer.removeListener("protection:changed", handler);
  },
  support: () => ipcRenderer.invoke("support:open") as Promise<void>,
});
