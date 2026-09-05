import { describe, expect, it } from "vitest";
import {
  createPreferences,
  isPreferences,
  loadPreferences,
  savePreferences,
} from "../src/shared/preferences.js";
import { settingsStorageKey } from "../src/shared/settings-storage.js";
const storage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
};
describe("workspace preferences", () => {
  it("migrates the old language choices without enabling AI or capture", () => {
    const store = storage();
    store.setItem(
      settingsStorageKey,
      JSON.stringify({
        version: 1,
        settings: {
          interfaceLanguage: "nl",
          repairLanguage: "en",
          protectionEnabled: false,
        },
      }),
    );
    const result = loadPreferences(store);
    expect(result.preferences).toMatchObject({
      interfaceLanguage: "nl",
      repairLanguage: "en",
      protectionEnabled: false,
      aiMode: "off",
      sensitivity: 1,
    });
    expect(result.issue).toBeUndefined();
  });
  it("round trips every explicit preference", () => {
    const store = storage();
    const preferences = {
      ...createPreferences(),
      aiMode: "suggest" as const,
      styleCard: "Keep my direct tone.",
      vocabulary: ["FixMyType", "ASML"],
    };
    expect(savePreferences(store, preferences)).toBeUndefined();
    expect(loadPreferences(store).preferences).toEqual(preferences);
  });
  it("rejects unexpected fields and out of range controls before persistence", () => {
    const base = createPreferences();
    for (const value of [
      { ...base, sensitivity: 0 },
      { ...base, intensity: 6 },
      { ...base, aiMode: "cloud" },
      { ...base, secret: "text" },
      { ...base, vocabulary: [""] },
      { ...base, styleCard: "a".repeat(4001) },
    ])
      expect(isPreferences(value)).toBe(false);
  });
  it("rejects duplicate or unsafe shortcut definitions", () => {
    const base = createPreferences();
    expect(
      isPreferences({
        ...base,
        shortcuts: { ...base.shortcuts, repair: base.shortcuts.dictate },
      }),
    ).toBe(false);
    expect(
      isPreferences({
        ...base,
        shortcuts: { ...base.shortcuts, dictate: "A" },
      }),
    ).toBe(false);
  });
  it("does not coerce arrays into valid language or mode values", () => {
    const base = createPreferences();
    expect(isPreferences({ ...base, interfaceLanguage: ["en"] })).toBe(false);
    expect(isPreferences({ ...base, aiMode: ["off"] })).toBe(false);
    expect(isPreferences({ ...base, profile: ["prompt"] })).toBe(false);
  });
  it("preserves invalid saved bytes and reports storage errors", () => {
    const store = storage();
    store.setItem("fixmytype:preferences:v2", "broken");
    expect(loadPreferences(store).issue).toBe("invalid");
    expect(store.getItem("fixmytype:preferences:v2")).toBe("broken");
    const denied = {
      getItem: () => {
        throw Error("denied");
      },
      setItem: () => {
        throw Error("denied");
      },
    };
    expect(loadPreferences(denied).issue).toBe("unavailable");
    expect(savePreferences(denied, createPreferences())).toBe("unavailable");
  });
});
