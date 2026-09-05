import { spawn } from "node:child_process";
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { isWav } from "../shared/audio.js";
export const speechPaths = (root: string) => ({
  binary: path.join(root, "whisper", "Release", "whisper-cli.exe"),
  model: path.join(root, "ggml-base.bin"),
});
export async function speechReady(root: string): Promise<boolean> {
  const { binary, model } = speechPaths(root);
  try {
    await Promise.all([access(binary), access(model)]);
    return true;
  } catch {
    return false;
  }
}
export async function transcribe(
  wav: Uint8Array,
  language: string,
  root: string,
  signal: AbortSignal,
): Promise<string> {
  if (!isWav(wav) || !["auto", "nl", "en"].includes(language))
    throw Error("INVALID_AUDIO");
  signal.throwIfAborted();
  if (!(await speechReady(root))) throw Error("SPEECH_NOT_INSTALLED");
  const parent = path.join(root, "sessions");
  await mkdir(parent, { recursive: true });
  const directory = await mkdtemp(path.join(parent, "recording-"));
  try {
    const input = path.join(directory, "audio.wav"),
      output = path.join(directory, "transcript");
    await writeFile(input, wav);
    signal.throwIfAborted();
    const { binary, model } = speechPaths(root);
    await new Promise<void>((resolve, reject) => {
      const child = spawn(
        binary,
        [
          "-m",
          model,
          "-f",
          input,
          "-l",
          language,
          "-otxt",
          "-of",
          output,
          "-nt",
          "-np",
          "-t",
          "4",
          "-ng",
        ],
        { shell: false, windowsHide: true, stdio: "ignore", signal },
      );
      child.once("error", reject);
      child.once("close", (code) =>
        code === 0 ? resolve() : reject(Error("TRANSCRIPTION_FAILED")),
      );
    });
    signal.throwIfAborted();
    const result = (await readFile(output + ".txt", "utf8")).trim();
    if (result.length > 16000) throw Error("TRANSCRIPT_TOO_LARGE");
    return result;
  } finally {
    // Only this app-created session is removed, including partial output on cancellation.
    await rm(directory, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 100,
    });
  }
}
