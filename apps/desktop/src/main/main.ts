import { app, BrowserWindow, ipcMain, Menu, nativeImage, shell, Tray } from "electron";
import path from "node:path";

import { isAllowedExternalUrl, supportUrl } from "./external-url.js";

let mainWindow: BrowserWindow | undefined;
let tray: Tray | undefined;
let isQuitting = false;

const trayIcon = () => nativeImage.createFromDataURL(`data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="7" fill="#1f5d50"/>
    <path d="M10 9h12v4H14v3h7v4h-7v7h-4z" fill="white"/>
  </svg>
`)}`);

const createWindow = (): BrowserWindow => {
  const window = new BrowserWindow({
    width: 900,
    height: 680,
    minWidth: 720,
    minHeight: 540,
    show: false,
    title: "FixMyType",
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      preload: path.join(import.meta.dirname, "../preload/preload.js")
    }
  });

  void window.loadFile(path.join(import.meta.dirname, "../renderer/index.html"));
  window.once("ready-to-show", () => window.show());
  window.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      window.hide();
    }
  });
  window.on("closed", () => {
    mainWindow = undefined;
  });

  return window;
};

const openSettings = (): void => {
  if (!mainWindow) {
    mainWindow = createWindow();
  }

  mainWindow.show();
  mainWindow.focus();
};

const createTray = (): Tray => {
  const nextTray = new Tray(trayIcon());
  nextTray.setToolTip("FixMyType settings");
  nextTray.setContextMenu(Menu.buildFromTemplate([
    { label: "Open settings", click: openSettings },
    { label: "Hide settings", click: () => mainWindow?.hide() },
    { type: "separator" },
    {
      label: "Quit FixMyType",
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]));
  nextTray.on("click", openSettings);
  return nextTray;
};

app.on("web-contents-created", (_event, contents) => {
  contents.on("will-navigate", (event) => event.preventDefault());
  contents.setWindowOpenHandler(() => ({ action: "deny" }));
});

app.whenReady().then(() => {
  tray ??= createTray();
  openSettings();
});

app.on("before-quit", () => {
  isQuitting = true;
});

ipcMain.handle("support:open", (event): Promise<void> => {
  if (event.sender !== mainWindow?.webContents || !isAllowedExternalUrl(supportUrl)) {
    throw new Error("The support link request was rejected.");
  }

  return shell.openExternal(supportUrl);
});
