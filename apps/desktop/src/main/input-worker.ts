import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";

type Operation = "status" | "start" | "stop" | "probe" | "shutdown";
type Reply = {
  version: 1;
  id: number;
  state: "idle" | "started" | "closed";
  epoch: number;
  target: null | {
    target_id: string;
    document_id: null;
    kind: string;
    read_selection: false;
    replace_range: false;
  };
};
const exact = (value: Record<string, unknown>, keys: string[]) =>
  Object.keys(value).length === keys.length &&
  keys.every((key) => Object.hasOwn(value, key));
function validReply(value: unknown): value is Reply {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (
    !exact(v, ["version", "id", "state", "epoch", "target"]) ||
    v.version !== 1 ||
    !Number.isSafeInteger(v.id) ||
    !Number.isSafeInteger(v.epoch) ||
    Number(v.epoch) < 0 ||
    typeof v.state !== "string" ||
    !["idle", "started", "closed"].includes(v.state)
  )
    return false;
  if (v.target === null) return true;
  if (!v.target || typeof v.target !== "object") return false;
  const t = v.target as Record<string, unknown>;
  return (
    exact(t, [
      "target_id",
      "document_id",
      "kind",
      "read_selection",
      "replace_range",
    ]) &&
    typeof t.target_id === "string" &&
    /^\d+:[a-f0-9]+$/.test(t.target_id) &&
    t.target_id.length <= 64 &&
    t.document_id === null &&
    typeof t.kind === "string" &&
    [
      "plain",
      "password",
      "read-only",
      "disabled",
      "elevated",
      "unknown",
    ].includes(t.kind) &&
    t.read_selection === false &&
    t.replace_range === false
  );
}

// Only main owns this process. No renderer-controlled executable, arguments or operation channel.
export class InputWorker {
  private child?: ChildProcessWithoutNullStreams;
  private closing = false;
  private sequence = 0;
  private pending?: {
    id: number;
    resolve: (value: Reply) => void;
    reject: (error: Error) => void;
  };
  private retiring = new Set<Promise<void>>();
  get pid() {
    return this.child?.pid;
  }
  constructor(
    private readonly executable: string,
    private readonly args: string[] = [],
    private readonly timeoutMs = 1500,
  ) {}
  private launch() {
    const child = spawn(this.executable, this.args, {
      windowsHide: true,
      stdio: "pipe",
    });
    this.child = child;
    this.sequence = 0;
    let bytes = Buffer.alloc(0);
    const fail = (code: string) => {
      if (this.child !== child) return;
      this.pending?.reject(Error(code));
      void this.reset();
    };
    child.on("error", () => fail("WORKER_UNAVAILABLE"));
    child.stdin.on("error", () => fail("WORKER_UNAVAILABLE"));
    child.stderr.resume(); // Diagnostics are discarded, never copied into user-visible errors.
    child.on("close", () => {
      if (this.child !== child) return;
      this.child = undefined;
      this.pending?.reject(Error("WORKER_UNAVAILABLE"));
    });
    child.stdout.on("data", (chunk: Buffer) => {
      if (this.child !== child) return;
      if (bytes.length + chunk.length > 4096) {
        fail("WORKER_PROTOCOL");
        return;
      }
      bytes = Buffer.concat([bytes, chunk]);
      const newline = bytes.indexOf(10);
      if (newline < 0) return;
      // There is one outstanding request. Extra replies or trailing bytes are a protocol error.
      if (newline !== bytes.length - 1 || !this.pending) {
        fail("WORKER_PROTOCOL");
        return;
      }
      let value: unknown;
      try {
        value = JSON.parse(bytes.toString("utf8"));
      } catch {
        fail("WORKER_PROTOCOL");
        return;
      }
      bytes = Buffer.alloc(0);
      if (value && typeof value === "object") {
        const error = value as Record<string, unknown>;
        if (
          exact(error, ["version", "id", "error"]) &&
          error.version === 1 &&
          error.id === this.pending.id &&
          error.error === "NOT_STARTED"
        ) {
          this.pending.reject(Error("NOT_STARTED"));
          return;
        }
      }
      if (!validReply(value) || value.id !== this.pending.id) {
        fail("WORKER_PROTOCOL");
        return;
      }
      this.pending.resolve(value);
    });
    return child;
  }
  async request(operation: Operation, signal?: AbortSignal): Promise<Reply> {
    if (this.closing) throw Error("WORKER_CLOSED");
    if (signal?.aborted) throw Error("WORKER_CANCELLED");
    if (this.pending) throw Error("WORKER_BUSY");
    const child = this.child ?? this.launch();
    const id = ++this.sequence;
    return new Promise<Reply>((resolve, reject) => {
      const finish = () => {
        clearTimeout(timer);
        signal?.removeEventListener("abort", abort);
        this.pending = undefined;
      };
      const abort = () => {
        this.pending?.reject(Error("WORKER_CANCELLED"));
        void this.reset();
      };
      const timer = setTimeout(() => {
        this.pending?.reject(Error("WORKER_TIMEOUT"));
        void this.reset();
      }, this.timeoutMs);
      this.pending = {
        id,
        resolve: (value) => {
          finish();
          resolve(value);
        },
        reject: (error) => {
          finish();
          reject(error);
        },
      };
      signal?.addEventListener("abort", abort, { once: true });
      child.stdin.write(JSON.stringify({ version: 1, id, operation }) + "\n");
    });
  }
  async reset(): Promise<void> {
    const child = this.child;
    this.child = undefined;
    this.pending?.reject(Error("WORKER_CANCELLED"));
    if (child) {
      const retired = new Promise<void>((resolve) => {
        const timer = setTimeout(() => child.kill(), 500);
        child.once("close", () => {
          clearTimeout(timer);
          resolve();
        });
        child.stdin.end(); // EOF is the normal shutdown, with a bounded forced-exit fallback.
      });
      this.retiring.add(retired);
      void retired.then(() => this.retiring.delete(retired));
    }
    await Promise.all(this.retiring);
  }
  async dispose(): Promise<void> {
    this.closing = true;
    await this.reset();
  }
}
