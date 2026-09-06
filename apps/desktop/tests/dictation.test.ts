import { expect, it } from "vitest";
import { formatDictation } from "../src/shared/dictation.js";

// Formatting only touches the new transcript after explicit consent, never an existing document.
it("keeps literal dictation byte-for-byte by default", () => {
  const literal = "  Zeg opdracht nieuwe alinea.\nCommand comma.  ";
  expect(formatDictation(literal, false, "auto")).toBe(literal);
});
it("formats Dutch paragraph and punctuation commands without changing prose", () => {
  expect(
    formatDictation(
      "Hallo opdracht komma wereld opdracht uitroepteken. Opdracht nieuwe alinea. Mijn bericht.",
      true,
      "nl",
    ),
  ).toBe("Hallo, wereld!\n\nMijn bericht.");
  expect(
    formatDictation(
      "Wat opdracht vraagteken. Opdracht nieuwe regel. Klaar opdracht punt.",
      true,
      "nl",
    ),
  ).toBe("Wat?\nKlaar.");
});
it("formats English and mixed commands only for the requested language", () => {
  expect(
    formatDictation(
      "Hello command comma world command full stop. Command new paragraph. Next.",
      true,
      "en",
    ),
  ).toBe("Hello, world.\n\nNext.");
  expect(
    formatDictation("Command new line. Opdracht nieuwe regel.", true, "auto"),
  ).toBe("\n\n");
  expect(formatDictation("Command new line.", true, "nl")).toBe(
    "Command new line.",
  );
});
it("keeps unknown, destructive, unprefixed and embedded phrases literal", () => {
  for (const text of [
    "command delete everything",
    "opdracht verstuur mijn bericht",
    "nieuwe alinea",
    "precommand comma",
    "command commas",
    "opdracht puntkomma",
  ])
    expect(formatDictation(text, true, "auto")).toBe(text);
});
it("allows command-only blank paragraphs and preserves unrelated whitespace", () => {
  expect(formatDictation("OPDRACHT NIEUWE ALINEA.", true, "nl")).toBe("\n\n");
  expect(
    formatDictation("Keep  two spaces.\nAlready a line.", true, "en"),
  ).toBe("Keep  two spaces.\nAlready a line.");
});
