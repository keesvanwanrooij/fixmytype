import { expect, it } from "vitest";
import {
  PairCapture,
  validCalibrations,
  saveCalibrations,
  loadCalibrations,
  validSamples,
  validProposal,
} from "../src/shared/calibration.js";
const event = (timeStamp: number, extra = {}) => ({
  key: "a",
  code: "KeyA",
  timeStamp,
  isTrusted: true,
  repeat: false,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  metaKey: false,
  isComposing: false,
  ...extra,
});
it("keeps one bounded interval, not a text or key history", () => {
  const capture = new PairCapture("KeyA");
  expect(capture.press(event(100))).toBeUndefined();
  expect(capture.press(event(112))).toBe(12);
  expect(capture.press(event(120))).toBeUndefined();
  capture.reset();
  expect(capture.press(event(200))).toBeUndefined();
});
it("rejects holds, modifiers, injected, alternate and invalid events", () => {
  for (const changed of [
    { repeat: true },
    { ctrlKey: true },
    { shiftKey: true },
    { altKey: true },
    { metaKey: true },
    { isTrusted: false },
    { isComposing: true },
    { code: "KeyB" },
    { timeStamp: NaN },
    { timeStamp: 100 },
    { timeStamp: 99 },
    { timeStamp: 6001 },
  ]) {
    const capture = new PairCapture("KeyA");
    capture.press(event(100));
    expect(capture.press(event(110, changed))).toBeUndefined();
  }
});
const accepted = {
  KeyA: { level: 2, accidentalCount: 10, deliberateCount: 10 },
};
it("accepts aggregate settings only and rejects invented or oversized data", () => {
  expect(validSamples([{ interval: 12, intent: { toString: null } }])).toBe(
    false,
  );
  expect(
    validProposal({
      status: { toString: null },
      level: null,
      accidentalCount: 0,
      deliberateCount: 0,
    }),
  ).toBe(false);
  expect(validCalibrations(accepted)).toBe(true);
  for (const invalid of [
    { a: accepted.KeyA },
    { KeyA: { ...accepted.KeyA, level: 6 } },
    { KeyA: { ...accepted.KeyA, accidentalCount: 9 } },
    { KeyA: { ...accepted.KeyA, deliberateCount: 51 } },
    { KeyA: { ...accepted.KeyA, samples: [12] } },
  ])
    expect(validCalibrations(invalid)).toBe(false);
});
it("saves only on an explicit call, reports denial and preserves corrupt bytes", () => {
  let bytes: string | null = null;
  const storage = {
    getItem: () => bytes,
    setItem: (_key: string, value: string) => {
      bytes = value;
    },
  };
  expect(loadCalibrations(storage).values).toEqual({});
  expect(bytes).toBeNull();
  expect(saveCalibrations(storage, accepted)).toBeUndefined();
  expect(loadCalibrations(storage).values).toEqual(accepted);
  expect(bytes).not.toContain("interval");
  bytes = "broken";
  expect(loadCalibrations(storage).issue).toBe("invalid");
  expect(bytes).toBe("broken");
  expect(
    saveCalibrations(
      {
        ...storage,
        setItem: () => {
          throw Error();
        },
      },
      accepted,
    ),
  ).toBe("unavailable");
});
