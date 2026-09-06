import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  DocumentBuffer,
  completedSentences,
  type Undo,
} from "../shared/document-buffer.js";
import type { Preferences } from "../shared/preferences.js";
import { formatDictation } from "../shared/dictation.js";
import { startRecording, type Recording } from "./recorder.js";
import {
  TargetSession,
  editorDescriptor,
  type TargetLease,
} from "../shared/target.js";
export type Entry = {
  id: number;
  kind: "repair" | "speech";
  original: string;
  result: string;
  state: "suggested" | "applied" | "stale" | "ignored" | "undone";
  anchor?: number;
  undo?: Undo;
};
const editor = () =>
  document.querySelector<HTMLTextAreaElement>("#writing-editor");
export function useWriting(
  preferences: Preferences,
  surface: "workspace" | "history" | "inactive",
) {
  const buffer = useRef(new DocumentBuffer());
  const target = useRef(new TargetSession());
  const documentId = useRef(crypto.randomUUID());
  const micTarget = useRef<TargetLease | undefined>(undefined);
  useLayoutEffect(() => {
    const expected = editor();
    const selectEditor = () =>
      target.current.select(
        editorDescriptor(expected, expected, documentId.current),
      );
    if (surface === "workspace") selectEditor();
    else
      target.current.select(
        surface === "history"
          ? {
              targetId: "writing-editor",
              documentId: documentId.current,
              scope: "owned",
              kind: "plain",
            }
          : null,
      );
    const focus = (event: FocusEvent) => {
      if (event.target === expected) {
        if (!target.current.capture()) selectEditor();
      } else if (
        event.target instanceof HTMLElement &&
        event.target.matches(
          "textarea,select,[contenteditable],input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=range])",
        )
      ) {
        target.current.select(null);
      }
    };
    document.addEventListener("focusin", focus);
    return () => {
      document.removeEventListener("focusin", focus);
      target.current.select(null);
    };
  }, [surface]);
  const [text, setText] = useState("");
  const [history, setHistory] = useState<Entry[]>([]);
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [startingRecording, setStartingRecording] = useState(false);
  const [spokenFormatting, setSpokenFormatting] = useState(false);
  const micOptions = useRef({
    formatting: false,
    language: preferences.repairLanguage,
  });
  const [transcribing, setTranscribing] = useState(false);
  const [message, setMessage] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportedText, setExportedText] = useState<string | undefined>(
    undefined,
  );
  const exportPending = useRef(false);
  const [status, setStatus] = useState({ ai: false, speech: false });
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  const pending = useRef(false),
    epoch = useRef(0),
    sequence = useRef(0),
    scanned = useRef<number[]>([]);
  const microphone = useRef<Recording | undefined>(undefined),
    starting = useRef(false),
    stopping = useRef(false),
    micAnchor = useRef<number | undefined>(undefined);
  const composing = useRef(false),
    selection = useRef<{ start: number; end: number } | undefined>(undefined);
  const options = useRef(preferences);
  options.current = preferences;
  const sentences = completedSentences(text);
  const sentenceVersion = text.slice(0, sentences.at(-1)?.end ?? 0);
  const refresh = useCallback(() => {
    void window.fixMyType
      .status()
      .then(setStatus)
      .catch(() => setMessage("runtimeError"));
  }, []);
  useEffect(refresh, [refresh]);
  const append = (entry: Entry) =>
    setHistory((current) => {
      const list = [entry, ...current];
      for (const old of list.slice(50)) {
        if (old.anchor) buffer.current.release(old.anchor);
        if (old.undo) buffer.current.release(old.undo.anchor);
      }
      return list.slice(0, 50);
    });
  const onText = (value: string) => {
    buffer.current.replaceText(value);
    setText(value);
  };
  const apply = (
    anchor: number,
    result: string,
    lease: TargetLease | undefined,
  ) => {
    if (!target.current.allows(lease)) return;
    if (
      surface === "workspace" &&
      editorDescriptor(editor(), editor(), documentId.current).kind !== "plain"
    )
      return;
    const d = buffer.current,
      range = d.range(anchor),
      el = editor();
    if (range && el && document.activeElement === el) {
      const delta = result.length - (range.end - range.start);
      const shift = (n: number) =>
        n <= range.start
          ? n
          : n >= range.end
            ? n + delta
            : range.start + result.length;
      selection.current = {
        start: shift(el.selectionStart),
        end: shift(el.selectionEnd),
      };
    }
    const undo = d.apply(anchor, result);
    setText(d.text);
    return undo;
  };
  useLayoutEffect(() => {
    if (selection.current) {
      editor()?.setSelectionRange(
        selection.current.start,
        selection.current.end,
      );
      selection.current = undefined;
    }
  }, [text]);
  const cancel = useCallback(() => {
    epoch.current++;
    microphone.current?.cancel();
    microphone.current = undefined;
    if (micAnchor.current) buffer.current.release(micAnchor.current);
    micAnchor.current = undefined;
    setRecording(false);
    setMessage("cancelled");
    void window.fixMyType.cancel();
  }, []);
  useEffect(
    () =>
      window.fixMyType.onCaptureStop(() => {
        epoch.current++;
        microphone.current?.cancel();
        microphone.current = undefined;
        if (micAnchor.current) buffer.current.release(micAnchor.current);
        micAnchor.current = undefined;
        setRecording(false);
      }),
    [],
  );
  useEffect(() => {
    epoch.current++;
    if (pending.current) setMessage("cancelled");
    void window.fixMyType.cancel();
    return () => {
      epoch.current++;
    };
  }, [
    preferences.aiMode,
    preferences.profile,
    preferences.repairLanguage,
    preferences.intensity,
    preferences.styleCard,
    preferences.vocabulary,
  ]);
  useEffect(
    () => () => {
      microphone.current?.cancel();
      void window.fixMyType.cancel();
    },
    [],
  );
  const requestRepair = async (
    anchor: number,
    intent: "correct" | "rewrite" = "correct",
  ) => {
    const range = buffer.current.range(anchor);
    if (!range || pending.current) return;
    const original = range.original,
      version = epoch.current,
      lease = target.current.capture(),
      p = options.current;
    pending.current = true;
    setBusy(true);
    setMessage("repairing");
    try {
      const result = await (intent === "rewrite"
        ? window.fixMyType.rewrite(original, p)
        : window.fixMyType.repair(original, p));
      if (version !== epoch.current) {
        buffer.current.release(anchor);
        return;
      }
      if (result === original) {
        setMessage("unchanged");
        return;
      }
      let undo: Undo | undefined;
      const automatic =
        intent === "correct" && p.aiMode === "automatic" && !composing.current;
      if (automatic) undo = apply(anchor, result, lease);
      const state = automatic
        ? undo
          ? "applied"
          : "stale"
        : buffer.current.range(anchor)
          ? "suggested"
          : "stale";
      if (undo) scanned.current.push(undo.anchor);
      append({
        id: ++sequence.current,
        kind: "repair",
        original,
        result,
        state,
        anchor,
        undo,
      });
      setMessage(state === "stale" ? "staleResult" : "repairDone");
    } catch {
      if (version === epoch.current) setMessage("repairError");
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };
  const editSelection = (intent: "correct" | "rewrite") => {
    if (pending.current || options.current.aiMode === "off") return;
    const el = editor(),
      d = buffer.current;
    const start = el?.selectionStart ?? 0,
      end = el?.selectionEnd ?? 0;
    if (!d.text.trim()) return;
    const anchor = d.capture(
      start === end ? 0 : start,
      start === end ? d.text.length : end,
    );
    scanned.current.push(anchor);
    void requestRepair(anchor, intent);
  };
  const repair = () => editSelection("correct");
  const rewrite = () => editSelection("rewrite");
  useEffect(() => {
    if (
      preferences.aiMode === "off" ||
      surface !== "workspace" ||
      !status.ai ||
      !visible ||
      preferences.profile === "code" ||
      preferences.profile === "spreadsheet" ||
      busy ||
      recording ||
      transcribing
    )
      return;
    const timer = window.setTimeout(() => {
      if (pending.current || composing.current || document.hidden) return;
      const d = buffer.current;
      scanned.current = scanned.current.filter((id) => Boolean(d.range(id)));
      const seen = new Set(
        scanned.current.map((id) => {
          const r = d.range(id)!;
          return `${r.start}:${r.end}`;
        }),
      );
      const next = completedSentences(d.text).find(
        (r) => r.end - r.start <= 4000 && !seen.has(`${r.start}:${r.end}`),
      );
      if (next) {
        const anchor = d.capture(next.start, next.end);
        scanned.current.push(anchor);
        void requestRepair(anchor);
      }
    }, 700);
    return () => clearTimeout(timer);
    // Unfinished later typing must not restart the timer for an earlier complete sentence.
  }, [
    sentenceVersion,
    preferences.aiMode,
    preferences.profile,
    status.ai,
    busy,
    recording,
    transcribing,
    surface,
    visible,
  ]);
  const accept = (entry: Entry) => {
    if (!entry.anchor) return;
    const undo = apply(entry.anchor, entry.result, target.current.capture());
    if (undo) scanned.current.push(undo.anchor);
    setHistory((current) =>
      current.map((e) =>
        e.id === entry.id
          ? { ...e, state: undo ? "applied" : "stale", undo }
          : e,
      ),
    );
  };
  const ignore = (entry: Entry) => {
    setHistory((current) =>
      current.map((e) => (e.id === entry.id ? { ...e, state: "ignored" } : e)),
    );
  };
  const undo = (entry: Entry) => {
    if (!entry.undo) return;
    // Undo uses the same selection transformation and consumes its inverse anchor.
    const inverse = apply(
      entry.undo.anchor,
      entry.undo.original,
      target.current.capture(),
    );
    if (inverse) {
      scanned.current.push(inverse.anchor);
    }
    setHistory((current) =>
      current.map((e) =>
        e.id === entry.id ? { ...e, state: inverse ? "undone" : "stale" } : e,
      ),
    );
  };
  const dictate = async () => {
    if (starting.current || stopping.current) return;
    if (microphone.current) {
      const mic = microphone.current;
      microphone.current = undefined;
      setRecording(false);
      stopping.current = true;
      setTranscribing(true);
      const version = epoch.current,
        anchor = micAnchor.current;
      micAnchor.current = undefined;
      try {
        const audio = await mic.stop();
        await window.fixMyType.microphone(false);
        setMessage("transcribing");
        const transcript = await window.fixMyType.transcribe(
          audio,
          micOptions.current.language,
        );
        if (version !== epoch.current || !transcript.trim()) {
          if (anchor) buffer.current.release(anchor);
          setMessage(version !== epoch.current ? "cancelled" : "noSpeech");
          return;
        }
        const result = formatDictation(
          transcript,
          micOptions.current.formatting,
          micOptions.current.language,
        );
        const undo =
          anchor && micTarget.current
            ? apply(anchor, result, micTarget.current)
            : undefined;
        append({
          id: ++sequence.current,
          kind: "speech",
          original: transcript === result ? "" : transcript,
          result,
          state: undo ? "applied" : "stale",
          undo,
        });
        setMessage(undo ? "dictated" : "staleResult");
      } catch (error) {
        setMessage(
          error instanceof Error && error.message === "NO_SPEECH"
            ? "noSpeech"
            : "speechError",
        );
        if (anchor) buffer.current.release(anchor);
      } finally {
        stopping.current = false;
        setTranscribing(false);
        void window.fixMyType.microphone(false);
      }
      return;
    }
    if (!status.speech) {
      setMessage("speechError");
      return;
    }
    starting.current = true;
    setStartingRecording(true);
    const version = epoch.current;
    try {
      micOptions.current = {
        formatting: spokenFormatting,
        language: options.current.repairLanguage,
      };
      const el = editor(),
        d = buffer.current;
      micTarget.current = target.current.capture();
      micAnchor.current = d.capture(
        el?.selectionStart ?? d.text.length,
        el?.selectionEnd ?? d.text.length,
      );
      await window.fixMyType.microphone(true);
      const mic = await startRecording(() => void dictate());
      if (version !== epoch.current) {
        mic.cancel();
        void window.fixMyType.microphone(false);
        return;
      }
      microphone.current = mic;
      setRecording(true);
      setMessage("recordingNow");
    } catch {
      if (micAnchor.current) buffer.current.release(micAnchor.current);
      micAnchor.current = undefined;
      setMessage("microphoneError");
      void window.fixMyType.microphone(false);
    } finally {
      starting.current = false;
      setStartingRecording(false);
    }
  };
  const copy = (value = text) =>
    void window.fixMyType
      .copy(value)
      .then(() => setMessage("copied"))
      .catch(() => setMessage("copyError"));
  const saveWord = async () => {
    if (exportPending.current) return;
    exportPending.current = true;
    setExporting(true);
    setExportedText(undefined);
    const snapshot = text;
    try {
      const result = await window.fixMyType.saveWord(
        snapshot,
        options.current.interfaceLanguage,
      );
      if (result === "saved") setExportedText(snapshot);
      setMessage(
        result === "saved"
          ? "wordSaved"
          : result === "cancelled"
            ? "wordCancelled"
            : "wordError",
      );
    } catch {
      setMessage("wordError");
    } finally {
      exportPending.current = false;
      setExporting(false);
    }
  };
  const openWord = async () => {
    try {
      const result = await window.fixMyType.openWord();
      setMessage(result === "opened" ? "wordOpened" : "wordOpenError");
    } catch {
      setMessage("wordOpenError");
    }
  };
  return {
    text,
    onText,
    history,
    busy,
    recording,
    startingRecording,
    spokenFormatting,
    setSpokenFormatting,
    transcribing,
    message,
    status,
    refresh,
    repair,
    rewrite,
    dictate,
    cancel,
    accept,
    ignore,
    undo,
    copy,
    saveWord,
    openWord,
    exporting,
    wordSaved: exportedText !== undefined,
    wordOutdated: exportedText !== undefined && exportedText !== text,
    composing,
  };
}
