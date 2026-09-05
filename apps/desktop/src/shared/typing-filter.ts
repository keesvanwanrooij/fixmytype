type Key = {
  key: string;
  timeStamp: number;
  repeat: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  isComposing: boolean;
};
export class ChatterFilter {
  private previous?: Key;
  reset() {
    this.previous = undefined;
  }
  suppress(event: Key, level: number): boolean {
    const previous = this.previous;
    this.previous = event;
    const safe = (key: Key) =>
      !key.repeat &&
      !key.ctrlKey &&
      !key.altKey &&
      !key.metaKey &&
      !key.isComposing &&
      /^[a-z]$/i.test(key.key);
    const elapsed = event.timeStamp - (previous?.timeStamp ?? event.timeStamp);
    return Boolean(
      previous &&
      safe(previous) &&
      safe(event) &&
      previous.key === event.key &&
      Number.isInteger(level) &&
      level >= 1 &&
      level <= 5 &&
      elapsed > 0 &&
      elapsed <= [8, 12, 18, 24, 30][level - 1],
    );
  }
}
