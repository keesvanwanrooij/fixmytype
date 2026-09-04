# Phase 8: Dictation, vocabulary and spoken commands

## Status

⬜ Planned

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
- [ ] Create renderer capture code with explicit microphone permission and track cleanup.
- [ ] Snapshot the intended target at recording start and invalidate it on target changes.
- [ ] Bound audio memory and serialize local recognizer requests.

### Package 2: Local transcription

- [ ] Create src/main/transcription.ts with a configured Whisper-compatible executable and local resources.
- [ ] Pass audio through app-owned temporary files, with cleanup on success, error and startup recovery.
- [ ] Test missing executable, corrupt audio, timeout, empty result and cancellation.
- [ ] Transcribe a synthetic English fixture and an explicit Dutch test fixture; record expected output.

### Package 3: Commands and insertion

- [ ] Feed approved vocabulary into the recognition path where supported.
- [ ] Separate command mode from literal dictation and start with punctuation or formatting commands.
- [ ] Add the result to session history and insert only through the validated target adapter.
- [ ] Retain a draft if target identity changes or safe insertion is unsupported.

### Package 4: cleanup and delivery

- [ ] Review the changed files for duplicated state, dead code, resource leaks and missing boundary validation.
- [ ] Run affected tests after cleanup and retain actual red/green evidence under plans/evidence.
- [ ] Update the phase record, reference docs and changelog with verified behaviour and known limitations.
- [ ] Review the staged diff, commit this verified phase to main and push it to GitHub.

## Acceptance criteria

Run the affected desktop checks from apps/desktop: npm test, npm run lint and npm run build. For Rust changes, run cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings and cargo test --workspace from the root. Run node scripts/check-docs.mjs after documentation changes. A command that was not run is not a pass.

The package-specific failure cases above must have tests or a documented physical fixture. A helper test cannot replace a required process, device or application check.

## Live checks

- [ ] Use the configured shortcut to record and stop.
- [ ] Deny microphone access, cancel a recording and change focus before completion.

## Stop condition and rollback

Do not capture the user's live microphone merely to test setup. Physical audio checks require a visible initiated session. Keep a usable draft, preserve existing user content, cancel app-owned jobs and document the reduced capability if a path fails.

## Implementation record

Implementation of this revised phase has not yet been verified.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
