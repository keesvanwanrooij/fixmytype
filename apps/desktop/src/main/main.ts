import { app, BrowserWindow } from "electron";
import path from "node:path";
let mainWindow: BrowserWindow | undefined;
function openSettings() { if (!mainWindow) { mainWindow = new BrowserWindow({ width: 900, height: 680, webPreferences: { contextIsolation: true, sandbox: true, nodeIntegration: false, preload: path.join(import.meta.dirname, "../preload/preload.js") } }); mainWindow.loadFile(path.join(import.meta.dirname, "../renderer/index.html")); mainWindow.on("closed", () => { mainWindow = undefined; }); } mainWindow.show(); }
app.whenReady().then(openSettings);
