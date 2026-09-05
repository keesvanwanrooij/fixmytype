# Phase 2: Workspace, profiles and shortcuts

## Status

🧪 Awaiting one physical check. ✅ Implementation, automated keyboard navigation and restart/tray verification are complete. Windows text scaling at 200 percent is not yet verified.

## Outcome

The running desktop has a usable writing workspace, settings and personalization for the three AI modes.

## Why and scope

This phase implements the approved workflow in [the product register](../../docs/24-product-workflows.md). It owns the packages below. Later capabilities stay with their owning phase in [the delivery index](../README.md).

Planning size: One to two days including migration, UI and accessibility verification. This is a work estimate, not a completion guarantee.

## Read first

- Read [05-accessibility-principles](../../docs/05-accessibility-principles.md).
- Read [17-configuration](../../docs/17-configuration.md).
- Read [28-profiles-style-and-vocabulary](../../docs/28-profiles-style-and-vocabulary.md).
- Read [the architecture](../../docs/06-architecture.md) and [the test strategy](../../docs/12-testing-strategy.md).

## Dependencies and decisions

Required prior capabilities: phases 1. The maintainer's GO authorizes implementation and commits on main. Use documented defaults and ask only if a new choice changes scope or permissions. Microphone and screen access still require explicit user interaction in the app.

## Work packages

### Package 1: Validated preferences

- [x] Add tests for v1 migration and malformed new fields in apps/desktop/tests/preferences.test.ts.
- [x] Create src/shared/preferences.ts with AI mode, sensitivity, intensity, profile, style, vocabulary and shortcuts.
- [x] Preserve prior language settings through explicit migration; never infer capture consent from storage.
- [x] Reject duplicate shortcuts, oversized style cards and invalid vocabulary entries.

### Package 2: Writing workspace

- [x] Split src/renderer/main.tsx into an App shell, Workspace and Settings components.
- [x] Place AI Off, Suggest and Automatic controls beside the writing area with clear availability text.
- [x] Add a Settings-only interface language selector and separate repair language selector.
- [x] Implement editable profiles, style card and vocabulary with visible validation feedback.

### Package 3: Interaction and lifecycle

- [x] Add main-process single-instance ownership and handle shortcut registration failure transactionally.
- [x] Expose a typed action event through preload.cts instead of arbitrary channel access.
- [x] Keep Support FixMyType in the bottom footer and provide keyboard focus for every control.
- [x] Run a real Electron render check and exercise Settings, both locales and reduced viewport.

### Package 4: cleanup and delivery

- [x] Review the changed files for duplicated state, dead code, resource leaks and missing boundary validation.
- [x] Run affected tests after cleanup and retain actual red/green evidence under plans/evidence.
- [x] Update the phase record, reference docs and changelog with verified behaviour and known limitations.
- [x] Review the staged diff and deliver the verified code with checkpoint/result commits. Final physical acceptance remains open.

## Acceptance criteria

Run the affected desktop checks from apps/desktop: npm test, npm run lint and npm run build. For Rust changes, run cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings and cargo test --workspace from the root. Run node scripts/check-docs.mjs after documentation changes. A command that was not run is not a pass.

The package-specific failure cases above must have tests or a documented physical fixture. A helper test cannot replace a required process, device or application check.

## Live checks

- [x] Tab through workspace and settings in both locales.
- [ ] Verify 200 percent Windows text scaling separately from browser zoom.
- [x] Close to tray, reopen, quit and restart without losing language preferences.

## Stop condition and rollback

Keep physical scaling pending if it cannot be performed; never infer it from 'app works'. Keep a usable draft, preserve existing user content, cancel app-owned jobs and document the reduced capability if a path fails.

## Implementation record

The completion audit passes 48 desktop tests, lint, build and `npm run test:phase2`. The last command uses two real Electron processes with one isolated profile: it tabs through every enabled control in both locales, verifies failure feedback, invokes the real tray callbacks, quits and reloads persisted Dutch preferences. It does not touch the running user's profile. The parent removes its own synthetic profile after both processes exit. See [completion evidence](../evidence/2026-09-05-phase2-audit.md).

### Completion audit checkpoint

Status: locked for implementation under the maintainer's instruction to continue. The baseline is `f2b945f`. The only pre-existing untracked file is the root `package-lock.json`; it is not part of this phase.

The next package tests every enabled workspace and Settings control with Tab in NL and EN, tests language persistence across separate Electron launches, and exercises close-to-tray and reopening. It also audits translated tray labels and truthful save feedback. Files in scope are `src/main/main.ts`, a tray-label helper, `src/renderer/SettingsPanel.tsx`, `src/renderer/App.tsx`, focused tests and an isolated lifecycle script under `apps/desktop/scripts`.

The host currently reports Windows TextScaleFactor 100. Do not change the user's global accessibility settings or substitute browser zoom for a physical 200-percent check. That row remains a maintainer check. Phase 3 depends on phase 1, so its independent library work can proceed while this physical check remains pending.

Acceptance commands: `npm test`, `npm run lint`, `npm run build`, the new lifecycle command and `node scripts/check-docs.mjs`. Make a second commit and push after verification, with the remaining physical row explicit.

The earlier Settings build passed 20 tests and a renderer startup check. Its claimed maintainer verification of keyboard navigation, locale behaviour and Windows scaling was inferred incorrectly and is withdrawn. Those checks require actual evidence. The expanded workspace scope is not complete.

2026-09-05: Added a React workspace, three AI mode controls, four profiles, NL/EN settings, style card, vocabulary and configurable shortcuts. Preference tests cover migration, malformed fields, storage failure and shortcut conflicts. Registration restores the previous shortcuts on failure. A real Electron smoke script exercises the preload, typing, Dutch persistence, draft retention, AI mode, keyboard focus and compact layout. All 28 tests passed. Lint and the production build passed before and after the formatting cleanup. See [workspace evidence](../evidence/2026-09-05-workspace.md). Runtime controls are not yet text-changing features.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
