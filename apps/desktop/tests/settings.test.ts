import { createSettings, setInterfaceLanguage, setRepairLanguage } from "../src/shared/settings.js";
import { describe, expect, it } from "vitest";

describe("settings", () => {
  it("keeps interface language independent from repair language", () => {
    const dutchUi = setInterfaceLanguage(createSettings(), "nl");
    expect(setRepairLanguage(dutchUi, "en")).toEqual({ interfaceLanguage: "nl", repairLanguage: "en" });
  });

  it("starts with safe repair defaults", () => {
    expect(createSettings()).toEqual({ interfaceLanguage: "en", repairLanguage: "auto" });
  });
});
