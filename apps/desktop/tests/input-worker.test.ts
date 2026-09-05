import { describe, it, expect } from "vitest";
import path from "node:path";
import { InputWorker } from "../src/main/input-worker.js";

const executable = path.resolve(
  import.meta.dirname,
  "../../../target/debug/fixmytype-input-worker.exe",
);
describe("real native child ownership", () => {
  const fixture = path.join(import.meta.dirname, "fixtures/worker.mjs");
  it.each(["oversized", "version", "state", "unknown", "id", "write"])(
    "rejects a %s reply and releases the child",
    async (mode) => {
      const worker = new InputWorker(process.execPath, [fixture, mode]);
      try {
        await expect(worker.request("status")).rejects.toThrow(
          "WORKER_PROTOCOL",
        );
      } finally {
        await worker.dispose();
      }
      expect(worker.pid).toBeUndefined();
    },
  );
  it("bounds an unresponsive peer", async () => {
    const worker = new InputWorker(process.execPath, [fixture, "hang"], 100);
    try {
      await expect(worker.request("status")).rejects.toThrow("WORKER_TIMEOUT");
    } finally {
      await worker.dispose();
    }
  });
  it("cancels an in-flight request and rejects overlapping requests", async () => {
    const worker = new InputWorker(process.execPath, [fixture, "hang"]);
    const controller = new AbortController();
    const waiting = worker.request("status", controller.signal);
    const rejected = expect(waiting).rejects.toThrow("WORKER_CANCELLED");
    await expect(worker.request("status")).rejects.toThrow("WORKER_BUSY");
    controller.abort();
    await rejected;
    await worker.dispose();
  });
  it("starts idle, restarts after a crash without restoring consent, and disposes", async () => {
    const worker = new InputWorker(executable);
    try {
      expect((await worker.request("status")).state).toBe("idle");
      const first = worker.pid!;
      expect((await worker.request("start")).state).toBe("started");
      process.kill(first);
      await expect.poll(() => worker.pid).toBeUndefined();
      expect((await worker.request("status")).state).toBe("idle");
      expect(worker.pid).not.toBe(first);
      await expect(worker.request("probe")).rejects.toThrow("NOT_STARTED");
    } finally {
      await worker.dispose();
    }
    expect(worker.pid).toBeUndefined();
    await expect(worker.request("status")).rejects.toThrow("WORKER_CLOSED");
  });
  it("reports an absent binary without taking down the desktop", async () => {
    const worker = new InputWorker(executable + ".absent");
    await expect(worker.request("status")).rejects.toThrow(
      "WORKER_UNAVAILABLE",
    );
    await worker.dispose();
  });
  it("does not spawn for a pre-cancelled request", async () => {
    const worker = new InputWorker(executable);
    await expect(worker.request("status", AbortSignal.abort())).rejects.toThrow(
      "WORKER_CANCELLED",
    );
    expect(worker.pid).toBeUndefined();
    await worker.dispose();
  });
  it("cancels its child and allows a fresh idle session", async () => {
    const worker = new InputWorker(executable);
    try {
      await worker.request("start");
      await worker.reset();
      expect(worker.pid).toBeUndefined();
      expect((await worker.request("status")).state).toBe("idle");
    } finally {
      await worker.dispose();
    }
  });
});
