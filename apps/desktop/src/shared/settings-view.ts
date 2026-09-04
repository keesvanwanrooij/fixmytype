import { createSettings, type Settings } from "./settings.js";
import {
  resetSettings,
  saveSettings,
  type ResettableSettingsStorage,
  type SettingsLoadResult,
  type SettingsStorage
} from "./settings-storage.js";

export type SettingsView = SettingsLoadResult;

export const updateSettingsView = (
  view: SettingsView,
  settings: Settings,
  storage: SettingsStorage
): SettingsView => ({
  issue: view.issue === "invalid" ? "invalid" : saveSettings(storage, settings),
  settings
});

export const resetSettingsView = (storage: ResettableSettingsStorage): SettingsView => ({
  issue: resetSettings(storage),
  settings: createSettings()
});
