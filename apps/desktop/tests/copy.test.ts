import { copyFor } from "../src/renderer/copy.js";
import { describe, expect, it } from "vitest";

describe("interface copy", () => {
  it("provides complete English settings copy", () => {
    expect(copyFor("en").support).toBe("Support FixMyType");
    expect(copyFor("en").language).toBe("Language");
    expect(copyFor("en").resetSettings).toBe("Reset local settings");
  });

  it("provides complete Dutch settings copy", () => {
    expect(copyFor("nl").support).toBe("Support FixMyType");
    expect(copyFor("nl").language).toBe("Taal");
    expect(copyFor("nl").resetSettings).toBe("Lokale instellingen opnieuw instellen");
  });
});
