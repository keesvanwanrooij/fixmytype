# Phase 7: Concurrent sentence repair, history and Undo

## Status

⬜ Planned

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

- [ ] Write delayed-result and overlap tests before src/shared/revisions.ts.
- [ ] Track range identity through insertion, replacement and deletion without searching by matching text.
- [ ] Reject split Unicode boundaries, repeated apply and foreign document IDs.
- [ ] Transform pending ranges on every manual edit and committed replacement.

### Package 2: Asynchronous pipeline

- [ ] Detect completed sentences without sending every keystroke to inference.
- [ ] Keep a bounded queue keyed by document and range; cancel superseded requests.
- [ ] Apply Automatic results only through the validated transaction path.
- [ ] Test two identical sentences, reversed completion order and three later appended sentences.

### Package 3: History and Undo

- [ ] Create session history with operation type, original, replacement and tracked Undo range.
- [ ] Make Undo preserve later typing and reject edits inside the replacement.
- [ ] Offer explicit bounded retention, clear and export controls; never mix content with diagnostics.
- [ ] Verify the live editor selection and caret survive an older-sentence replacement.

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

Implementation of this revised phase has not yet been verified.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
