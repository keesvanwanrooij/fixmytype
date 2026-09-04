# Phase 8: Settings and localisation

## Goal

Turn the phase-7 shell into a usable local control surface in Dutch and English.

## Read first

`docs/05-accessibility-principles.md`, `docs/09-privacy-and-data-handling.md`, and `apps/desktop/src/shared/settings.ts`.

## Tasks

- [ ] Add validated local storage.
- [ ] Add safe defaults.
- [ ] Add tray pause control.
- [ ] Add Settings navigation.
- [ ] Add English strings.
- [ ] Add Dutch strings.
- [ ] Separate UI and repair language.
- [ ] Test malformed storage.
- [ ] Test both locales.
- [ ] Verify scaling on Windows.

## Files

Modify `apps/desktop/src/renderer/`, `apps/desktop/src/shared/`, `apps/desktop/tests/`, and `docs/17-configuration.md`.

## Verification

Run lint, typecheck, tests, build, and a keyboard-only Windows check in both locales.

## Stop condition

Do not persist settings that fail schema validation or silently reset a user choice.
