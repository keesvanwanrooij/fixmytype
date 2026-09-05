import {
  createSettings,
  setInterfaceLanguage,
  setProtectionEnabled,
  setRepairLanguage,
} from "../src/shared/settings.js";
import { describe, expect, it } from "vitest";

describe("settings", () => {
  it("keeps interface language independent from repair language", () => {
    const dutchUi = setInterfaceLanguage(createSettings(), "nl");
    expect(setRepairLanguage(dutchUi, "en")).toEqual({
      interfaceLanguage: "nl",
      repairLanguage: "en",
      protectionEnabled: true,
    });
  });

  it("starts with safe repair defaults", () => {
    expect(createSettings()).toEqual({
      interfaceLanguage: "en",
      repairLanguage: "auto",
      protectionEnabled: true,
    });
  });

  it("keeps the protection preference separate from both languages", () => {
    expect(setProtectionEnabled(createSettings(), false)).toEqual({
      interfaceLanguage: "en",
      repairLanguage: "auto",
      protectionEnabled: false,
    });
  });
});
