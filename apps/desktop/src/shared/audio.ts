const rate = 16000;
export function encodeWav(
  samples: Float32Array,
  sourceRate: number,
): Uint8Array {
  if (
    !Number.isFinite(sourceRate) ||
    sourceRate < 8000 ||
    sourceRate > 192000 ||
    samples.length / sourceRate > 120 ||
    !samples.length
  )
    throw Error("Invalid recording");
  const count = Math.floor((samples.length * rate) / sourceRate);
  if (!count || samples.some((v) => !Number.isFinite(v)))
    throw Error("Invalid audio");
  const wav = new Uint8Array(44 + count * 2);
  const view = new DataView(wav.buffer);
  const ascii = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) wav[offset + i] = text.charCodeAt(i);
  };
  ascii(0, "RIFF");
  view.setUint32(4, wav.length - 8, true);
  ascii(8, "WAVE");
  ascii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  ascii(36, "data");
  view.setUint32(40, count * 2, true);
  for (let i = 0; i < count; i++) {
    // Average the source interval to reduce aliasing when downsampling speech.
    const begin = Math.floor((i * sourceRate) / rate),
      end = Math.min(
        samples.length,
        Math.max(begin + 1, Math.floor(((i + 1) * sourceRate) / rate)),
      );
    let sum = 0;
    for (let j = begin; j < end; j++) sum += samples[j];
    const value = Math.max(-1, Math.min(1, sum / (end - begin)));
    view.setInt16(
      44 + i * 2,
      Math.round(value * (value < 0 ? 32768 : 32767)),
      true,
    );
  }
  return wav;
}
export function isWav(value: unknown): value is Uint8Array {
  if (
    !(value instanceof Uint8Array) ||
    value.length < 46 ||
    value.length > 3840044 ||
    value.length % 2
  )
    return false;
  const v = new DataView(value.buffer, value.byteOffset, value.byteLength);
  const text = (a: number, b: number) =>
    String.fromCharCode(...value.slice(a, b));
  return (
    text(0, 4) === "RIFF" &&
    text(8, 16) === "WAVEfmt " &&
    text(36, 40) === "data" &&
    v.getUint32(4, true) === value.length - 8 &&
    v.getUint32(16, true) === 16 &&
    v.getUint16(20, true) === 1 &&
    v.getUint16(22, true) === 1 &&
    v.getUint32(24, true) === rate &&
    v.getUint32(28, true) === 32000 &&
    v.getUint16(32, true) === 2 &&
    v.getUint16(34, true) === 16 &&
    v.getUint32(40, true) === value.length - 44
  );
}
