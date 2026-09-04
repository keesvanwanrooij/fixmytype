import { contextBridge, shell } from "electron";
contextBridge.exposeInMainWorld("fixMyType", { support: () => shell.openExternal("https://github.com/sponsors/keesvanwanrooij") });
