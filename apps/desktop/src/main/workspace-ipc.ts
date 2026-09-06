import {
  app,
  clipboard,
  dialog,
  shell,
  ipcMain,
  type BrowserWindow,
  type IpcMainInvokeEvent,
} from "electron";
import path from "node:path";
import { isPreferences } from "../shared/preferences.js";
import { localModelReady, repairText } from "./local-repair.js";
import { speechReady, transcribe } from "./speech-service.js";
import { InputWorker } from "./input-worker.js";
import { validSamples } from "../shared/calibration.js";
import { WordExport } from "./word-export.js";
export function registerWorkspace(window: BrowserWindow) {
  const word = new WordExport(
    async (language) => {
      const result = await dialog.showSaveDialog(window, {
        title:
          language === "nl"
            ? "Opslaan als Word-document"
            : "Save a Word document",
        defaultPath: path.join(app.getPath("documents"), "FixMyType.docx"),
        filters: [{ name: "Word (.docx)", extensions: ["docx"] }],
        properties: ["showOverwriteConfirmation"],
      });
      return !result.canceled && window.isVisible()
        ? result.filePath
        : undefined;
    },
    (file) => shell.openPath(file),
  );
  const worker = new InputWorker(
    app.isPackaged
      ? path.join(process.resourcesPath, "fixmytype-input-worker.exe")
      : path.join(
          import.meta.dirname,
          "../../../../target/debug/fixmytype-input-worker.exe",
        ),
  );
  const runtime = app.isPackaged
    ? path.join(app.getPath("userData"), "runtime")
    : path.join(import.meta.dirname, "../../.cache/runtime");
  const jobs = new Map<string, AbortController>();
  let microphone = false;
  const trusted = (event: IpcMainInvokeEvent) => {
    if (event.senderFrame !== window.webContents.mainFrame)
      throw Error("INVALID_SENDER");
  };
  const cancel = (notify = true) => {
    microphone = false;
    for (const job of jobs.values()) job.abort();
    if (notify && !window.webContents.isDestroyed())
      window.webContents.send("capture:stop");
  };
  window.on("hide", () => cancel());
  window.on("hide", () => void worker.reset());
  window.webContents.on("render-process-gone", () => void worker.reset());
  window.webContents.on("render-process-gone", () => cancel(false));
  const beforeQuit = () => {
    cancel();
    void worker.dispose();
  };
  app.on("before-quit", beforeQuit);
  window.once("closed", () => {
    app.removeListener("before-quit", beforeQuit);
    void worker.dispose();
  });
  window.webContents.session.setPermissionCheckHandler(
    (contents, permission, _origin, details) =>
      contents === window.webContents &&
      microphone &&
      permission === "media" &&
      details.mediaType === "audio",
  );
  window.webContents.session.setPermissionRequestHandler(
    (contents, permission, callback, details) =>
      callback(
        contents === window.webContents &&
          microphone &&
          permission === "media" &&
          "mediaTypes" in details &&
          details.mediaTypes?.length === 1 &&
          details.mediaTypes[0] === "audio",
      ),
  );
  const handle = (
    channel: string,
    fn: (event: IpcMainInvokeEvent, value: unknown) => unknown,
  ) => {
    ipcMain.removeHandler(channel);
    ipcMain.handle(channel, (event, value: unknown) => {
      trusted(event);
      return fn(event, value);
    });
  };
  let checking:
    Promise<{ ai: boolean; speech: boolean; worker: boolean }> | undefined;
  handle("workspace:status", () => {
    checking ??= Promise.all([
      worker.request("status").then(
        () => true,
        () => false,
      ),
      localModelReady(AbortSignal.timeout(3000)).then(
        () => true,
        () => false,
      ),
      speechReady(runtime),
    ])
      .then(([worker, ai, speech]) => ({ worker, ai, speech }))
      .finally(() => {
        checking = undefined;
      });
    return checking;
  });
  handle("workspace:copy", (_event, value) => {
    if (typeof value !== "string" || value.length > 100000)
      throw Error("INVALID_TEXT");
    clipboard.writeText(value);
  });
  handle("workspace:save-word", (_event, value) => {
    if (!window.isVisible() || !value || typeof value !== "object")
      throw Error("INVALID_EXPORT");
    const request = value as Record<string, unknown>;
    if (
      Object.keys(request).sort().join() !== "language,text" ||
      (request.language !== "nl" && request.language !== "en")
    )
      throw Error("INVALID_EXPORT");
    return word.save(request.text, request.language);
  });
  handle("workspace:open-word", (_event, value) => {
    if (!window.isVisible() || value !== undefined)
      throw Error("INVALID_EXPORT");
    return word.open();
  });
  handle("workspace:calibrate", async (_event, value) => {
    if (!window.isVisible() || !validSamples(value))
      throw Error("INVALID_CALIBRATION");
    try {
      return (await worker.request("calibrate", undefined, value)).calibration;
    } catch {
      throw Error("CALIBRATION_UNAVAILABLE");
    }
  });
  handle("workspace:microphone", (_event, value) => {
    microphone = value === true && window.isVisible();
    return microphone;
  });
  handle("workspace:cancel", () => {
    cancel();
  });
  handle("workspace:job", async (_event, value) => {
    if (!window.isVisible()) throw Error("WINDOW_NOT_VISIBLE");
    if (typeof value !== "object" || value === null) throw Error("INVALID_JOB");
    const job = value as Record<string, unknown>;
    if (
      !["repair", "speech"].includes(String(job.kind)) ||
      jobs.has(String(job.kind))
    )
      throw Error("BUSY");
    const controller = new AbortController();
    const kind = String(job.kind);
    jobs.set(kind, controller);
    const signal = AbortSignal.any([
      controller.signal,
      AbortSignal.timeout(kind === "repair" ? 45000 : 120000),
    ]);
    try {
      if (kind === "repair") {
        const intent = job.intent ?? "correct";
        if (
          typeof job.text !== "string" ||
          !isPreferences(job.preferences) ||
          (intent !== "correct" && intent !== "rewrite")
        )
          throw Error("INVALID_REPAIR");
        return await repairText(
          job.text,
          job.preferences,
          signal,
          undefined,
          intent,
        );
      }
      if (
        !(job.audio instanceof Uint8Array) ||
        typeof job.language !== "string"
      )
        throw Error("INVALID_AUDIO");
      return await transcribe(job.audio, job.language, runtime, signal);
    } catch {
      // Electron logs rejected handlers. Never expose provider text in parse errors.
      throw Error("LOCAL_OPERATION_FAILED");
    } finally {
      jobs.delete(kind);
    }
  });
}
