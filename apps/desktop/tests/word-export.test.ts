import { afterEach, expect, it, vi } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import JSZip from "jszip";
import { createWordDocument, WordExport } from "../src/main/word-export.js";

const directories: string[] = [];
async function destination() {
  const root = await mkdtemp(path.join(os.tmpdir(), "fixmytype-word-test-"));
  directories.push(root);
  return path.join(root, "post.docx");
}
afterEach(async () => {
  for (const root of directories.splice(0)) await rm(root, { recursive: true });
});

// The document must preserve the writer's text, never turn it into fields or commands.
it("preserves paragraphs, spaces, tabs, emoji and literal markup in a macro-free document", async () => {
  const zip = await JSZip.loadAsync(
    await createWordDocument("  Hé & <post> 😀\t€12.50\n\nNext.\n"),
  );
  const xml = await zip.file("word/document.xml")!.async("string");
  expect(xml).toContain('xml:space="preserve">  Hé &amp; &lt;post&gt; 😀');
  expect(xml).toContain("<w:tab/>");
  expect(xml.match(/<w:p>/g)).toHaveLength(4);
  expect(xml).not.toMatch(/<w:(?:hyperlink|fldSimple|instrText)/);
  expect(Object.keys(zip.files).join(" ")).not.toMatch(
    /vba|embeddings|external/i,
  );
});
it("rejects empty, oversized, control and broken Unicode input without making a file", async () => {
  for (const text of [
    "",
    " \n",
    "x".repeat(100001),
    "a\0b",
    "a\ud800",
    12,
    null,
  ]) {
    await expect(createWordDocument(text)).rejects.toThrow("INVALID_EXPORT");
  }
});
it("cancels without writing and refuses opening before a successful save", async () => {
  const open = vi.fn();
  const writer = new WordExport(async () => undefined, open);
  expect(await writer.save("Original.")).toBe("cancelled");
  expect(await writer.open()).toBe("missing");
  expect(open).not.toHaveBeenCalled();
});
it("creates a real file exclusively and opens only that stored path", async () => {
  const file = await destination();
  const open = vi.fn(async () => "");
  const writer = new WordExport(async () => file, open);
  expect(await writer.save("Original.")).toBe("saved");
  expect((await readFile(file)).subarray(0, 2).toString()).toBe("PK");
  expect(await writer.open()).toBe("opened");
  expect(open).toHaveBeenCalledWith(file);
  open.mockResolvedValueOnce("Synthetic association failure");
  expect(await writer.open()).toBe("openFailed");
});
it("preserves an existing document and invalidates an earlier open destination on failure", async () => {
  const file = await destination();
  const writer = new WordExport(async () => file, vi.fn());
  expect(await writer.save("First.")).toBe("saved");
  await writeFile(file, "Existing user document");
  expect(await writer.save("New.")).toBe("failed");
  expect(await readFile(file, "utf8")).toBe("Existing user document");
  expect(await writer.open()).toBe("missing");
});
it("rejects overlapping saves, invalid text and non-docx destinations", async () => {
  let select!: (value: string | undefined) => void;
  const chooser = vi.fn(
    () =>
      new Promise<string | undefined>((resolve) => {
        select = resolve;
      }),
  );
  const writer = new WordExport(chooser, vi.fn());
  expect(await writer.save(null)).toBe("invalid");
  expect(chooser).not.toHaveBeenCalled();
  const first = writer.save("Original.");
  expect(await writer.save("Later.")).toBe("busy");
  expect(await writer.open()).toBe("busy");
  select("unsafe.exe");
  expect(await first).toBe("failed");
});
