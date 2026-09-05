import { expect, it } from "vitest";
import { encodeWav, isWav } from "../src/shared/audio.js";
it("encodes mono PCM16 at 16kHz, clamps samples and validates header lengths", () => {
  const wav = encodeWav(new Float32Array([0, 2, -2, 0]), 16000);
  const v = new DataView(wav.buffer);
  expect(wav.length).toBe(52);
  expect(v.getUint32(24, true)).toBe(16000);
  expect(v.getInt16(46, true)).toBe(32767);
  expect(v.getInt16(48, true)).toBe(-32768);
  expect(isWav(wav)).toBe(true);
  expect(isWav(wav.slice(0, 50))).toBe(false);
});
it("resamples browser audio and rejects invalid or excessive recordings", () => {
  expect(encodeWav(new Float32Array(48000), 48000).length).toBe(32044);
  expect(() => encodeWav(new Float32Array([NaN]), 16000)).toThrow();
  expect(() => encodeWav(new Float32Array(1), 0)).toThrow();
  expect(isWav(new Uint8Array(4000000))).toBe(false);
});
