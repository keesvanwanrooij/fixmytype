# Phase 11: safe chatter protection

## Goal

Turn proven observation into opt-in, reversible suppression without losing intentional input.

## Read first

Phases 9 and 10, plus every invariant in `docs/02-user-problem-and-safety.md`.

## Tasks

- [ ] Read phases 9 and 10 plus safety invariants.
- [ ] Record the chosen timing default and rationale.
- [ ] Write a failing suppression test.
- [ ] Write an injected-event guard test.
- [ ] Write a modifier preservation test.
- [ ] Write an exclusion test.
- [ ] Implement the smallest suppression path.
- [ ] Add a global pause control.
- [ ] Add a visible status state.
- [ ] Verify in a Windows text editor and browser.

## Stop condition

Do not enable suppression by default until every regression test and manual check passes.

## Files and evidence

Modify the worker, settings UI, policy tests, Windows matrix, and changelog. Record the exact timing default and all excluded contexts.
