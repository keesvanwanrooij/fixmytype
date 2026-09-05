// Opt-in integration test. Only public fixture audio and synthetic prose are processed.
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { repairText } from "../dist/main/local-repair.js";
import { transcribe } from "../dist/main/speech-service.js";
import { encodeWav } from "../dist/shared/audio.js";
import { createPreferences } from "../dist/shared/preferences.js";
const root = path.resolve(import.meta.dirname, "../.cache/runtime");
const p = { ...createPreferences(), aiMode: "suggest" };
for (const [text, language] of [
  ["This sentense has a speling mistake.", "en"],
  ["Ik heb een beschadigd toetsenbord en wil beter schriijven.", "nl"],
]) {
  const start = Date.now();
  const output = await repairText(
    text,
    { ...p, repairLanguage: language },
    AbortSignal.timeout(45000),
  );
  assert.ok(output.length > 0);
  assert.notEqual(text, output);
  console.log(
    JSON.stringify({ language, input: text, output, ms: Date.now() - start }),
  );
}
const audioFile = path.resolve(import.meta.dirname, "../.cache/jfk.wav");
await readFile(audioFile); // Fail with an actionable path if the opt-in fixture is missing.
const { stdout } = await promisify(execFile)(
  "ffmpeg",
  [
    "-v",
    "error",
    "-i",
    audioFile,
    "-f",
    "f32le",
    "-ac",
    "1",
    "-ar",
    "16000",
    "pipe:1",
  ],
  { encoding: "buffer", maxBuffer: 8000000, windowsHide: true },
);
const floats = new Float32Array(
  stdout.buffer.slice(stdout.byteOffset, stdout.byteOffset + stdout.byteLength),
);
const start = Date.now();
const result = await transcribe(
  encodeWav(floats, 16000),
  "en",
  root,
  AbortSignal.timeout(120000),
);
assert.match(result.toLowerCase(), /ask not what your country can do for you/);
assert.deepEqual(await readdir(path.join(root, "sessions")), []);
console.log(
  JSON.stringify({
    speech: "Public JFK fixture transcribed locally",
    ms: Date.now() - start,
    cleanup: "No session files remain",
  }),
);
const cancelled = new AbortController();
const interrupted = transcribe(
  encodeWav(floats, 16000),
  "en",
  root,
  cancelled.signal,
);
setTimeout(() => cancelled.abort(), 50);
await assert.rejects(interrupted);
assert.deepEqual(await readdir(path.join(root, "sessions")), []);
console.log("PASS: cancelling the real Whisper child leaves no session files.");
