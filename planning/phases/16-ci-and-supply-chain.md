# Phase 16: CI and supply chain

## Goal

Make every release gate repeatable on GitHub and block vulnerable or unreviewed changes.

## Read first

`docs/12-testing-strategy.md`, `SECURITY.md`, and prior phase commands.

## Tasks

- [ ] Add Windows CI runner.
- [ ] Pin Node and Rust versions.
- [ ] Run formatting checks.
- [ ] Run lint and typecheck.
- [ ] Run unit and integration tests.
- [ ] Run dependency audit.
- [ ] Run license review.
- [ ] Run secret scan.
- [ ] Upload test results.
- [ ] Require green checks before release.

## Acceptance criteria

CI fails safely on a regression, vulnerable dependency, or secret.

## Files

Create `.github/workflows/ci.yml`, dependency policy, release check scripts, and contributor instructions.
