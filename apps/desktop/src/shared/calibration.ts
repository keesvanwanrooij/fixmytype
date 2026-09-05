import { isRecord } from "./preferences.js";
import { cleanKey, type Key } from "./typing-filter.js";
import type {
  SettingsStorage,
  SettingsStorageIssue,
} from "./settings-storage.js";
export type Sample = { interval: number; intent: "accidental" | "deliberate" };
export type AcceptedCalibration = {
  level: number;
  accidentalCount: number;
  deliberateCount: number;
};
export type Calibrations = Record<string, AcceptedCalibration>;
export type Proposal = {
  status: "suggested" | "insufficient" | "overlap" | "unsupported";
  level: number | null;
  accidentalCount: number;
  deliberateCount: number;
};
export const calibrationKey = "fixmytype:calibration:v1";
const level = (v: unknown) =>
  Number.isInteger(v) && Number(v) >= 1 && Number(v) <= 5;
const count = (v: unknown) =>
  Number.isInteger(v) && Number(v) >= 0 && Number(v) <= 60;
export function validSamples(value: unknown): value is Sample[] {
  return (
    Array.isArray(value) &&
    value.length <= 60 &&
    value.every(
      (s) =>
        isRecord(s) &&
        Object.keys(s).sort().join() === "intent,interval" &&
        Number.isInteger(s.interval) &&
        Number(s.interval) >= 1 &&
        Number(s.interval) <= 5000 &&
        typeof s.intent === "string" &&
        ["accidental", "deliberate"].includes(s.intent),
    )
  );
}
export function validProposal(value: unknown): value is Proposal {
  if (
    !isRecord(value) ||
    Object.keys(value).sort().join() !==
      "accidentalCount,deliberateCount,level,status" ||
    !count(value.accidentalCount) ||
    !count(value.deliberateCount) ||
    Number(value.accidentalCount) + Number(value.deliberateCount) > 60
  )
    return false;
  return value.status === "suggested"
    ? level(value.level) &&
        Number(value.accidentalCount) >= 10 &&
        Number(value.deliberateCount) >= 10
    : typeof value.status === "string" &&
        ["insufficient", "overlap", "unsupported"].includes(value.status) &&
        value.level === null;
}
export function validCalibrations(value: unknown): value is Calibrations {
  return (
    isRecord(value) &&
    Object.keys(value).length <= 26 &&
    Object.entries(value).every(
      ([key, v]) =>
        /^Key[A-Z]$/.test(key) &&
        isRecord(v) &&
        Object.keys(v).sort().join() ===
          "accidentalCount,deliberateCount,level" &&
        validProposal({ ...v, status: "suggested" }),
    )
  );
}
export function loadCalibrations(storage: SettingsStorage): {
  values: Calibrations;
  issue?: SettingsStorageIssue;
} {
  let raw: string | null;
  try {
    raw = storage.getItem(calibrationKey);
  } catch {
    return { values: {}, issue: "unavailable" };
  }
  if (raw === null) return { values: {} };
  try {
    const stored: unknown = JSON.parse(raw);
    if (
      isRecord(stored) &&
      Object.keys(stored).sort().join() === "values,version" &&
      stored.version === 1 &&
      validCalibrations(stored.values)
    )
      return { values: stored.values };
  } catch {
    /* Keep malformed bytes for explicit recovery. */
  }
  return { values: {}, issue: "invalid" };
}
export function saveCalibrations(
  storage: SettingsStorage,
  values: Calibrations,
): SettingsStorageIssue | undefined {
  if (!validCalibrations(values)) return "invalid";
  try {
    storage.setItem(calibrationKey, JSON.stringify({ version: 1, values }));
  } catch {
    return "unavailable";
  }
}
// Only the timestamp of one pending press is retained. Reset when a pair is labelled or cancelled.
export class PairCapture {
  private previous?: number;
  private complete = false;
  constructor(private readonly code: string) {}
  reset() {
    this.previous = undefined;
    this.complete = false;
  }
  press(event: Key): number | undefined {
    if (this.complete) return;
    if (!cleanKey(event) || event.code !== this.code) {
      this.reset();
      return;
    }
    const previous = this.previous;
    this.previous = event.timeStamp;
    if (previous === undefined) return;
    const interval = Math.ceil(event.timeStamp - previous);
    if (interval < 1 || interval > 5000) {
      this.reset();
      return;
    }
    this.previous = undefined;
    this.complete = true;
    return interval;
  }
}
