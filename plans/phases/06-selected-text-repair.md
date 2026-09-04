# Phase 6: Local repair and personal tone

## Status

⬜ Planned

## Outcome

The user can request local AI repair with Off, Suggest and Automatic semantics, style guidance and vocabulary.

## Why and scope

This phase implements the approved workflow in [the product register](../../docs/24-product-workflows.md). It owns the packages below. Later capabilities stay with their owning phase in [the delivery index](../README.md).

Planning size: One to two days including real local inference verification. This is a work estimate, not a completion guarantee.

## Read first

- Read [19-local-ai-repair](../../docs/19-local-ai-repair.md).
- Read [28-profiles-style-and-vocabulary](../../docs/28-profiles-style-and-vocabulary.md).
- Read [29-runtime-setup-and-scheduling](../../docs/29-runtime-setup-and-scheduling.md).
- Read [the architecture](../../docs/06-architecture.md) and [the test strategy](../../docs/12-testing-strategy.md).

## Dependencies and decisions

Required prior capabilities: phases 2, 4. The maintainer's GO authorizes implementation and commits on main. Use documented defaults and ask only if a new choice changes scope or permissions. Microphone and screen access still require explicit user interaction in the app.

## Work packages

### Package 1: Provider boundary

- [ ] Write tests for local endpoint validation, cloud-backed entries, timeout and invalid output in tests/repair-provider.test.ts.
- [ ] Create src/main/repair-provider.ts using bounded local requests with AbortSignal.
- [ ] Discover installed local resources and expose unavailable state with setup guidance.
- [ ] Send text as structured request data and keep it out of URLs, process arguments and logs.

### Package 2: Repair contract

- [ ] Create src/shared/repair.ts with bounded request and response validation.
- [ ] Apply profile guards for formulas, code, links and approved vocabulary.
- [ ] Include editable style guidance while treating document instructions as untrusted input.
- [ ] Test mode Off, ignored proposals, oversized response and empty replacement.

### Package 3: User path

- [ ] Connect Workspace selection to request, waiting, proposal, Accept and Ignore states.
- [ ] Cancel pending work when mode changes, target closes or selection ownership is lost.
- [ ] Use a controlled local inference fixture to measure a real repair in Dutch and English.
- [ ] Record latency and output quality without claiming every suggestion is correct.

### Package 4: cleanup and delivery

- [ ] Review the changed files for duplicated state, dead code, resource leaks and missing boundary validation.
- [ ] Run affected tests after cleanup and retain actual red/green evidence under plans/evidence.
- [ ] Update the phase record, reference docs and changelog with verified behaviour and known limitations.
- [ ] Review the staged diff, commit this verified phase to main and push it to GitHub.

## Acceptance criteria

Run the affected desktop checks from apps/desktop: npm test, npm run lint and npm run build. For Rust changes, run cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings and cargo test --workspace from the root. Run node scripts/check-docs.mjs after documentation changes. A command that was not run is not a pass.

The package-specific failure cases above must have tests or a documented physical fixture. A helper test cannot replace a required process, device or application check.

## Live checks

- [ ] Repair synthetic damaged Dutch and English prose with the installed local runtime.
- [ ] Stop the runtime mid-request and verify original text remains.

## Stop condition and rollback

Never accept a localhost cloud proxy as local processing or apply output outside a validated range. Keep a usable draft, preserve existing user content, cancel app-owned jobs and document the reduced capability if a path fails.

## Implementation record

Implementation of this revised phase has not yet been verified.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
