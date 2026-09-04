import { createSettings, type InterfaceLanguage, type RepairLanguage, type Settings } from "./settings.js";

export const settingsStorageKey = "fixmytype:settings:v1";

export type SettingsStorage = Pick<Storage, "getItem" | "setItem">;
export type SettingsStorageIssue = "invalid" | "unavailable";
export type SettingsLoadResult = { issue: SettingsStorageIssue | undefined; settings: Settings };

const isInterfaceLanguage = (value: unknown): value is InterfaceLanguage => value === "en" || value === "nl";
const isRepairLanguage = (value: unknown): value is RepairLanguage => value === "auto" || isInterfaceLanguage(value);
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

export const isSettings = (value: unknown): value is Settings => {
  if (!isRecord(value)) {
    return false;
  }

  return isInterfaceLanguage(value.interfaceLanguage)
    && isRepairLanguage(value.repairLanguage)
    && typeof value.protectionEnabled === "boolean";
};

const readSavedSettings = (value: unknown): Settings | undefined => {
  if (!isRecord(value) || value.version !== 1 || !isSettings(value.settings)) {
    return undefined;
  }

  return value.settings;
};

export const loadSettings = (storage: SettingsStorage): SettingsLoadResult => {
  let saved: string | null;

  try {
    saved = storage.getItem(settingsStorageKey);
  } catch {
    return { issue: "unavailable", settings: createSettings() };
  }

  if (saved === null) {
    return { issue: undefined, settings: createSettings() };
  }

  try {
    const settings = readSavedSettings(JSON.parse(saved));
    return settings
      ? { issue: undefined, settings }
      : { issue: "invalid", settings: createSettings() };
  } catch {
    return { issue: "invalid", settings: createSettings() };
  }
};

export const saveSettings = (storage: SettingsStorage, settings: Settings): SettingsStorageIssue | undefined => {
  if (!isSettings(settings)) {
    return "invalid";
  }

  try {
    storage.setItem(settingsStorageKey, JSON.stringify({ settings, version: 1 }));
    return undefined;
  } catch {
    return "unavailable";
  }
};
