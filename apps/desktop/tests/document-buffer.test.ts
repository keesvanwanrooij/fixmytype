import { describe, expect, it } from "vitest";
import {
  DocumentBuffer,
  completedSentences,
} from "../src/shared/document-buffer.js";

// A delayed correction may change its owned range, never the user's later typing.
describe("document transactions", () => {
  it("rejects an anchor owned by another document", () => {
    const a = new DocumentBuffer("bad"),
      b = new DocumentBuffer("bad");
    const foreign = a.capture(0, 3);
    b.capture(0, 3);
    expect(b.apply(foreign, "good")).toBeUndefined();
    expect(b.text).toBe("bad");
  });
  it("handles results completed in reverse order", () => {
    const d = new DocumentBuffer("bad. bad.");
    const a = d.capture(0, 4),
      b = d.capture(5, 9);
    d.apply(b, "second.");
    d.apply(a, "first.");
    expect(d.text).toBe("first. second.");
  });
  it("does not cut sentences at decimal points or URL punctuation", () => {
    const text = "The price is 1.25. Visit https://example.org now.";
    expect(completedSentences(text)).toEqual([
      { start: 0, end: 18 },
      { start: 19, end: text.length },
    ]);
  });
  it("repairs an old sentence and undoes it without removing later sentences", () => {
    const d = new DocumentBuffer("Thiss is mine.");
    const id = d.capture(0, d.text.length);
    d.replaceText(d.text + " Second. Third. Fourth.");
    const undo = d.apply(id, "This is mine.");
    expect(d.text).toBe("This is mine. Second. Third. Fourth.");
    d.replaceText(d.text + " Fifth.");
    expect(d.undo(undo!)).toBe(true);
    expect(d.text).toBe("Thiss is mine. Second. Third. Fourth. Fifth.");
    expect(d.undo(undo!)).toBe(false);
  });
  it("refuses changed ranges and consumed results", () => {
    const d = new DocumentBuffer("bad words");
    const id = d.capture(0, 3);
    d.replaceText("new words");
    expect(d.apply(id, "good")).toBeUndefined();
    const next = d.capture(0, 3);
    expect(d.apply(next, "fine")).toBeDefined();
    expect(d.apply(next, "again")).toBeUndefined();
  });
  it("distinguishes repeated text and rebases changes before the target", () => {
    const d = new DocumentBuffer("bad. bad.");
    const id = d.capture(5, 9);
    d.replaceText("Prefix. bad. bad.");
    d.apply(id, "good.");
    expect(d.text).toBe("Prefix. bad. good.");
  });
  it("rejects unsafe undo after a manual edit", () => {
    const d = new DocumentBuffer("bad");
    const u = d.apply(d.capture(0, 3), "good")!;
    d.replaceText("great");
    expect(d.undo(u)).toBe(false);
    expect(d.text).toBe("great");
  });
  it("keeps insertion anchors safe and does not split Unicode pairs", () => {
    const d = new DocumentBuffer("A😀B");
    expect(() => d.capture(2, 3)).toThrow();
    const id = d.capture(4, 4);
    d.replaceText(d.text + " typed");
    expect(d.apply(id, " spoken")).toBeUndefined();
  });
  it("splits complete sentences but leaves the current unfinished draft alone", () => {
    expect(completedSentences("Hello! Goed. unfinished")).toEqual([
      { start: 0, end: 6 },
      { start: 7, end: 12 },
    ]);
  });
});
