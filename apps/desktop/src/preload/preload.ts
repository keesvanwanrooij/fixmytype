import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("fixMyType", {
  support: () => ipcRenderer.invoke("support:open") as Promise<void>
});
