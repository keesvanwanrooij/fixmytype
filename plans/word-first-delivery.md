# Word-first delivery

## Status

The Word export slice is verified. The maintainer chose Word, sentence correction, rewriting and dictation on 2026-09-06 and asked to build before physical feedback. This changes delivery priority, not the safety gates. See [evidence](evidence/2026-09-06-word.md).

## Goal

Let the maintainer prepare a social post with local repair and dictation, save a faithful Word document and continue editing it in Word.

## Why

This is a usable bridge between the delivered editor and the external adapter in [phase 6](phases/06-selected-text-repair.md). [Phase 8](phases/08-dictation-and-commands.md) owns dictation improvements. [Delivery status](README.md) remains authoritative.

## Out of scope

This slice cannot intercept typing in Word or replace text in an existing Word document. It does not install an add-in, read open documents, record a physical microphone for tests or change Windows accessibility settings. Physical acceptance and the other phase gates remain open.

## Decisions

- The user works in the owned editor first. A saved `.docx` is an explicit snapshot, not a live link. Later typing and pending repairs cannot alter that snapshot.
- Main creates a macro-free document from plain text. It does not interpret URLs, XML, document instructions or field codes. Text never supplies executable paths.
- A native Save dialog owns the destination. Existing files are never overwritten. Cancellation creates no file. A separate Open action uses only the successfully saved path, never a renderer-supplied path.
- Export preserves paragraphs, blank lines, tabs, spaces and Unicode. Invalid control characters or broken Unicode produce a visible error rather than silent data loss.
- No draft is persisted automatically. Export is deliberate retention in the folder chosen by the user, including that folder's own sync policy.

## Tasks

- [x] Add `tests/word-export.test.ts` before `src/main/word-export.ts`. Cover text fidelity, invalid input, cancellation, exclusive creation and failed opening.
- [x] Add a pinned, MIT-licensed DOCX writer to `apps/desktop/package.json`; inspect its dependency audit and keep it out of the renderer.
- [x] Add named IPC and typed preload methods in `workspace-ipc.ts`, `preload.cts` and `global.d.ts`. Reject hidden-window calls and overlapping dialogs.
- [x] Add bilingual save/open feedback to `Workspace.tsx`, `useWriting.ts` and `words.ts`. Keep the draft intact on every outcome.
- [x] Add an isolated Electron fixture for click-to-export, cancellation, later typing, stale output and save failure. Verify an exported synthetic file with installed Word without reading or modifying user documents.
- [x] Run unit tests, lint, build, real Electron checks and document navigation checks. Review cleanup before committing and pushing the result.
- [x] Checkpoint a separate repair/dictation improvement only after this slice is verified. Record actual progress in phase files and `plans/README.md`.

## First-user test path

Copy any unsaved draft before quitting the tray app. Restart from `Start FixMyType.cmd` to load the latest build. Choose prose and the intended repair language. Use Suggest for a social-post correction, then Accept or Ignore. Dictate a paragraph and test Undo. Enable spoken formatting only when you want prefixed commands such as `opdracht nieuwe alinea`. Save a new Word document, open it and confirm that it matches the reviewed draft. Direct correction inside Word remains unsupported. Report the first failing action and the expected result, without putting private text in a public issue.

## Acceptance criteria

Run `npm test`, `npm run lint`, `npm run build` and the new Word fixture from `apps/desktop`. Run `node scripts/check-docs.mjs` from the root. A real Word round-trip must preserve a synthetic NL/EN post, emoji, blank paragraphs and literal markup. Opening existing user documents is not part of the fixture. If Word cannot be isolated safely, leave that check pending and retain the export checks.

Navigation: [Project home](../README.md), [documentation](../docs/README.md), [delivery plans](README.md).
