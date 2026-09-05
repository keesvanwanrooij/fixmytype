import { isAllowedExternalUrl } from "../src/main/external-url.js";
import { describe, expect, it } from "vitest";

describe("isAllowedExternalUrl", () => {
  it("allows the single project support destination", () => {
    expect(
      isAllowedExternalUrl("https://github.com/sponsors/keesvanwanrooij"),
    ).toBe(true);
  });

  it("rejects a lookalike or a different external destination", () => {
    expect(
      isAllowedExternalUrl("https://github.com/sponsors/keesvanwanrooij/extra"),
    ).toBe(false);
    expect(
      isAllowedExternalUrl("https://github.com/sponsors/someone-else"),
    ).toBe(false);
  });
});
