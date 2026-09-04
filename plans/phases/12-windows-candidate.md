# Phase 12: Windows package and first-user candidate

## Status

⬜ Planned

## Outcome

The maintainer receives an installable, checksummed candidate with setup and rollback instructions.

## Why and scope

This phase implements the approved workflow in [the product register](../../docs/24-product-workflows.md). It owns the packages below. Later capabilities stay with their owning phase in [the delivery index](../README.md).

Planning size: One to two days including clean-install validation. This is a work estimate, not a completion guarantee.

## Read first

- Read [16-installation](../../docs/16-installation.md).
- Read [20-troubleshooting](../../docs/20-troubleshooting.md).
- Read [30-first-user-test](../../docs/30-first-user-test.md).
- Read [the architecture](../../docs/06-architecture.md) and [the test strategy](../../docs/12-testing-strategy.md).

## Dependencies and decisions

Required prior capabilities: phases 11. The maintainer's GO authorizes implementation and commits on main. Use documented defaults and ask only if a new choice changes scope or permissions. Microphone and screen access still require explicit user interaction in the app.

## Work packages

### Package 1: Package contract

- [ ] Define one version source, per-user install scope, binary names and local data paths.
- [ ] Create packaging configuration that includes required native workers and excludes local profiles.
- [ ] Test missing input artifacts, version mismatch and package content inventory.
- [ ] Build from the verified source commit and generate SHA-256 checksums.

### Package 2: Install lifecycle

- [ ] Test install, first start, Settings persistence, tray quit and runtime discovery.
- [ ] Upgrade a prior candidate while preserving valid preferences.
- [ ] Test uninstall and explicitly document retained history or runtime files.
- [ ] Test rollback with compatible preference migration or a visible unsupported-state message.

### Package 3: Tester kit

- [ ] Write candidate notes with actual capabilities, exclusions and honest signing status.
- [ ] Attach the first-user script, checksums and support route.
- [ ] Record critical bug disposition and rerun their exact regression paths.
- [ ] Commit and push the candidate evidence before handing it to the maintainer.

### Package 4: cleanup and delivery

- [ ] Review the changed files for duplicated state, dead code, resource leaks and missing boundary validation.
- [ ] Run affected tests after cleanup and retain actual red/green evidence under plans/evidence.
- [ ] Update the phase record, reference docs and changelog with verified behaviour and known limitations.
- [ ] Review the staged diff, commit this verified phase to main and push it to GitHub.

## Acceptance criteria

Run the affected desktop checks from apps/desktop: npm test, npm run lint and npm run build. For Rust changes, run cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings and cargo test --workspace from the root. Run node scripts/check-docs.mjs after documentation changes. A command that was not run is not a pass.

The package-specific failure cases above must have tests or a documented physical fixture. A helper test cannot replace a required process, device or application check.

## Live checks

- [ ] Install, upgrade and uninstall in a clean Windows profile or VM.
- [ ] Verify the checksum and the first-run setup path.

## Stop condition and rollback

Do not promise signing without a verified certificate. A package build alone is not installation evidence. Keep a usable draft, preserve existing user content, cancel app-owned jobs and document the reduced capability if a path fails.

## Implementation record

Implementation of this revised phase has not yet been verified.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
