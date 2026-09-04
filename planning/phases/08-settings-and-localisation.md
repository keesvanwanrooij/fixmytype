# Phase 8: Settings and localisation

## Status

In progress

## Outcome

The Settings screen stores and displays local preferences in Dutch and English. It keeps interface language, repair language, and protection preference separate, and its tray action matches the stored protection preference.

## User value

People can understand and change the app without English-only labels, mixed-language controls, or a hidden preference. The screen is clear that input filtering and repair are still planned behaviour.

## Read first

- [Accessibility principles](../../docs/05-accessibility-principles.md)
- [Privacy and data handling](../../docs/09-privacy-and-data-handling.md)
- [Configuration](../../docs/17-configuration.md)
- `apps/desktop/src/shared/settings.ts`

## Scope

This phase changes only local Settings state, local profile storage, renderer copy and layout, tray preference state, typed preload messages, Settings tests, and configuration documentation.

## Non-goals

This phase does not filter keystrokes, observe Windows input, contact Ollama, store text, add a repair switch, or claim an end-user installer. Phases 9 through 13 own those capabilities.

## Dependencies and handoff

| Depends on | Why it must exist first |
|---|---|
| Phase 7 | It provides the sandboxed Electron shell, narrow preload bridge, CSP, and tray menu. |

| Unblocks | What this phase makes possible |
|---|---|
| Phase 9 | The policy library can rely on a separate protection preference contract. |
| Phase 14 | The Settings screen can receive keyboard, scaling, contrast, and locale evidence. |

## Decisions already made

Store only the small, validated Settings object in the renderer's local profile storage. It contains language and protection-preference values, never typed text, clipboard data, repair content, diagnostics, or identifiers. If saved data is malformed, the app keeps the original data untouched, uses safe runtime defaults, and tells the user what happened. The tray changes the stored protection preference. It does not claim to filter keystrokes before phase 11 provides that capability.

## Work packages

### Package 1: validated local preferences

- [x] Define a versioned Settings schema that includes the interface language, repair language, and protection preference.
- [x] Write failing tests for valid, malformed, and unavailable local profile storage before adding the storage adapter.
- [x] Load only a fully validated Settings object and retain malformed stored bytes instead of overwriting them.
- [x] Save a changed validated preference locally and show a local error message if the browser storage API rejects it.

### Package 2: locale and accessible layout

- [x] Add typed English and Dutch copy for navigation, controls, warnings, and the Support FixMyType footer button.
- [x] Build keyboard-accessible Settings navigation with clear current-section semantics and visible focus treatment.
- [x] Keep interface language separate from repair language in both state and wording.

### Package 3: tray handoff and evidence

- [x] Add a protection-preference switch and synchronize it with a tray pause or resume action without claiming active filtering.
- [x] Write tests for malformed storage, separate language selection, tray state transitions, and the text required in both locales.
- [ ] Verify lint, types, tests, build, keyboard-only navigation, both locales, and 200 percent Windows text scaling.

## Files changed

`apps/desktop/src/main/`, `apps/desktop/src/preload/`, `apps/desktop/src/renderer/`, `apps/desktop/src/shared/`, `apps/desktop/tests/`, and [configuration](../../docs/17-configuration.md).

## Required tests

- A complete version-1 Settings record loads without changing any value, and records with missing or unexpected fields are rejected.
- Malformed and unavailable local storage use safe runtime defaults with distinct user-facing messages.
- Interface language and repair language remain separate.
- The protection preference changes between enabled and paused in both Settings and the tray state.
- English and Dutch expose the required Settings and support copy.

## Acceptance evidence

```powershell
Set-Location apps/desktop
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Expected automated result: lint, typecheck, build, and all 12 tests pass. Recorded evidence: commits `2a551fc` and `7ebb70b`; the app starts with Electron main, renderer, GPU, and utility processes.

## Windows checks

| Environment | Steps | Expected result | Evidence |
|---|---|---|---|
| Windows, English locale | Start the app, tab through navigation, select each control, activate the footer button without opening it | Focus stays visible and every control has an accessible label | Pending maintainer check |
| Windows, Nederlands locale | Change app language, retain repair language, repeat keyboard navigation | Every visible control uses Dutch where intended and repair language remains unchanged | Pending maintainer check |
| Windows, 200 percent text scaling | Open each Settings section and reach the footer | No text or control is clipped and the footer remains reachable | Pending maintainer check |

## Traps

- A local Settings record can be malformed. The app must explain its safe defaults without silently replacing the original bytes.
- A tray label can imply live filtering before phase 11. It must continue to describe a preference until worker acknowledgement exists.
- Changing interface language must never alter repair language.

## Stop condition and rollback

Do not persist settings that fail schema validation or silently reset a user choice. Remove the local preference adapter and tray synchronisation if they cannot preserve the schema and safe fallback. Keep all input-related behaviour disabled. No typed text exists to recover.

## Implementation record

- 2026-09-04: Settings schema, storage adapter, English and Dutch copy, layout, tray preference synchronisation, and 12 tests landed in `7ebb70b`.
- 2026-09-04: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm audit --omit=dev --audit-level=high` passed. The app was started and its Electron process tree was observed.
- Remaining: the maintainer must perform the listed keyboard, locale, and 200 percent Windows scaling checks before the phase can be marked complete.
