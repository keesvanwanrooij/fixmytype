import {
  createSettings,
  setInterfaceLanguage,
} from "../src/shared/settings.js";
import {
  resetSettingsView,
  updateSettingsView,
} from "../src/shared/settings-view.js";
import { describe, expect, it } from "vitest";

describe("settings view", () => {
  it("keeps a changed preference in memory when malformed storage must be preserved", () => {
    let writes = 0;
    const storage = {
      getItem: () => "{not-json",
      setItem: () => {
        writes += 1;
      },
    };
    const view = { issue: "invalid" as const, settings: createSettings() };

    // A user may continue working, but the broken bytes must not be silently replaced.
    expect(
      updateSettingsView(
        view,
        setInterfaceLanguage(view.settings, "nl"),
        storage,
      ),
    ).toEqual({
      issue: "invalid",
      settings: {
        interfaceLanguage: "nl",
        repairLanguage: "auto",
        protectionEnabled: true,
      },
    });
    expect(writes).toBe(0);
  });

  it("persists a changed preference when storage is healthy", () => {
    const writes: string[] = [];
    const storage = {
      getItem: () => null,
      setItem: (_key: string, value: string) => {
        writes.push(value);
      },
    };
    const view = { issue: undefined, settings: createSettings() };

    expect(
      updateSettingsView(
        view,
        setInterfaceLanguage(view.settings, "nl"),
        storage,
      ).issue,
    ).toBeUndefined();
    expect(writes).toHaveLength(1);
  });

  it("returns to safe defaults after an explicit reset", () => {
    const removed: string[] = [];
    const storage = {
      getItem: () => "{not-json",
      setItem: () => undefined,
      removeItem: (key: string) => {
        removed.push(key);
      },
    };

    expect(resetSettingsView(storage)).toEqual({
      issue: undefined,
      settings: createSettings(),
    });
    expect(removed).toEqual(["fixmytype:settings:v1"]);
  });
});
