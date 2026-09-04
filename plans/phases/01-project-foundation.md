# Phase 1: Project foundation

## Status

✅ Complete

## Outcome

The public repository, English documentation and contributor workflow reflect the approved typing and voice product.

## Why and scope

This phase implements the approved workflow in [the product register](../../docs/24-product-workflows.md). It owns the packages below. Later capabilities stay with their owning phase in [the delivery index](../README.md).

Planning size: Half a day for an initial foundation; this revision updates the existing foundation. This is a work estimate, not a completion guarantee.

## Read first

- Read [01-product-vision](../../docs/01-product-vision.md).
- Read [03-scope-and-non-goals](../../docs/03-scope-and-non-goals.md).
- Read [04-decision-log](../../docs/04-decision-log.md).
- Read [the architecture](../../docs/06-architecture.md) and [the test strategy](../../docs/12-testing-strategy.md).

## Dependencies and decisions

The maintainer approved the product scope and all ten additions on 2026-09-05. The maintainer's GO authorizes implementation and commits on main. Use documented defaults and ask only if a new choice changes scope or permissions. Microphone and screen access still require explicit user interaction in the app.

## Work packages

### Package 1: Repository and navigation

- [x] Preserve Apache-2.0, NOTICE and trademark ownership in the root files.
- [x] Move planning/ to plans/ and update AGENTS.md, CLAUDE.md and llms.txt links.
- [x] Rewrite README.md around verified current state and the approved first-user goal.
- [x] Index all 30 numbered reference documents in docs/README.md.

### Package 2: Scope and work order

- [x] Map all ten accepted ideas to docs/24-product-workflows.md.
- [x] Write 13 outcome-based plans in plans/phases with named files and tests.
- [x] Correct inferred Windows evidence in the prior Settings completion record.
- [x] Record build-loop, cleanup and optimization responsibilities in CLAUDE.md.

### Package 3: Verification and handoff

- [x] Add a repository navigation check under scripts/ that excludes dependency folders.
- [x] Check every local Markdown destination and consecutive phase number.
- [x] Review public copy for unsupported feature claims and remove stale voice exclusions.
- [x] Document phase status and known gaps in plans/README.md.

### Package 4: cleanup and delivery

- [x] Review the changed files for duplicated state, dead code, resource leaks and missing boundary validation.
- [x] Run affected tests after cleanup and retain actual red/green evidence under plans/evidence.
- [x] Update the phase record, reference docs and changelog with verified behaviour and known limitations.
- [x] Review the staged diff, commit this verified phase to main and push it to GitHub.

## Acceptance criteria

Run the affected desktop checks from apps/desktop: npm test, npm run lint and npm run build. For Rust changes, run cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings and cargo test --workspace from the root. Run node scripts/check-docs.mjs after documentation changes. A command that was not run is not a pass.

The package-specific failure cases above must have tests or a documented physical fixture. A helper test cannot replace a required process, device or application check.

## Live checks

- [x] Open the root README and reach every phase and document through links.

## Stop condition and rollback

Do not treat documentation completeness as application readiness. Keep a usable draft, preserve existing user content, cancel app-owned jobs and document the reduced capability if a path fails.

## Implementation record

The original repository and shell exist at commit 8e31916. This revision consolidates the expanded vision and corrects overstated historical acceptance.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).

2026-09-05 evidence: node scripts/check-docs.mjs passed for 67 Markdown files and consecutive phases 01 through 13. All ten ideas have owners in docs/24-product-workflows.md. The former keyboard, locale and scaling confirmations were withdrawn in phase 2. The public README now distinguishes the existing shell from planned capabilities. The review preserved the unrelated root package-lock.json.
