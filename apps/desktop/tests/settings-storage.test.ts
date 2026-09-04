import { createSettings } from "../src/shared/settings.js";
import { loadSettings } from "../src/shared/settings-storage.js";
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
});
