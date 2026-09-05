import { createSettings, type Settings } from "./settings.js";
import {
  loadSettings,
  type SettingsStorage,
  type SettingsStorageIssue,
} from "./settings-storage.js";

export type AiMode = "off" | "suggest" | "automatic";
export type Profile = "prose" | "prompt" | "code" | "spreadsheet";
export const actions = ["dictate", "repair", "read", "pause", "show"] as const;
export type Action = (typeof actions)[number];
export type Preferences = Settings & {
  aiMode: AiMode;
  sensitivity: number;
  intensity: number;
  profile: Profile;
  styleCard: string;
  vocabulary: string[];
  shortcuts: Record<Action, string>;
  companionVisible: boolean;
};
export const preferencesKey = "fixmytype:preferences:v2";
export const createPreferences = (
  settings: Settings = createSettings(),
): Preferences => ({
  ...settings,
  aiMode: "off",
  sensitivity: 1,
  intensity: 2,
  profile: "prompt",
  styleCard: "",
  vocabulary: [],
  companionVisible: false,
  shortcuts: {
    dictate: "Control+Alt+Shift+D",
    repair: "Control+Alt+Shift+R",
    read: "Control+Alt+Shift+L",
    pause: "Control+Alt+Shift+P",
    show: "Control+Alt+Shift+Space",
  },
});
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const keys = Object.keys(createPreferences()).sort();
const level = (value: unknown): boolean =>
  Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 5;
const member = (value: unknown, values: string[]): boolean =>
  typeof value === "string" && values.includes(value);
export const validShortcut = (value: unknown): value is string =>
  typeof value === "string" &&
  /^(?:(?:Control|Alt|Shift|Super)\+){2,4}(?:[A-Z0-9]|Space|F(?:[1-9]|1[0-2]))$/.test(
    value,
  ) &&
  new Set(value.split("+")).size === value.split("+").length;

export function isPreferences(value: unknown): value is Preferences {
  if (
    !isRecord(value) ||
    Object.keys(value).sort().join("|") !== keys.join("|")
  )
    return false;
  if (
    !member(value.interfaceLanguage, ["en", "nl"]) ||
    !member(value.repairLanguage, ["en", "nl", "auto"])
  )
    return false;
  if (
    typeof value.protectionEnabled !== "boolean" ||
    typeof value.companionVisible !== "boolean"
  )
    return false;
  if (
    !member(value.aiMode, ["off", "suggest", "automatic"]) ||
    !member(value.profile, ["prose", "prompt", "code", "spreadsheet"])
  )
    return false;
  if (
    !level(value.sensitivity) ||
    !level(value.intensity) ||
    typeof value.styleCard !== "string" ||
    value.styleCard.length > 4000
  )
    return false;
  if (
    !Array.isArray(value.vocabulary) ||
    value.vocabulary.length > 200 ||
    value.vocabulary.some(
      (term) => typeof term !== "string" || !term.trim() || term.length > 80,
    )
  )
    return false;
  if (
    new Set(value.vocabulary.map((term) => term.toLowerCase().trim())).size !==
    value.vocabulary.length
  )
    return false;
  const shortcuts = value.shortcuts;
  if (
    !isRecord(shortcuts) ||
    Object.keys(shortcuts).sort().join("|") !== [...actions].sort().join("|") ||
    actions.some((action) => !validShortcut(shortcuts[action]))
  )
    return false;
  const canonical = actions.map((action) =>
    (shortcuts[action] as string)
      .split("+")
      .map((s) => s.toLowerCase())
      .sort()
      .join("+"),
  );
  return new Set(canonical).size === actions.length;
}
export function loadPreferences(storage: SettingsStorage): {
  preferences: Preferences;
  issue: SettingsStorageIssue | undefined;
} {
  let raw: string | null;
  try {
    raw = storage.getItem(preferencesKey);
  } catch {
    return { preferences: createPreferences(), issue: "unavailable" };
  }
  if (raw === null) {
    const legacy = loadSettings(storage);
    return {
      preferences: createPreferences(legacy.settings),
      issue: legacy.issue,
    };
  }
  try {
    const record: unknown = JSON.parse(raw);
    if (
      isRecord(record) &&
      record.version === 2 &&
      isPreferences(record.preferences)
    )
      return { preferences: record.preferences, issue: undefined };
  } catch {
    /* Keep invalid bytes for a deliberate reset. */
  }
  return { preferences: createPreferences(), issue: "invalid" };
}
export function savePreferences(
  storage: SettingsStorage,
  preferences: Preferences,
): SettingsStorageIssue | undefined {
  if (!isPreferences(preferences)) return "invalid";
  try {
    storage.setItem(
      preferencesKey,
      JSON.stringify({ version: 2, preferences }),
    );
    return undefined;
  } catch {
    return "unavailable";
  }
}
