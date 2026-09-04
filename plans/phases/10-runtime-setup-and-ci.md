# Phase 10: Guided setup, resource scheduling and CI

## Status

⬜ Planned

## Outcome

The app discovers local resources, installs verified optional components and runs repeatable quality gates.

## Why and scope

This phase implements the approved workflow in [the product register](../../docs/24-product-workflows.md). It owns the packages below. Later capabilities stay with their owning phase in [the delivery index](../README.md).

Planning size: One to three days for setup, concurrency and CI evidence. This is a work estimate, not a completion guarantee.

## Read first

- Read [29-runtime-setup-and-scheduling](../../docs/29-runtime-setup-and-scheduling.md).
- Read [08-electron-security](../../docs/08-electron-security.md).
- Read [14-development-workflow](../../docs/14-development-workflow.md).
- Read [the architecture](../../docs/06-architecture.md) and [the test strategy](../../docs/12-testing-strategy.md).

## Dependencies and decisions

Required prior capabilities: phases 6, 8, 9. The maintainer's GO authorizes implementation and commits on main. Use documented defaults and ask only if a new choice changes scope or permissions. Microphone and screen access still require explicit user interaction in the app.

## Work packages

### Package 1: Guided resources

- [ ] Build a setup screen with component version, readiness, disk use and download progress.
- [ ] Pin optional artifacts and checksums; reject invalid archive paths and partial publication.
- [ ] Test retry, checksum mismatch, cancellation and preservation of a prior working install.
- [ ] Keep external downloads separate from local content processing.

### Package 2: Resource scheduling

- [ ] Create a bounded scheduler with explicit dictation above background narration.
- [ ] Cancel work by owner and operation ID, including work still waiting.
- [ ] Test capacity, starvation protection, superseded repairs and worker failure.
- [ ] Measure simultaneous typing, transcription and narration on the documented baseline PC.

### Package 3: CI and supply chain

- [ ] Create .github/workflows/ci.yml with Windows desktop and Rust checks.
- [ ] Run locked dependency installs, test reports, build checks and documentation validation.
- [ ] Pin action references, inspect runtime licenses and audit dependencies.
- [ ] Prove an intentional test failure fails the workflow and publish only content-free artifacts.

### Package 4: cleanup and delivery

- [ ] Review the changed files for duplicated state, dead code, resource leaks and missing boundary validation.
- [ ] Run affected tests after cleanup and retain actual red/green evidence under plans/evidence.
- [ ] Update the phase record, reference docs and changelog with verified behaviour and known limitations.
- [ ] Review the staged diff, commit this verified phase to main and push it to GitHub.

## Acceptance criteria

Run the affected desktop checks from apps/desktop: npm test, npm run lint and npm run build. For Rust changes, run cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings and cargo test --workspace from the root. Run node scripts/check-docs.mjs after documentation changes. A command that was not run is not a pass.

The package-specific failure cases above must have tests or a documented physical fixture. A helper test cannot replace a required process, device or application check.

## Live checks

- [ ] Cancel a resource installation and verify the previous setup still works.
- [ ] Run a clean Windows CI build from the phase commit.

## Stop condition and rollback

A missing external artifact or checksum blocks installation of that component, not ordinary typing. Keep a usable draft, preserve existing user content, cancel app-owned jobs and document the reduced capability if a path fails.

## Implementation record

Implementation of this revised phase has not yet been verified.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
