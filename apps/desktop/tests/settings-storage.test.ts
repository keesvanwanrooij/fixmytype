import { createSettings } from "../src/shared/settings.js";
import { loadSettings, resetSettings, saveSettings, settingsStorageKey } from "../src/shared/settings-storage.js";
import { describe, expect, it } from "vitest";

describe("settings storage", () => {
  it("uses safe runtime defaults and reports malformed saved data", () => {
    const storage = {
      getItem: () => "{not-json",
      setItem: () => undefined
    };

    expect(loadSettings(storage)).toEqual({ issue: "invalid", settings: createSettings() });
  });

  it("loads only a complete validated settings record", () => {
    const storage = {
      getItem: () => JSON.stringify({
        version: 1,
        settings: { interfaceLanguage: "nl", repairLanguage: "en", protectionEnabled: false }
      }),
      setItem: () => undefined
    };

    expect(loadSettings(storage)).toEqual({
      issue: undefined,
      settings: { interfaceLanguage: "nl", repairLanguage: "en", protectionEnabled: false }
    });
  });

  it("reports unavailable storage without treating it as malformed data", () => {
    const storage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => undefined
    };

    expect(loadSettings(storage)).toEqual({ issue: "unavailable", settings: createSettings() });
  });

  it("does not overwrite local storage with an incomplete settings object", () => {
    let writes = 0;
    const storage = {
      getItem: () => null,
      setItem: () => {
        writes += 1;
      }
    };

    // Runtime data can bypass TypeScript, so persistence must validate again.
    const incomplete = { interfaceLanguage: "nl", repairLanguage: "auto" } as ReturnType<typeof createSettings>;

    expect(saveSettings(storage, incomplete)).toBe("invalid");
    expect(writes).toBe(0);
  });

  it("removes only the known settings record when the user explicitly resets it", () => {
    const removed: string[] = [];
    const storage = {
      getItem: () => "{not-json",
      setItem: () => undefined,
      removeItem: (key: string) => {
        removed.push(key);
      }
    };

    expect(resetSettings(storage)).toBeUndefined();
    expect(removed).toEqual([settingsStorageKey]);
  });
});
