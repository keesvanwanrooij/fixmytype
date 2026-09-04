# Phase 8: Settings and localisation

## Status

In progress

## Goal

Turn the phase-7 shell into a usable local control surface in Dutch and English.

## Phase choice

Store only the small, validated Settings object in the renderer's local profile storage. It contains language and protection-preference values, never typed text, clipboard data, repair content, diagnostics, or identifiers. This avoids new filesystem access and keeps the renderer boundary narrow. If saved data is malformed, the app keeps the original data untouched, uses safe runtime defaults, and tells the user what happened. The tray changes the stored protection preference. It does not claim to filter keystrokes before phase 11 provides that capability.

## Read first

`docs/05-accessibility-principles.md`, `docs/09-privacy-and-data-handling.md`, and `apps/desktop/src/shared/settings.ts`.

## Tasks

- [x] Define a versioned Settings schema that includes the interface language, repair language, and protection preference.
- [x] Write failing tests for valid, malformed, and unavailable local profile storage before adding the storage adapter.
- [x] Load only a fully validated Settings object and retain malformed stored bytes instead of overwriting them.
- [x] Save a changed validated preference locally and show a local error message if the browser storage API rejects it.
- [x] Add typed English and Dutch copy for navigation, controls, warnings, and the Support FixMyType footer button.
- [x] Build keyboard-accessible Settings navigation with clear current-section semantics and visible focus treatment.
- [x] Keep interface language separate from repair language in both state and wording.
- [x] Add a protection-preference switch and synchronize it with a tray pause or resume action without claiming active filtering.
- [x] Write tests for malformed storage, separate language selection, tray state transitions, and the text required in both locales.
- [ ] Verify lint, types, tests, build, keyboard-only navigation, both locales, and 200 percent Windows text scaling.

## Files

Modify `apps/desktop/src/renderer/`, `apps/desktop/src/shared/`, `apps/desktop/tests/`, and `docs/17-configuration.md`.

## Verification

Run lint, typecheck, tests, build, and a keyboard-only Windows check in both locales.

## Stop condition

Do not persist settings that fail schema validation or silently reset a user choice.
