import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  nativeImage,
  shell,
  Tray,
} from "electron";
import path from "node:path";

import { isAllowedExternalUrl, supportUrl } from "./external-url.js";
import { resolvePreloadPath } from "./preload-path.js";
import {
  nextProtectionEnabled,
  protectionActionLabel,
} from "./protection-state.js";
import type { InterfaceLanguage } from "../shared/settings.js";

import { isPreferences } from "../shared/preferences.js";
import { replaceShortcuts } from "./shortcuts.js";
import { registerWorkspace } from "./workspace-ipc.js";
import { trayCopy } from "./tray-copy.js";

const ownsInstance = app.requestSingleInstanceLock();
if (!ownsInstance) app.quit();
let bindings: Record<string, string> = {};

let mainWindow: BrowserWindow | undefined;
let tray: Tray | undefined;
let isQuitting = false;
let interfaceLanguage: InterfaceLanguage = "en";
let protectionEnabled = true;

const trayIcon = () =>
  nativeImage.createFromDataURL(
    `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="7" fill="#1f5d50"/>
    <path d="M10 9h12v4H14v3h7v4h-7v7h-4z" fill="white"/>
  </svg>
`)}`,
  );

const createWindow = (): BrowserWindow => {
  const window = new BrowserWindow({
    width: 1180,
    height: 840,
    backgroundColor: "#101719",
    autoHideMenuBar: true,
    minWidth: 720,
    minHeight: 540,
    show: false,
    title: "FixMyType",
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      preload: resolvePreloadPath(import.meta.dirname),
    },
  });

  registerWorkspace(window);
  void window.loadFile(
    path.join(import.meta.dirname, "../renderer/index.html"),
  );
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

  const labels = trayCopy(interfaceLanguage);
  tray.setToolTip(labels.tooltip);
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: labels.open, click: openSettings },
      { label: labels.hide, click: () => mainWindow?.hide() },
      {
        label: protectionActionLabel(protectionEnabled, interfaceLanguage),
        click: () =>
          updateProtectionEnabled(nextProtectionEnabled(protectionEnabled)),
      },
      { type: "separator" },
      {
        label: labels.quit,
        click: () => {
          isQuitting = true;
          app.quit();
        },
      },
    ]),
  );
};

const updateProtectionEnabled = (enabled: boolean): void => {
  protectionEnabled = enabled;
  refreshTrayMenu();
  mainWindow?.webContents.send("protection:changed", protectionEnabled);
};

const createTray = (): void => {
  tray = new Tray(trayIcon());
  tray.on("click", openSettings);
  refreshTrayMenu();
};

app.on("web-contents-created", (_event, contents) => {
  contents.on("will-navigate", (event) => event.preventDefault());
  contents.setWindowOpenHandler(() => ({ action: "deny" }));
});

app.on("second-instance", () => openSettings());

app.whenReady().then(() => {
  if (!ownsInstance) return;
  if (!tray) {
    createTray();
  }
  openSettings();
});

app.on("before-quit", () => {
  isQuitting = true;
  globalShortcut.unregisterAll();
});

ipcMain.handle("support:open", (event): Promise<void> => {
  if (
    event.senderFrame !== mainWindow?.webContents.mainFrame ||
    !isAllowedExternalUrl(supportUrl)
  ) {
    throw new Error("The support link request was rejected.");
  }

  return shell.openExternal(supportUrl);
});

ipcMain.handle("preferences:sync", (event, value: unknown): boolean => {
  if (
    event.senderFrame !== mainWindow?.webContents.mainFrame ||
    !isPreferences(value)
  )
    throw new Error("Invalid preferences");
  interfaceLanguage = value.interfaceLanguage;
  if (protectionEnabled !== value.protectionEnabled)
    updateProtectionEnabled(value.protectionEnabled);
  refreshTrayMenu();
  if (JSON.stringify(bindings) === JSON.stringify(value.shortcuts)) return true;
  const ok = replaceShortcuts(
    globalShortcut,
    bindings,
    value.shortcuts,
    (action) => {
      if (action === "pause") {
        updateProtectionEnabled(!protectionEnabled);
        return;
      }
      if (action === "show" || action === "dictate" || action === "repair")
        openSettings();
      mainWindow?.webContents.send("action", action);
    },
  );
  if (ok) bindings = { ...value.shortcuts };
  return ok;
});
