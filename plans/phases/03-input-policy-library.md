# Phase 3: Preserve-first input policy

## Status

🔄 In progress. The implementation scope is locked by the maintainer's instruction to continue.

## Outcome

The Rust library handles unknown metadata conservatively and exposes tested sensitivity and calibration contracts.

## Why and scope

This phase implements the approved workflow in [the product register](../../docs/24-product-workflows.md). It owns the packages below. Later capabilities stay with their owning phase in [the delivery index](../README.md).

Planning size: Half a day to one day for policy hardening and calibration contracts. This is a work estimate, not a completion guarantee.

## Read first

- Read [02-user-problem-and-safety](../../docs/02-user-problem-and-safety.md).
- Read [18-chatter-protection](../../docs/18-chatter-protection.md).
- Read [23-input-core-api](../../docs/23-input-core-api.md).
- Read [the architecture](../../docs/06-architecture.md) and [the test strategy](../../docs/12-testing-strategy.md).

## Dependencies and decisions

Required prior capabilities: phases 1. The maintainer's GO authorizes implementation and commits on main. Use documented defaults and ask only if a new choice changes scope or permissions. Microphone and screen access still require explicit user interaction in the app.

## Work packages

### Package 1: Regression audit

- [ ] Write failing tests for unknown modifier bits in crates/input-core/tests/policy_classification.rs.
- [ ] Add equal timestamp, zero window, clock reset and key-up baseline tests.
- [ ] Replace the return-enum-only property assertion with preservation invariants and a fixed seed.
- [ ] Audit the public event type and avoid claiming numeric key codes are safe to log.

### Package 2: Policy and calibration

- [ ] Preserve unknown modifier bits in src/event.rs and treat any unknown state as non-filterable.
- [ ] Make invalid timing and disabled windows preserve input in src/policy.rs.
- [ ] Add a bounded sensitivity type and explicit caller-provided timing table without a hidden hardware default.
- [ ] Add pure calibration summaries that propose settings only after enough visible samples.

### Package 3: Quality and API evidence

- [ ] Document key hold versus switch chatter and the caller's key-lifetime responsibilities.
- [ ] Test each sensitivity boundary and deliberate double-letter fixtures.
- [ ] Run formatting, Clippy, deterministic property cases and normal-dependency inspection.
- [ ] Update docs/23-input-core-api.md and record exact Windows commands.

### Package 4: cleanup and delivery

- [ ] Review the changed files for duplicated state, dead code, resource leaks and missing boundary validation.
- [ ] Run affected tests after cleanup and retain actual red/green evidence under plans/evidence.
- [ ] Update the phase record, reference docs and changelog with verified behaviour and known limitations.
- [ ] Review the staged diff, commit this verified phase to main and push it to GitHub.

## Acceptance criteria

Run the affected desktop checks from apps/desktop: npm test, npm run lint and npm run build. For Rust changes, run cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings and cargo test --workspace from the root. Run node scripts/check-docs.mjs after documentation changes. A command that was not run is not a pass.

The package-specific failure cases above must have tests or a documented physical fixture. A helper test cannot replace a required process, device or application check.

## Live checks

- [ ] Run the crate checks from a clean Windows checkout without native input privileges.

## Stop condition and rollback

The classifier is advice. It must not gain a hook or suppression side effect. Keep a usable draft, preserve existing user content, cancel app-owned jobs and document the reduced capability if a path fails.

## Implementation record

### Starting checkpoint

The crate has eight tests, masks unknown modifier bits and labels event metadata as content-free. This package will preserve all modifier bits, reject equal/reversed/disabled timing, add sensitivity levels 1-5 with an explicit monotonic timing table and summarize explicitly labelled calibration intervals. Calibration requires at least ten accidental and ten deliberate examples, caps input at 1,000 samples, and refuses overlapping groups. These are safety gates for a proposal, not a learned hardware default or permission to suppress input.

Files: `src/event.rs`, `src/policy.rs`, new `src/calibration.rs`, public exports, Rust integration tests, the crate README and docs/23-input-core-api.md. There is no hook, logging, OS setting change, device recording or desktop behavior change in this phase. Evidence will include fixed-seed generated preservation tests, boundary fixtures and a clean Windows worktree check. Commit this checkpoint before writing implementation, then commit and push the verified result.

Commit 4c39473 added the initial Rust crate and eight tests. This expanded audit reopens completion because unknown modifier bits are discarded and generated tests did not prove sufficient safety invariants.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
