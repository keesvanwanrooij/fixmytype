# Phase 8: Dictation, vocabulary and spoken commands

## Status

🔄 In progress. The app-owned dictation path passes real local transcription and fake-microphone Electron checks. Speech commands, physical Dutch microphone checks, crash recovery and external insertion remain open.

## Outcome

A visible toggle records locally, transcribes and retains a draft or inserts into a still-valid target.

## Why and scope

This phase implements the approved workflow in [the product register](../../docs/24-product-workflows.md). It owns the packages below. Later capabilities stay with their owning phase in [the delivery index](../README.md).

Planning size: One to three days including audio fixtures and device handling. This is a work estimate, not a completion guarantee.

## Read first

- Read [26-dictation-and-commands](../../docs/26-dictation-and-commands.md).
- Read [28-profiles-style-and-vocabulary](../../docs/28-profiles-style-and-vocabulary.md).
- Read [29-runtime-setup-and-scheduling](../../docs/29-runtime-setup-and-scheduling.md).
- Read [the architecture](../../docs/06-architecture.md) and [the test strategy](../../docs/12-testing-strategy.md).

## Dependencies and decisions

Required prior capabilities: phases 4, 7. The maintainer's GO authorizes implementation and commits on main. Use documented defaults and ask only if a new choice changes scope or permissions. Microphone and screen access still require explicit user interaction in the app.

## Work packages

### Package 1: Capture lifecycle

- [ ] Write tests for capture state, cancellation and duration limits in tests/dictation.test.ts.
- [x] Create renderer capture code with explicit microphone permission and track cleanup.
- [x] Snapshot the app-owned range at recording start and invalidate it when that text changes.
- [x] Bound audio memory and serialize local recognizer requests.

### Package 2: Local transcription

- [x] Create `src/main/speech-service.ts` with a pinned Whisper executable and local resources.
- [ ] Pass audio through app-owned temporary files, with cleanup on success, error and startup recovery.
- [ ] Test missing executable, corrupt audio, timeout, empty result and cancellation.
- [ ] Transcribe a synthetic English fixture and an explicit Dutch test fixture; record expected output.

### Package 3: Commands and insertion

- [ ] Feed approved vocabulary into the recognition path where supported.
- [ ] Separate command mode from literal dictation and start with punctuation or formatting commands.
- [x] Add the result to session history and insert only through the app-owned range transaction.
- [x] Retain a draft if the captured range changes or safe insertion is unsupported.

### Package 4: cleanup and delivery

- [x] Review the delivered slice for duplicated state, dead code, resource leaks and missing boundary validation.
- [x] Run affected tests after cleanup and retain actual red/green evidence under plans/evidence.
- [x] Update the phase record, reference docs and changelog with verified behaviour and known limitations.
- [x] Review the staged diff and deliver the verified app-owned slice to main. Remaining phase tasks above stay open.

## Acceptance criteria

Run the affected desktop checks from apps/desktop: npm test, npm run lint and npm run build. For Rust changes, run cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings and cargo test --workspace from the root. Run node scripts/check-docs.mjs after documentation changes. A command that was not run is not a pass.

The package-specific failure cases above must have tests or a documented physical fixture. A helper test cannot replace a required process, device or application check.

## Live checks

- [ ] Use the configured shortcut to record and stop.
- [ ] Deny microphone access, cancel a recording and change focus before completion.

## Stop condition and rollback

Do not capture the user's live microphone merely to test setup. Physical audio checks require a visible initiated session. Keep a usable draft, preserve existing user content, cancel app-owned jobs and document the reduced capability if a path fails.

## Implementation record

### Current checkpoint: explicit spoken formatting

Starting at `6ab669d`, add the approved formatting subset for Word social-post drafting. This is a separate, initially unchecked session control beside Dictate, not a change to literal dictation. NL commands start with `opdracht`; EN commands start with `command`. The fixed list contains new paragraph, new line, comma, period, question mark and exclamation mark. Unknown commands remain literal. Nothing can send, delete existing text, save files or run an application.

- [ ] Write `tests/dictation.test.ts` before `src/shared/dictation.ts`, covering literal mode, NL/EN/auto, word boundaries, command-only paragraphs and unknown or destructive phrases.
- [ ] Add the visible opt-in control and bilingual examples to `Workspace.tsx` and `words.ts`. Snapshot the choice and language at recording start in `useWriting.ts`; disable changes during capture/transcription.
- [ ] Keep formatting inside the existing captured-range and Undo transaction. Record the raw transcript alongside a formatted result in session history when they differ.
- [ ] Add a fake-microphone Electron fixture with controlled transcript results. Verify literal default, explicit formatting, Undo, later text preservation and locked options during recording.
- [ ] Review resource cleanup and run unit tests, lint, build, real AI/Whisper regression, Word round-trip and documentation checks before the outcome commit.

Vocabulary hints remain pending: the installed Whisper CLI exposes prompt text only through a command-line argument, which is unsuitable for private vocabulary. Do not silently add such an argument. A future stdin or private-file interface requires its own provider change and tests. Physical Dutch recognition quality and direct Word insertion remain open.

2026-09-05: Installed pinned whisper.cpp b4938 Windows x64 and multilingual base with verified SHA-256 values. Added a repeatable `npm run setup:speech` script, a 115-second recording limit, WAV validation and private temporary-session cleanup. Dictation targets the app-owned selection captured at recording start; changed selections keep a transcript draft. External insertion, vocabulary hints and spoken commands remain open.

The integrated writer is ready for first-user feedback within this scope. The public JFK sample passed real CPU transcription in 1.4 seconds in one run. A real Electron fake-microphone test verified capture, insertion, track release and Undo. See [workflow evidence](../evidence/2026-09-05-dictation-workflow.md). Do not count this as a physical microphone test.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
