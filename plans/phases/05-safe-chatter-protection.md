# Phase 5: Typing protection and personal calibration

## Status

🔄 In progress. The first delivery covers visible calibration and the existing app-owned filter. Native hooks and physical acceptance remain pending.

## Outcome

A visible supported typing path uses levels 1 to 5 and accepted personal-key calibration.

## Why and scope

This phase implements the approved workflow in [the product register](../../docs/24-product-workflows.md). It owns the packages below. Later capabilities stay with their owning phase in [the delivery index](../README.md).

Planning size: One to three days for safe native integration and hardware checks. This is a work estimate, not a completion guarantee.

## Read first

- Read [07-input-pipeline](../../docs/07-input-pipeline.md).
- Read [18-chatter-protection](../../docs/18-chatter-protection.md).
- Read [28-profiles-style-and-vocabulary](../../docs/28-profiles-style-and-vocabulary.md).
- Read [the architecture](../../docs/06-architecture.md) and [the test strategy](../../docs/12-testing-strategy.md).

## Dependencies and decisions

Required prior capabilities: phases 3, 4. The maintainer's GO authorizes implementation and commits on main. Use documented defaults and ask only if a new choice changes scope or permissions. Microphone and screen access still require explicit user interaction in the app.

## Work packages

### Package 1: Visible calibration

- [ ] Create a calibration workspace component with synthetic prompts and event timing summaries.
- [ ] Test incomplete samples, deliberate repeated letters, modifier combinations and cancellation.
- [ ] Show per-key proposals and persist only an explicitly accepted summary.
- [ ] Keep raw key sequences out of history and diagnostics.

### Package 2: Protection integration

- [ ] Implement protected-context checks before connecting policy to a supported input path.
- [ ] Test key-down and key-up pairing, hold repeat, injected events and unknown metadata.
- [ ] Expose actual worker acknowledgement rather than showing the preference as active protection.
- [ ] Wire global pause and per-application exclusions to immediate preserve behaviour.

### Package 3: Compatibility and measurements

- [ ] Prove unsupported targets preserve every event with synthetic fixtures.
- [ ] Measure idle CPU and callback latency without content logging.
- [ ] Test process exit and hook teardown in the controlled fixture.
- [ ] Record sensitivity outcomes and real Windows results before changing public claims.

### Package 4: cleanup and delivery

- [ ] Review the changed files for duplicated state, dead code, resource leaks and missing boundary validation.
- [ ] Run affected tests after cleanup and retain actual red/green evidence under plans/evidence.
- [ ] Update the phase record, reference docs and changelog with verified behaviour and known limitations.
- [ ] Review the staged diff, commit this verified phase to main and push it to GitHub.

## Acceptance criteria

Run the affected desktop checks from apps/desktop: npm test, npm run lint and npm run build. For Rust changes, run cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings and cargo test --workspace from the root. Run node scripts/check-docs.mjs after documentation changes. A command that was not run is not a pass.

The package-specific failure cases above must have tests or a documented physical fixture. A helper test cannot replace a required process, device or application check.

## Live checks

- [ ] Type deliberate doubled words and rapid alternating keys.
- [ ] Pause while typing and confirm the active filter stops.

## Stop condition and rollback

Any lost key or stuck-key state blocks this phase. Disable the native path while retaining calibration evidence. Keep a usable draft, preserve existing user content, cancel app-owned jobs and document the reduced capability if a path fails.

## Implementation record

### Approved implementation checkpoint

Starting commit: `79d307a`. The maintainer asked to continue. Phase 3's pure policy and phase 4's target/process boundary are verified. Keep phase 2's physical scaling check separate.

Goal: let a user measure one problem key, label accidental and deliberate pairs, review a conservative proposal and explicitly accept or remove a per-key setting for the owned editor.

Decisions: no question changes the approved scope. Use the existing levels and millisecond windows. A focused calibration exercise captures two trusted, unmodified presses of one chosen letter. The user labels the interval; the app does not infer intent from ordinary writing. Raw timing samples remain in memory during that exercise and are discarded on cancel, unmount or a new key choice. Only accepted aggregate counts and a per-key level may be saved. A separate versioned storage key avoids rewriting existing preferences. The Rust calibration algorithm remains the proposal authority through a named, bounded main-process request.

Tasks:

1. Add failing tests for Shift, untrusted or unknown metadata in `tests/typing-filter.test.ts`, then tighten the app-owned filter without changing native input.
2. Add failing tests for pair capture, invalid intervals, held keys, cancellation and accepted-summary validation in `tests/calibration.test.ts`.
3. Extend `apps/input-worker` with a strict calibration request that calls the existing Rust summary function. Test that calibration does not start observation and that other operations reject its fields.
4. Add a named calibration IPC operation and exact reply validation in main and preload. It sends interval/intent pairs only, never typed text.
5. Add `CalibrationPanel.tsx` under Settings with NL/EN instructions, selected key, visible counts, review, accept, cancel and removal controls. Keep the capture area local to that mounted exercise.
6. Connect accepted per-key levels to `Workspace.tsx`. Keep profile exclusions, pause, IME and modifier preservation ahead of filtering.
7. Exercise the real rendered calibration panel, acceptance, cancellation, removal and denied samples. Rerun the existing target, phase-2 and writing/dictation checks.
8. Review bounds, privacy and resource cleanup, update phase/evidence/reference docs and commit and push this verified slice.

Out of scope for this slice: system-wide hooks, arbitrary external insertion, native callback latency claims and physical damaged-keyboard acceptance. The full phase stays open until those packages have their own evidence. A calibration proposal is not proof that a physical keyboard is safe to filter.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
