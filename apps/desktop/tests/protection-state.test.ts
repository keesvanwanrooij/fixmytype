import { nextProtectionEnabled, protectionActionLabel } from "../src/main/protection-state.js";
import { describe, expect, it } from "vitest";

describe("protection preference", () => {
  it("offers pause when the preference is enabled", () => {
    expect(protectionActionLabel(true)).toBe("Pause protection");
    expect(protectionActionLabel(true, "nl")).toBe("Bescherming pauzeren");
  });

  it("offers resume after the preference is paused", () => {
    expect(nextProtectionEnabled(true)).toBe(false);
    expect(protectionActionLabel(false)).toBe("Resume protection");
  });
});
