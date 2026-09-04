# Phase 11: Compatibility, accessibility and measured reliability

## Status

⬜ Planned

## Outcome

The supported-context matrix has actual results and resource measurements with reproducible regressions.

## Why and scope

This phase implements the approved workflow in [the product register](../../docs/24-product-workflows.md). It owns the packages below. Later capabilities stay with their owning phase in [the delivery index](../README.md).

Planning size: Two to four days across physical Windows checks and regressions. This is a work estimate, not a completion guarantee.

## Read first

- Read [11-windows-compatibility](../../docs/11-windows-compatibility.md).
- Read [05-accessibility-principles](../../docs/05-accessibility-principles.md).
- Read [30-first-user-test](../../docs/30-first-user-test.md).
- Read [the architecture](../../docs/06-architecture.md) and [the test strategy](../../docs/12-testing-strategy.md).

## Dependencies and decisions

Required prior capabilities: phases 5, 7, 8, 9, 10. The maintainer's GO authorizes implementation and commits on main. Use documented defaults and ask only if a new choice changes scope or permissions. Microphone and screen access still require explicit user interaction in the app.

## Work packages

### Package 1: Target matrix

- [ ] Create plans/evidence/11-compatibility.md with versioned target and field rows.
- [ ] Run browser prompts, Word prose, Excel prose and code tool fixtures separately.
- [ ] Record formulas, passwords, elevated apps and terminals as explicit supported or excluded cases.
- [ ] Open a bug-fix record for each reproducible failure before implementation changes.

### Package 2: Accessibility

- [ ] Verify keyboard-only operation and focus restoration in both interface languages.
- [ ] Test Windows scaling at 100, 150 and 200 percent plus high contrast.
- [ ] Check an installed screen reader for state announcements without repeated interruption.
- [ ] Verify companion hidden mode and all shortcut replacements.

### Package 3: Reliability and optimization

- [ ] Measure startup, idle CPU, memory, typing latency and cold or warm local inference.
- [ ] Test service exit, repeated crash, disk full, malformed storage and offline operation.
- [ ] Bound local diagnostics and verify that no user text or audio appears in reports.
- [ ] Optimize only measured bottlenecks and record before/after evidence in plans/optimizations.

### Package 4: cleanup and delivery

- [ ] Review the changed files for duplicated state, dead code, resource leaks and missing boundary validation.
- [ ] Run affected tests after cleanup and retain actual red/green evidence under plans/evidence.
- [ ] Update the phase record, reference docs and changelog with verified behaviour and known limitations.
- [ ] Review the staged diff, commit this verified phase to main and push it to GitHub.

## Acceptance criteria

Run the affected desktop checks from apps/desktop: npm test, npm run lint and npm run build. For Rust changes, run cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings and cargo test --workspace from the root. Run node scripts/check-docs.mjs after documentation changes. A command that was not run is not a pass.

The package-specific failure cases above must have tests or a documented physical fixture. A helper test cannot replace a required process, device or application check.

## Live checks

- [ ] Run the exact first-user script against the candidate build.
- [ ] Keep unavailable physical checks explicitly pending.

## Stop condition and rollback

An untested matrix row cannot be converted into a supported claim. Text loss or privacy defects block promotion. Keep a usable draft, preserve existing user content, cancel app-owned jobs and document the reduced capability if a path fails.

## Implementation record

Implementation of this revised phase has not yet been verified.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
