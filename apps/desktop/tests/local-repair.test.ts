import { expect, it, vi } from "vitest";
import { repairText } from "../src/main/local-repair.js";
import { createPreferences } from "../src/shared/preferences.js";
const preferences = { ...createPreferences(), aiMode: "suggest" as const };
// A late, malformed or oversized local response never becomes a text edit.
it("rejects extra fields, empty output, excessive expansion and non-object replies", async () => {
  for (const output of [
    '{"text":"Hello.","execute":"anything"}',
    '{"text":""}',
    JSON.stringify({ text: "x".repeat(101) }),
    "null",
    "[]",
  ]) {
    const f = vi
      .fn()
      .mockResolvedValueOnce(response({ details: { format: "gguf" } }))
      .mockResolvedValueOnce(response({ response: output }));
    await expect(
      repairText("Helo.", preferences, new AbortController().signal, f),
    ).rejects.toThrow("INVALID_REPAIR");
  }
});
it("honors pre-cancellation without contacting the provider", async () => {
  const f = vi.fn(),
    controller = new AbortController();
  controller.abort();
  await expect(
    repairText("Helo.", preferences, controller.signal, f),
  ).rejects.toThrow();
  expect(f).not.toHaveBeenCalled();
});
it("discards a result if cancellation arrives while its body is being read", async () => {
  const controller = new AbortController();
  const f = vi
    .fn()
    .mockResolvedValueOnce(response({ details: { format: "gguf" } }))
    .mockImplementationOnce(async () => {
      controller.abort();
      return response({ response: '{"text":"Hello."}' });
    });
  await expect(
    repairText("Helo.", preferences, controller.signal, f),
  ).rejects.toThrow();
});
it("caps streamed generation bytes even without a content-length header", async () => {
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array(65537).fill(32));
    },
    cancel() {
      cancelled = true;
    },
  });
  const f = vi
    .fn()
    .mockResolvedValueOnce(response({ details: { format: "gguf" } }))
    .mockResolvedValueOnce(new Response(stream));
  const controller = new AbortController();
  // End the synthetic stream after a bounded wait if the implementation ignores the cap.
  const timer = setTimeout(() => controller.abort(), 100);
  try {
    await expect(
      repairText("Helo.", preferences, controller.signal, f),
    ).rejects.toThrow();
    expect(cancelled).toBe(true);
  } finally {
    clearTimeout(timer);
  }
}, 1000);
it("rejects runtime disconnects and malformed JSON without a replacement", async () => {
  for (const result of [
    () => Promise.reject(Error("connection closed")),
    () => Promise.resolve(new Response("not JSON")),
  ]) {
    const f = vi
      .fn()
      .mockResolvedValueOnce(response({ details: { format: "gguf" } }))
      .mockImplementationOnce(result);
    await expect(
      repairText("Helo.", preferences, new AbortController().signal, f),
    ).rejects.toThrow();
  }
});
it("preserves signed numbers and percentages", async () => {
  const f = vi
    .fn()
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ details: { format: "gguf" } })),
    )
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ response: '{"text":"Return 10%."}' })),
    );
  await expect(
    repairText("Return -10%.", preferences, new AbortController().signal, f),
  ).rejects.toThrow("PROTECTED_TEXT_CHANGED");
});
const response = (value: unknown) => new Response(JSON.stringify(value));
it("only contacts the fixed loopback runtime and parses a bounded result", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(response({ details: { format: "gguf" } }))
    .mockResolvedValueOnce(response({ response: '{"text":"This is mine."}' }));
  expect(
    await repairText(
      "Thiss is mine.",
      preferences,
      new AbortController().signal,
      fetcher,
    ),
  ).toBe("This is mine.");
  expect(
    fetcher.mock.calls.every((c) =>
      String(c[0]).startsWith("http://127.0.0.1:11434/"),
    ),
  ).toBe(true);
});
it("rejects cloud-backed aliases, bad JSON and changed numbers", async () => {
  const cloud = vi
    .fn()
    .mockResolvedValue(
      response({ remote_model: "remote", details: { format: "gguf" } }),
    );
  await expect(
    repairText("hello", preferences, new AbortController().signal, cloud),
  ).rejects.toThrow();
  for (const output of ["not json", '{"text":"Price 200."}']) {
    const f = vi
      .fn()
      .mockResolvedValueOnce(response({ details: { format: "gguf" } }))
      .mockResolvedValueOnce(response({ response: output }));
    await expect(
      repairText("Price 100.", preferences, new AbortController().signal, f),
    ).rejects.toThrow();
  }
});
it("never sends code profiles, formulas, AI-off requests or oversized input", async () => {
  const f = vi.fn();
  for (const [text, p] of [
    ["hello", { ...preferences, profile: "code" }],
    ["=SUM(A1:A2)", preferences],
    ["hello", createPreferences()],
    ["x".repeat(4001), preferences],
  ] as const) {
    await expect(
      repairText(text, p, new AbortController().signal, f),
    ).rejects.toThrow();
  }
  expect(f).not.toHaveBeenCalled();
});
