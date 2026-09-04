# Phase 9: Narration and chosen-window companion

## Status

⬜ Planned

## Outcome

An optional compact companion reads text locally and describes a visibly selected window on request.

## Why and scope

This phase implements the approved workflow in [the product register](../../docs/24-product-workflows.md). It owns the packages below. Later capabilities stay with their owning phase in [the delivery index](../README.md).

Planning size: Two to four days including local vision integration and capture checks. This is a work estimate, not a completion guarantee.

## Read first

- Read [27-narration-and-companion](../../docs/27-narration-and-companion.md).
- Read [09-privacy-and-data-handling](../../docs/09-privacy-and-data-handling.md).
- Read [05-accessibility-principles](../../docs/05-accessibility-principles.md).
- Read [the architecture](../../docs/06-architecture.md) and [the test strategy](../../docs/12-testing-strategy.md).

## Dependencies and decisions

Required prior capabilities: phases 8. The maintainer's GO authorizes implementation and commits on main. Use documented defaults and ask only if a new choice changes scope or permissions. Microphone and screen access still require explicit user interaction in the app.

## Work packages

### Package 1: Local narration

- [ ] Create a local voice provider with list, speak, rate, pause and stop.
- [ ] Test unavailable voice, empty text, oversized input and immediate cancellation.
- [ ] Expose selected-text narration and queued-speech state in the workspace.
- [ ] Verify installed Dutch and English voice availability without online fallback.

### Package 2: Companion control

- [ ] Create a compact companion window with labeled listening, processing, speaking and paused states.
- [ ] Provide matching shortcut and command-palette actions for every visible control.
- [ ] Support hide, reduced motion, keyboard focus and context menu.
- [ ] Keep personality settings separate from operation permissions.

### Package 3: Scoped observation

- [ ] Use an explicit window picker and revocable session to capture a chosen source.
- [ ] Treat observed text as untrusted data and keep replies as drafts.
- [ ] Debounce changed-screen descriptions and defer them during dictation.
- [ ] Test revoke, target closure, stale observations and no autonomous submission.

### Package 4: cleanup and delivery

- [ ] Review the changed files for duplicated state, dead code, resource leaks and missing boundary validation.
- [ ] Run affected tests after cleanup and retain actual red/green evidence under plans/evidence.
- [ ] Update the phase record, reference docs and changelog with verified behaviour and known limitations.
- [ ] Review the staged diff, commit this verified phase to main and push it to GitHub.

## Acceptance criteria

Run the affected desktop checks from apps/desktop: npm test, npm run lint and npm run build. For Rust changes, run cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings and cargo test --workspace from the root. Run node scripts/check-docs.mjs after documentation changes. A command that was not run is not a pass.

The package-specific failure cases above must have tests or a documented physical fixture. A helper test cannot replace a required process, device or application check.

## Live checks

- [ ] Narrate synthetic text and stop immediately.
- [ ] Observe a controlled test window, change it, revoke and verify capture stops.

## Stop condition and rollback

Selected-window capture is not permission to record the entire desktop or execute observed instructions. Keep a usable draft, preserve existing user content, cancel app-owned jobs and document the reduced capability if a path fails.

## Implementation record

Implementation of this revised phase has not yet been verified.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
