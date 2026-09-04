import { app, BrowserWindow, ipcMain, Menu, nativeImage, shell, Tray } from "electron";
import path from "node:path";

import { isAllowedExternalUrl, supportUrl } from "./external-url.js";
import { resolvePreloadPath } from "./preload-path.js";
import { nextProtectionEnabled, protectionActionLabel } from "./protection-state.js";
import type { InterfaceLanguage, Settings } from "../shared/settings.js";

let mainWindow: BrowserWindow | undefined;
let tray: Tray | undefined;
let isQuitting = false;
let interfaceLanguage: InterfaceLanguage = "en";
let protectionEnabled = true;

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
      preload: resolvePreloadPath(import.meta.dirname)
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

const refreshTrayMenu = (): void => {
  if (!tray) {
    return;
  }

  tray.setContextMenu(Menu.buildFromTemplate([
    { label: "Open settings", click: openSettings },
    { label: "Hide settings", click: () => mainWindow?.hide() },
    {
      label: protectionActionLabel(protectionEnabled, interfaceLanguage),
      click: () => updateProtectionEnabled(nextProtectionEnabled(protectionEnabled))
    },
    { type: "separator" },
    {
      label: "Quit FixMyType",
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]));
};

const updateProtectionEnabled = (enabled: boolean): void => {
  protectionEnabled = enabled;
  refreshTrayMenu();
  mainWindow?.webContents.send("protection:changed", protectionEnabled);
};

const createTray = (): void => {
  tray = new Tray(trayIcon());
  tray.setToolTip("FixMyType settings");
  tray.on("click", openSettings);
  refreshTrayMenu();
};

const isSettingsSync = (value: unknown): value is Settings => (
  typeof value === "object"
  && value !== null
  && "interfaceLanguage" in value
  && "repairLanguage" in value
  && "protectionEnabled" in value
  && (value.interfaceLanguage === "en" || value.interfaceLanguage === "nl")
  && (value.repairLanguage === "auto" || value.repairLanguage === "en" || value.repairLanguage === "nl")
  && typeof value.protectionEnabled === "boolean"
);

app.on("web-contents-created", (_event, contents) => {
  contents.on("will-navigate", (event) => event.preventDefault());
  contents.setWindowOpenHandler(() => ({ action: "deny" }));
});

app.whenReady().then(() => {
  if (!tray) {
    createTray();
  }
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

ipcMain.handle("settings:sync", (event, settings: unknown): void => {
  if (event.sender !== mainWindow?.webContents || !isSettingsSync(settings)) {
    throw new Error("The settings update was rejected.");
  }

  interfaceLanguage = settings.interfaceLanguage;
  updateProtectionEnabled(settings.protectionEnabled);
});
