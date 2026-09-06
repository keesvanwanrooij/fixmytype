import { Document, Packer, Paragraph, Tab, TextRun } from "docx";
import { open, unlink } from "node:fs/promises";
import path from "node:path";

function validText(text: unknown): text is string {
  if (typeof text !== "string" || !text.trim() || text.length > 100000)
    return false;
  for (const character of text) {
    const code = character.codePointAt(0)!;
    if (
      (code < 32 && ![9, 10, 13].includes(code)) ||
      (code >= 0xd800 && code <= 0xdfff) ||
      code === 0xfffe ||
      code === 0xffff
    )
      return false;
  }
  return true;
}

export async function createWordDocument(text: unknown): Promise<Buffer> {
  if (!validText(text)) throw Error("INVALID_EXPORT");
  return Packer.toBuffer(
    new Document({
      creator: "FixMyType",
      title: "",
      description: "",
      sections: [
        {
          children: text.split(/\r\n|\r|\n/).map(
            (line) =>
              new Paragraph({
                children: line
                  .split("\t")
                  .flatMap((part, index) => [
                    ...(index ? [new TextRun({ children: [new Tab()] })] : []),
                    new TextRun(part),
                  ]),
              }),
          ),
        },
      ],
    }),
  );
}

export class WordExport {
  private busy = false;
  private savedPath: string | undefined;
  constructor(
    private choose: (language: "nl" | "en") => Promise<string | undefined>,
    private launch: (file: string) => Promise<string>,
  ) {}

  async save(text: unknown, language: "nl" | "en" = "en") {
    if (this.busy) return "busy" as const;
    if (!validText(text)) return "invalid" as const;
    this.busy = true;
    this.savedPath = undefined;
    try {
      const file = await this.choose(language);
      if (!file) return "cancelled" as const;
      if (
        !path.isAbsolute(file) ||
        path.extname(file).toLowerCase() !== ".docx"
      )
        return "failed" as const;
      const contents = await createWordDocument(text);
      // Exclusive creation is deliberate: even an approved overwrite dialog cannot
      // erase an existing document or win a race against another file creator.
      const handle = await open(file, "wx");
      try {
        await handle.writeFile(contents);
        await handle.sync();
      } catch {
        await handle.close();
        await unlink(file);
        return "failed" as const;
      }
      await handle.close();
      this.savedPath = file;
      return "saved" as const;
    } catch {
      return "failed" as const;
    } finally {
      this.busy = false;
    }
  }

  async open() {
    if (this.busy) return "busy" as const;
    if (!this.savedPath) return "missing" as const;
    this.busy = true;
    try {
      return (await this.launch(this.savedPath))
        ? ("openFailed" as const)
        : ("opened" as const);
    } catch {
      return "openFailed" as const;
    } finally {
      this.busy = false;
    }
  }
}
