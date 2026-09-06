# Spoken formatting evidence

Date: 2026-09-06. Checkpoint: `c626851`. Scope: [phase 8](../phases/08-dictation-and-commands.md).

The first focused run failed on the missing `dictation.ts` module. Five tests now cover literal mode, six Dutch and English commands, language selection, word boundaries, unknown/destructive phrases, preserved whitespace and command-only paragraphs. Formatting is a pure string operation with a fixed vocabulary, not an executable command dispatcher.

`npm run test:dictation` uses real Electron and fake microphone audio with controlled transcripts. It passed literal default, explicit opt-in, locked recording/transcription controls, captured-range replacement, later typing, raw-transcript history, Undo, paragraph-only insertion and Dutch labels. Its locale check exposed a Settings remount that erased save feedback. Settings now stores a translation key and retains its component on language changes. A fixture string-escaping error was also corrected without changing application expectations.

The NL screenshot of spoken formatting, draft and Word export was inspected. The formatter adds no microphone listener or persisted preference. The existing recorder owns capture and cleanup. This fixture does not claim real Dutch speech recognition quality.

## Verification

- `npm test` passed 94 tests in 21 files after cleanup.
- Lint, typecheck and build passed; the renderer was rebuilt after the locale fix.
- `npm run test:dictation` passed fake audio and controlled transcript checks.
- `npm run test:phase2` checked navigation and separate-process persistence.
- `npm run test:word` passed installed Word; `npm run test:targets` passed target guards and child lifecycle.
- `npm run test:workflow` passed real local AI and Whisper, concurrent typing and Undo after speech changes.

Installed Whisper CLI help has `--prompt` but no private prompt-file switch. Vocabulary was not exposed in process arguments. That provider work, physical microphone acceptance, Windows 200-percent text scaling and direct Word insertion remain pending.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
