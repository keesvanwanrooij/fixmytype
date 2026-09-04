# Phase 13: First-user acceptance and public release gate

## Status

⬜ Planned

## Outcome

The maintainer can test the intended daily workflows and a public release is published only with verified acceptance.

## Why and scope

This phase implements the approved workflow in [the product register](../../docs/24-product-workflows.md). It owns the packages below. Later capabilities stay with their owning phase in [the delivery index](../README.md).

Planning size: Half a day for release work plus the actual feedback and fix cycle. This is a work estimate, not a completion guarantee.

## Read first

- Read [30-first-user-test](../../docs/30-first-user-test.md).
- Read [22-donations-and-sustainability](../../docs/22-donations-and-sustainability.md).
- Read [11-windows-compatibility](../../docs/11-windows-compatibility.md).
- Read [the architecture](../../docs/06-architecture.md) and [the test strategy](../../docs/12-testing-strategy.md).

## Dependencies and decisions

Required prior capabilities: phases 12. The maintainer's GO authorizes implementation and commits on main. Use documented defaults and ask only if a new choice changes scope or permissions. Microphone and screen access still require explicit user interaction in the app.

## Work packages

### Package 1: First-user session

- [ ] Run docs/30-first-user-test.md with a candidate checksum and source commit.
- [ ] Capture synthetic reproductions for feedback on typing, AI delay, speech and companion behaviour.
- [ ] Triage text loss, privacy, startup and installation defects first.
- [ ] Use tests first for each fix and rerun the affected daily workflow.

### Package 2: Release review

- [ ] Verify every required matrix row, CI job, package result and critical issue disposition.
- [ ] Update README.md and CHANGELOG.md with actual available and excluded capabilities.
- [ ] Inspect dependency alerts, license notices, repository status and public links.
- [ ] Record unresolved noncritical issues with scope and user-visible consequence.

### Package 3: Publication and support

- [ ] Confirm the maintainer's candidate acceptance before describing the app as accepted.
- [ ] Create an annotated version tag only for the verified release commit.
- [ ] Publish the installer, checksums, release notes and first-run instructions together.
- [ ] Verify download, checksum, installation and donation routes from published assets.

### Package 4: cleanup and delivery

- [ ] Review the changed files for duplicated state, dead code, resource leaks and missing boundary validation.
- [ ] Run affected tests after cleanup and retain actual red/green evidence under plans/evidence.
- [ ] Update the phase record, reference docs and changelog with verified behaviour and known limitations.
- [ ] Review the staged diff, commit this verified phase to main and push it to GitHub.

## Acceptance criteria

Run the affected desktop checks from apps/desktop: npm test, npm run lint and npm run build. For Rust changes, run cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings and cargo test --workspace from the root. Run node scripts/check-docs.mjs after documentation changes. A command that was not run is not a pass.

The package-specific failure cases above must have tests or a documented physical fixture. A helper test cannot replace a required process, device or application check.

## Live checks

- [ ] The maintainer performs the daily workflow acceptance on the packaged candidate.

## Stop condition and rollback

This final user acceptance cannot be inferred from automated checks or a prior startup confirmation. Keep a usable draft, preserve existing user content, cancel app-owned jobs and document the reduced capability if a path fails.

## Implementation record

Implementation of this revised phase has not yet been verified.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
