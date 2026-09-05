import { encodeWav } from "../shared/audio.js";
export type Recording = { stop: () => Promise<Uint8Array>; cancel: () => void };
export async function startRecording(onLimit: () => void): Promise<Recording> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
    video: false,
  });
  let context: AudioContext | undefined;
  try {
    context = new AudioContext();
    await context.resume();
    const audio = context,
      source = audio.createMediaStreamSource(stream),
      processor = audio.createScriptProcessor(4096, 1, 1);
    const chunks: Float32Array[] = [];
    let count = 0,
      ended = false;
    const timer = window.setTimeout(onLimit, 115000);
    processor.onaudioprocess = (event) => {
      if (ended) return;
      const input = event.inputBuffer.getChannelData(0);
      if ((count + input.length) / audio.sampleRate > 115) {
        onLimit();
        return;
      }
      chunks.push(input.slice());
      count += input.length;
    };
    // Output remains silence: microphone samples are never connected to the speakers.
    source.connect(processor);
    processor.connect(audio.destination);
    const close = () => {
      ended = true;
      clearTimeout(timer);
      processor.onaudioprocess = null;
      source.disconnect();
      processor.disconnect();
      stream.getTracks().forEach((track) => track.stop());
      void audio.close();
    };
    return {
      cancel: () => {
        if (!ended) close();
        chunks.length = 0;
      },
      stop: async () => {
        if (ended) throw Error("RECORDING_ENDED");
        close();
        const samples = new Float32Array(count);
        let offset = 0;
        for (const chunk of chunks) {
          samples.set(chunk, offset);
          offset += chunk.length;
        }
        chunks.length = 0;
        if (
          !count ||
          samples.reduce((sum, n) => sum + n * n, 0) / count < 0.000001
        )
          throw Error("NO_SPEECH");
        return encodeWav(samples, audio.sampleRate);
      },
    };
  } catch (error) {
    stream.getTracks().forEach((track) => track.stop());
    if (context) void context.close();
    throw error;
  }
}
