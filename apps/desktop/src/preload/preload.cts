import { contextBridge, ipcRenderer } from "electron";
import type { Settings } from "../shared/settings.js";

import type { Action, Preferences } from "../shared/preferences.js";

contextBridge.exposeInMainWorld("fixMyType", {
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
  syncSettings: (settings: Settings) =>
    ipcRenderer.invoke("settings:sync", settings) as Promise<void>,
  support: () => ipcRenderer.invoke("support:open") as Promise<void>,
});
