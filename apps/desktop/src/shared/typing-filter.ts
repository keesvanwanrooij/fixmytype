export type Key = {
  key: string;
  timeStamp: number;
  repeat: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  isComposing: boolean;
  shiftKey: boolean;
  isTrusted: boolean;
  code: string;
};
export const cleanKey = (key: Key) =>
  key.isTrusted === true &&
  key.repeat === false &&
  key.ctrlKey === false &&
  key.altKey === false &&
  key.metaKey === false &&
  key.shiftKey === false &&
  key.isComposing === false &&
  Number.isFinite(key.timeStamp) &&
  key.timeStamp >= 0 &&
  /^Key[A-Z]$/.test(key.code) &&
  /^[a-z]$/i.test(key.key);
export class ChatterFilter {
  private previous?: Key;
  reset() {
    this.previous = undefined;
  }
  suppress(event: Key, level: number): boolean {
    const previous = this.previous;
    this.previous = event;
    const elapsed = event.timeStamp - (previous?.timeStamp ?? event.timeStamp);
    return Boolean(
      previous &&
      cleanKey(previous) &&
      cleanKey(event) &&
      previous.key === event.key &&
      previous.code === event.code &&
      Number.isInteger(level) &&
      level >= 1 &&
      level <= 5 &&
      elapsed > 0 &&
      elapsed <= [8, 12, 18, 24, 30][level - 1],
    );
  }
}
