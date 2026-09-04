# Phase 4: Target capabilities and native lifecycle

## Status

⬜ Planned

## Outcome

The app identifies a chosen target and exposes only editing capabilities proven for its field type.

## Why and scope

This phase implements the approved workflow in [the product register](../../docs/24-product-workflows.md). It owns the packages below. Later capabilities stay with their owning phase in [the delivery index](../README.md).

Planning size: One to three days including Windows API investigation. This is a work estimate, not a completion guarantee.

## Read first

- Read [06-architecture](../../docs/06-architecture.md).
- Read [08-electron-security](../../docs/08-electron-security.md).
- Read [11-windows-compatibility](../../docs/11-windows-compatibility.md).
- Read [the architecture](../../docs/06-architecture.md) and [the test strategy](../../docs/12-testing-strategy.md).

## Dependencies and decisions

Required prior capabilities: phases 2, 3. The maintainer's GO authorizes implementation and commits on main. Use documented defaults and ask only if a new choice changes scope or permissions. Microphone and screen access still require explicit user interaction in the app.

## Work packages

### Package 1: Target contract

- [ ] Create src/shared/target.ts with target ID, document identity, capabilities and consent epoch.
- [ ] Test stale target, password, read-only, elevated and unknown contexts before adapter implementation.
- [ ] Implement the app-owned editor adapter first and a capability result for unsupported external controls.
- [ ] Document candidate Windows APIs and their read versus write limits in plans/evidence/04-targets.md.

### Package 2: Native process boundary

- [ ] Create apps/input-worker with bounded versioned request and response messages.
- [ ] Validate unknown fields, protocol version, oversized messages and repeated start or stop.
- [ ] Keep target discovery out of timing-critical keyboard callbacks.
- [ ] Implement cancellation and shutdown that release all app-owned native resources.

### Package 3: Windows evidence

- [ ] Build a controlled Windows fixture with plain, password and read-only fields.
- [ ] Prove target changes invalidate operations before adding any insertion path.
- [ ] Test worker crash, restart, no active target and Electron quit.
- [ ] Record browser, Word, Excel and terminal capabilities honestly in the compatibility matrix.

### Package 4: cleanup and delivery

- [ ] Review the changed files for duplicated state, dead code, resource leaks and missing boundary validation.
- [ ] Run affected tests after cleanup and retain actual red/green evidence under plans/evidence.
- [ ] Update the phase record, reference docs and changelog with verified behaviour and known limitations.
- [ ] Review the staged diff, commit this verified phase to main and push it to GitHub.

## Acceptance criteria

Run the affected desktop checks from apps/desktop: npm test, npm run lint and npm run build. For Rust changes, run cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings and cargo test --workspace from the root. Run node scripts/check-docs.mjs after documentation changes. A command that was not run is not a pass.

The package-specific failure cases above must have tests or a documented physical fixture. A helper test cannot replace a required process, device or application check.

## Live checks

- [ ] Run the controlled target fixture and verify denied targets.
- [ ] Change focus while a request waits and confirm no mutation.

## Stop condition and rollback

UI Automation TextPattern alone cannot safely write historical ranges. Unsupported writes must remain drafts. Keep a usable draft, preserve existing user content, cancel app-owned jobs and document the reduced capability if a path fails.

## Implementation record

Implementation of this revised phase has not yet been verified.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
