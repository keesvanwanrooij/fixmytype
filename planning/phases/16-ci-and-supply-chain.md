# Phase 16: CI and supply chain

## Status

Planned

## Outcome

GitHub runs the same repeatable Windows, Electron, Rust, dependency, secret, and documentation gates that a release requires. A failed security or test gate blocks promotion.

## User value

People can inspect how a change was checked before installing it. Maintainers receive early warning when a dependency or build path becomes unsafe.

## Read first

- [Testing strategy](../../docs/12-testing-strategy.md)
- [Development workflow](../../docs/14-development-workflow.md)
- [Security policy](../../SECURITY.md)
- [Contributing guide](../../CONTRIBUTING.md)

## Scope

Create pinned GitHub workflows, Windows runner checks, Node and Rust toolchain policy, formatting, lint, tests, build, dependency audit, license review, secret scan, result artifacts, and branch or release protection guidance.

## Non-goals

No automatic public release, no automatic dependency merge without review, no cloud telemetry, and no secret or installer signing value stored in the repository. Phase 17 owns installer creation.

## Dependencies and handoff

| Depends on | Why it must exist first |
|---|---|
| Phases 7 to 15 | They define the commands, platform paths, privacy tests, and matrix evidence to automate. |

| Unblocks | What this phase makes possible |
|---|---|
| Phase 17 | Packaging runs from a known checked source state. |
| Phase 18 | Beta candidates have repeatable proof before testers receive them. |

## Decisions required at phase start

Confirm the GitHub branch-protection policy and artifact retention period with the maintainer. The workflow must not create a release or publish a package without a separate deliberate action.

## Work packages

### Package 1: reproduce local gates on Windows

- [ ] Create `.github/workflows/ci.yml` using a pinned Windows runner and pinned Node and Rust versions.
- [ ] Run `npm ci`, Electron lint, typecheck, tests, build, Cargo formatting, Clippy, and Cargo tests.
- [ ] Fail on warnings where the local command does.
- [ ] Add a workflow test or controlled invalid fixture proving a failing command fails the job.

### Package 2: dependency and source checks

- [ ] Run production dependency audit and record the supported severity threshold.
- [ ] Add a license inventory or allowlist that rejects an unreviewed license change.
- [ ] Add secret scanning and a safe test fixture proving it detects a synthetic credential pattern without committing a usable credential.
- [ ] Record how Dependabot alerts are reviewed, upgraded, and verified rather than dismissed blindly.

### Package 3: evidence and review path

- [ ] Upload test reports, build metadata, and redacted benchmark or matrix evidence with a bounded retention period.
- [ ] Ensure artifacts contain no user text, diagnostics, API keys, or signing material.
- [ ] Document required checks and the difference between a pull request check and release approval.
- [ ] Test a clean checkout on the runner with no cached local configuration.

### Package 4: maintenance

- [ ] Add toolchain update instructions and a scheduled review of action versions.
- [ ] Run the full workflow from `main` after cleanup.
- [ ] Update contributor and security documents with real command names and result locations.
- [ ] Commit and push the workflow and evidence.

## Required tests

- A deliberately failing unit test fails CI.
- A dependency audit at or above the documented threshold fails CI.
- A synthetic secret pattern triggers the secret-check path without exposing a real secret.
- A clean Windows runner builds Electron and Rust without user configuration.

## Acceptance evidence

The workflow run URL, commit SHA, job names, tool versions, artifact list, and successful command output are recorded in the phase file. A second run with one controlled failure proves the gate is active.

## Windows checks

The GitHub Windows runner is evidence for build repeatability, not user compatibility. Keep the phase-14 matrix as the source for physical Windows behaviour.

## Traps

- A workflow can be green because it skips a missing workspace. Print tool versions and each package path.
- An uploaded diagnostic or test fixture can leak text. Audit artifacts as strictly as source logs.
- An automated dependency update is not proof that the alert is fixed. Re-run audit and verify the alert state.

## Stop condition and rollback

Block packaging and release while the workflow is flaky, skips required work, exposes data, or permits a known security failure. Revert the workflow change that created the exposure and preserve the failed run link.

## Implementation record

No workflow exists yet. Record the protected branches, toolchain versions, checked commands, controlled failure evidence, and artifact retention decision.
