import {
  preloadFileName,
  resolvePreloadPath,
} from "../src/main/preload-path.js";
import { describe, expect, it } from "vitest";

describe("preload path", () => {
  it("uses a CommonJS preload file for the sandboxed Electron renderer", () => {
    // Sandboxed Electron preloads execute as CommonJS, not as ES modules.
    expect(preloadFileName).toBe("preload.cjs");
    expect(resolvePreloadPath("C:\\app\\dist\\main")).toBe(
      "C:\\app\\dist\\preload\\preload.cjs",
    );
  });
});
