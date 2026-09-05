type Range = { start: number; end: number; original: string };
export type Undo = { anchor: number; original: string };
export class DocumentBuffer {
  text: string;
  private static sequence = 0;
  private ranges = new Map<number, Range>();
  constructor(text = "") {
    this.text = text;
  }
  range(id: number): Range | undefined {
    return this.ranges.get(id);
  }
  release(id: number) {
    this.ranges.delete(id);
  }
  capture(start: number, end: number): number {
    const boundary = (n: number) =>
      Number.isInteger(n) &&
      n >= 0 &&
      n <= this.text.length &&
      !(
        n > 0 &&
        /[\uD800-\uDBFF]/.test(this.text[n - 1]) &&
        /[\uDC00-\uDFFF]/.test(this.text[n] ?? "")
      );
    if (!boundary(start) || !boundary(end) || end < start)
      throw Error("Invalid text range");
    const id = ++DocumentBuffer.sequence;
    this.ranges.set(id, { start, end, original: this.text.slice(start, end) });
    return id;
  }
  replaceText(next: string) {
    if (next === this.text) return;
    let start = 0,
      end = this.text.length,
      nextEnd = next.length;
    while (start < end && start < nextEnd && this.text[start] === next[start])
      start++;
    while (
      end > start &&
      nextEnd > start &&
      this.text[end - 1] === next[nextEnd - 1]
    ) {
      end--;
      nextEnd--;
    }
    this.edit(start, end, next.slice(start, nextEnd));
  }
  private edit(start: number, end: number, replacement: string) {
    const delta = replacement.length - (end - start);
    for (const [id, range] of this.ranges) {
      // At a collapsed dictation anchor, concurrent typing makes insertion ambiguous.
      if (range.start === range.end && start <= range.start && end >= range.end)
        this.ranges.delete(id);
      else if (end <= range.start) {
        range.start += delta;
        range.end += delta;
      } else if (start < range.end) this.ranges.delete(id);
    }
    this.text = this.text.slice(0, start) + replacement + this.text.slice(end);
  }
  apply(id: number, replacement: string): Undo | undefined {
    const range = this.ranges.get(id);
    this.ranges.delete(id);
    if (!range || this.text.slice(range.start, range.end) !== range.original)
      return;
    this.edit(range.start, range.end, replacement);
    return {
      anchor: this.capture(range.start, range.start + replacement.length),
      original: range.original,
    };
  }
  undo(change: Undo): boolean {
    const result = this.apply(change.anchor, change.original);
    if (!result) return false;
    this.release(result.anchor);
    return true;
  }
}
export function completedSentences(
  text: string,
): { start: number; end: number }[] {
  const sentences: { start: number; end: number }[] = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\n") {
      start = i + 1;
      continue;
    }
    if (
      /[.!?]/.test(text[i]) &&
      (i === text.length - 1 || /\s/.test(text[i + 1]))
    ) {
      while (start < i && /\s/.test(text[start])) start++;
      if (start < i) sentences.push({ start, end: i + 1 });
      start = i + 1;
    }
  }
  return sentences;
}
