import { expect, it } from "vitest";
import { ChatterFilter } from "../src/shared/typing-filter.js";
const key = (key: string, timeStamp: number, extra = {}) => ({
  key,
  timeStamp,
  repeat: false,
  ctrlKey: false,
  altKey: false,
  metaKey: false,
  isComposing: false,
  shiftKey: false,
  isTrusted: true,
  code: `Key${key.toUpperCase()}`,
  ...extra,
});
it("filters only rapid same-letter events, preserving deliberate repeats and held keys", () => {
  const f = new ChatterFilter();
  expect(f.suppress(key("a", 100), 3)).toBe(false);
  expect(f.suppress(key("a", 108), 3)).toBe(true);
  expect(f.suppress(key("a", 200), 3)).toBe(false);
  expect(f.suppress(key("a", 205, { repeat: true }), 3)).toBe(false);
});
it("preserves modifiers, numbers, composing text, unknown time and different letters", () => {
  for (const event of [
    key("1", 105),
    key("a", 105, { ctrlKey: true }),
    key("a", 105, { shiftKey: true }),
    key("a", 105, { isTrusted: false }),
    key("a", 105, { code: "" }),
    key("a", 105, { isComposing: true }),
    key("b", 105),
    key("a", 100),
  ]) {
    const f = new ChatterFilter();
    f.suppress(key("a", 100), 5);
    expect(f.suppress(event, 5)).toBe(false);
  }
});
