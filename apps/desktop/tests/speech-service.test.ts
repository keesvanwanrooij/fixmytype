import { expect, it } from "vitest";
import { transcribe } from "../src/main/speech-service.js";
import { encodeWav } from "../src/shared/audio.js";
it("fails safely when the runtime is missing or the job is already cancelled", async () => {
  const wav = encodeWav(new Float32Array(160), 16000);
  await expect(
    transcribe(
      wav,
      "en",
      "missing-synthetic-runtime",
      new AbortController().signal,
    ),
  ).rejects.toThrow("SPEECH_NOT_INSTALLED");
  await expect(
    transcribe(wav, "en", "missing-synthetic-runtime", AbortSignal.abort()),
  ).rejects.toThrow();
});
it("rejects invalid audio and invalid languages before touching the filesystem or spawning", async () => {
  await expect(
    transcribe(
      new Uint8Array(10),
      "en",
      "missing",
      new AbortController().signal,
    ),
  ).rejects.toThrow("INVALID_AUDIO");
  await expect(
    transcribe(
      new Uint8Array(10),
      "../../file",
      "missing",
      new AbortController().signal,
    ),
  ).rejects.toThrow();
});
