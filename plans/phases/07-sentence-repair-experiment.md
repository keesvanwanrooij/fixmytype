# Phase 7: Concurrent sentence repair, history and Undo

## Status

🔄 In progress. The app-owned transaction path passes unit and live concurrency checks. History export, broader retention controls and external adapters remain open.

## Outcome

Earlier sentences can be repaired in a supported editor while later typing continues, with guarded Undo.

## Why and scope

This phase implements the approved workflow in [the product register](../../docs/24-product-workflows.md). It owns the packages below. Later capabilities stay with their owning phase in [the delivery index](../README.md).

Planning size: One to three days for revision semantics and real editor integration. This is a work estimate, not a completion guarantee.

## Read first

- Read [25-revision-and-undo](../../docs/25-revision-and-undo.md).
- Read [09-privacy-and-data-handling](../../docs/09-privacy-and-data-handling.md).
- Read [13-test-cases-and-safety-invariants](../../docs/13-test-cases-and-safety-invariants.md).
- Read [the architecture](../../docs/06-architecture.md) and [the test strategy](../../docs/12-testing-strategy.md).

## Dependencies and decisions

Required prior capabilities: phases 6. The maintainer's GO authorizes implementation and commits on main. Use documented defaults and ask only if a new choice changes scope or permissions. Microphone and screen access still require explicit user interaction in the app.

## Work packages

### Package 1: Revision engine

- [x] Write delayed-result and overlap tests before implementing `src/shared/document-buffer.ts`.
- [x] Track range identity through insertion, replacement and deletion without searching by matching text.
- [x] Reject split Unicode boundaries, repeated apply and foreign document anchors.
- [x] Transform pending ranges on every manual edit and committed replacement.

### Package 2: Asynchronous pipeline

- [x] Detect completed sentences without sending every keystroke to inference.
- [ ] Keep a bounded queue keyed by document and range; cancel superseded requests.
- [x] Apply Automatic results only through the validated transaction path.
- [x] Test two identical sentences, reversed completion order and three later appended sentences.

### Package 3: History and Undo

- [x] Create session history with operation type, original, replacement and tracked Undo range.
- [x] Make Undo preserve later typing and reject edits inside the replacement.
- [ ] Offer explicit bounded retention, clear and export controls; never mix content with diagnostics.
- [x] Verify the live editor selection and caret survive an older-sentence replacement.

### Package 4: cleanup and delivery

- [ ] Review the changed files for duplicated state, dead code, resource leaks and missing boundary validation.
- [ ] Run affected tests after cleanup and retain actual red/green evidence under plans/evidence.
- [ ] Update the phase record, reference docs and changelog with verified behaviour and known limitations.
- [ ] Review the staged diff, commit this verified phase to main and push it to GitHub.

## Acceptance criteria

Run the affected desktop checks from apps/desktop: npm test, npm run lint and npm run build. For Rust changes, run cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings and cargo test --workspace from the root. Run node scripts/check-docs.mjs after documentation changes. A command that was not run is not a pass.

The package-specific failure cases above must have tests or a documented physical fixture. A helper test cannot replace a required process, device or application check.

## Live checks

- [ ] Type three sentences while a deliberately delayed repair is running.
- [ ] Edit the original passage, then verify rejection and safe Undo.

## Stop condition and rollback

If the target cannot compare and replace atomically, expose Suggest only and document the limitation. Keep a usable draft, preserve existing user content, cancel app-owned jobs and document the reduced capability if a path fails.

## Implementation record

### Current checkpoint: optional draft retention

Starting at `1843ec0`, add an explicit Settings control to remember only the current draft across restarts. It is off by default. Existing approval covers local retention with consent; it does not authorize retaining history, recordings or clipboard data. Storage uses a separate versioned local record, not a preference migration. State plainly that the record is not encrypted by FixMyType.

- [ ] Write `tests/draft-storage.test.ts` before `src/shared/draft-storage.ts`. Cover default-off, exact schema, Unicode, 100,000-character limit, unreadable records and denied writes/deletion.
- [ ] Add `useDraftRetention.ts` for debounced writes and a final flush on normal close/hide. No storage write occurs without explicit prior consent. A force-kill can lose the last pending edit.
- [ ] Add `DraftRetentionPanel.tsx` to Settings and initialize `useWriting.ts` from a validated saved draft. Keep invalid bytes untouched until an explicit removal action.
- [ ] Disabling stops new saves immediately and attempts deletion. If deletion fails, say that the older record still exists and may return on restart; provide Retry removal. Do not claim secure erasure or successful revocation persistence when storage denied it.
- [ ] Show saving/error feedback beside the draft. Removing retained data keeps the open editor text. History and Undo remain session-only.
- [ ] Add `scripts/draft-check.mjs` and its real Electron fixture for default-off, enable, separate-process restore, disable/removal and a clean next restart. Add controlled storage failures without weakening the expected result.
- [ ] Run unit, lint, build, restart checks and existing workflow checks. Review cleanup, update docs and plans, then commit and push.

This is draft retention, not completion of the full history-retention/export package. External adapters and physical acceptance remain open.

2026-09-05: `src/shared/document-buffer.ts` passes tests for delayed correction with four later sentences, duplicate text ranges, stale results, Unicode boundaries and Undo after continued typing. `useWriting.ts` connects the editor, bounded session history and suggestions. External application adapters remain outside this verified path.

The Electron workflow check also caught a starvation bug: later typing restarted the earlier sentence's timer. The revised scheduler keys its timer to completed text and passes continuous-typing verification. The history is session-only and capped at 50 entries. See [transaction evidence](../evidence/2026-09-05-transactions.md).

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
