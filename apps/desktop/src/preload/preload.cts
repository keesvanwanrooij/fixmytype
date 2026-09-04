import { contextBridge, ipcRenderer } from "electron";
import type { Settings } from "../shared/settings.js";

contextBridge.exposeInMainWorld("fixMyType", {
  onProtectionChanged: (listener: (enabled: boolean) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, enabled: unknown): void => {
      if (typeof enabled === "boolean") {
        listener(enabled);
      }
    };

    ipcRenderer.on("protection:changed", handler);
    return () => ipcRenderer.removeListener("protection:changed", handler);
  },
  syncSettings: (settings: Settings) => ipcRenderer.invoke("settings:sync", settings) as Promise<void>,
  support: () => ipcRenderer.invoke("support:open") as Promise<void>
});
