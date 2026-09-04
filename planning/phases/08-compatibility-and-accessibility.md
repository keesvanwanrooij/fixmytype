# Phase 8: compatibility and accessibility

## Status

⬜ Planned

## Outcome

FixMyType has a recorded Windows compatibility matrix and accessible Dutch and English interface evidence. Public documentation names only contexts that were actually tested.

## User value

An accessibility tool must work with the keyboard, display settings, language choices, and ordinary Windows programs that users rely on. Clear exclusions are safer than broad guesses.

## Read first

- [Accessibility principles](../../docs/05-accessibility-principles.md)
- [Windows compatibility](../../docs/11-windows-compatibility.md)
- [Testing strategy](../../docs/12-testing-strategy.md)
- Phase 2, [Settings and localisation](02-settings-and-localisation.md)
- Phases 5 through 7 when those capabilities exist

## Scope

Create and execute a versioned Windows test matrix. Review keyboard-only use, focus order, screen-reader labels, 200 percent text scaling, high contrast, Dutch and English interface copy, supported editors, and stated exclusions.

## Non-goals

This phase does not add new filtering or repair behaviour to make a matrix row pass. A failed capability becomes an exclusion, bug-fix record, or later phase proposal.

## Dependencies and handoff

| Depends on | Why it must exist first |
|---|---|
| Phase 2 | It provides the Settings and locale surface to test. |
| Phases 5 to 7 | They provide the actual protection and repair paths, if accepted. |

| Unblocks | What this phase makes possible |
|---|---|
| Phase 12 | Release-candidate testing begins from a known compatibility baseline. |
| Phase 13 | Public support claims can cite verified contexts. |

## Decisions already made

- Windows-only support remains the product boundary.
- No result is inferred from a similar application, keyboard layout, or display setting.
- A failed or untested context is documented as unsupported or unverified, not silently omitted.

## Work packages

### Package 1: define the matrix and evidence form

- [ ] Create a matrix with Windows version, app version, FixMyType version, keyboard layout, input context, assistive setting, feature state, steps, expected result, actual result, and disposition.
- [ ] Add rows for Notepad, one Chromium editor, Dutch layout, English layout, keyboard-only navigation, high contrast, 200 percent scaling, and screen-reader review.
- [ ] Identify protected and excluded contexts before testers begin.
- [ ] Publish a short synthetic-text script so no user needs to enter private writing during a test.

### Package 2: Settings accessibility

- [ ] Test focus order, visible focus, Enter, Space, Escape, and selection controls using only a keyboard.
- [ ] Test Dutch and English screens for complete wording, no mixed controls, and unchanged repair-language choice after interface-language change.
- [ ] Test 100, 150, and 200 percent scaling with no hidden control, clipped text, or unreachable footer button.
- [ ] Test high contrast and at least one Windows screen reader with named controls and state announcements.

### Package 3: feature contexts

- [ ] Run deterministic protection only in the approved supported-context list.
- [ ] Run selected-text repair and any experiment only where their own phase says they are supported.
- [ ] Confirm password, elevated, secure-desktop, and unsupported contexts preserve input and expose no false active state.
- [ ] Create a bug-fix record for each reproducible failure before changing implementation.

### Package 4: publish honest compatibility

- [ ] Review each matrix row for complete evidence and a clear disposition.
- [ ] Update compatibility, configuration, FAQ, and troubleshooting documents with tested scope and exclusions.
- [ ] Run the full automated suite after accessibility cleanup.
- [ ] Commit the matrix and documentation evidence without personal text or tester identifiers.

## Required tests

- Automated tests cover locale selection, accessible names, visible state text, and excluded-context fallback.
- Manual evidence covers keyboard-only navigation, scale, high contrast, screen reader, Dutch layout, English layout, and every stated supported application.

## Acceptance evidence

Run all Electron and Rust checks plus the matrix script. Expected: every public compatibility claim maps to a completed matrix row, and every untested row is marked unverified.

## Windows checks

The matrix is the required evidence. Each row includes date, tester role, Windows build, app versions, synthetic test input, exact steps, expected and actual result, screenshot when visible, and a final supported, excluded, or blocked decision.

## Traps

- A layout that displays correctly at 100 percent can hide its footer at 200 percent. Test the actual bottom Support FixMyType control.
- A screen-reader label may exist while state changes are not announced. Test the switch and tray state after changing them.
- Passing in Notepad does not prove browser or elevated-context support.

## Stop condition and rollback

Do not advance to a release candidate while an accessibility, text-loss, startup, or privacy matrix row is unresolved. Disable a failing feature in that context and document the exclusion.

## Implementation record

No matrix exists yet. Record the matrix location, covered builds, known failures, and bug-fix links as work progresses.
