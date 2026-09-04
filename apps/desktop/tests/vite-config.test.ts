import config from "../vite.config.js";
import { describe, expect, it } from "vitest";

describe("Vite build configuration", () => {
  it("uses relative assets so Electron can load the renderer from file URLs", () => {
    // Electron loads the packaged renderer with file://, where /assets points outside the app.
    expect(config.base).toBe("./");
  });
});
