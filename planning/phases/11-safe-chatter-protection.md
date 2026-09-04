# Phase 11: safe chatter protection

## Status

Planned

## Outcome

Users can explicitly enable or pause deterministic chatter protection in supported Windows contexts. Every uncertain input event is preserved, and the app makes current protection state visible.

## User value

The app begins to reduce clear accidental repeats from an unreliable keyboard without pretending that intentional double letters are mistakes.

## Read first

- [Safety invariants](../../docs/02-user-problem-and-safety.md)
- [Input pipeline](../../docs/07-input-pipeline.md)
- [Windows compatibility](../../docs/11-windows-compatibility.md)
- [Safety test cases](../../docs/13-test-cases-and-safety-invariants.md)
- Phase 9, [Input policy library](09-input-policy-library.md)
- Phase 10, [Native observation worker](10-native-observation-worker.md)

## Scope

Connect the worker's tested observation path to the phase-9 policy only in documented supported contexts. Add a real protection-state control in the Settings screen and tray. Record the selected timing configuration, exclusions, and Windows results.

## Non-goals

This phase does not repair words or sentences, contact local Ollama, process passwords, support elevated applications, support secure desktop, or infer user intent from text. Phases 12 and 13 own repair.

## Dependencies and handoff

| Depends on | Why it must exist first |
|---|---|
| Phase 9 | It provides the pure policy and boundary tests. |
| Phase 10 | It proves passive Windows observation is safe. |
| Phase 8 | It provides a visible preference and tray control to connect to real behaviour. |

| Unblocks | What this phase makes possible |
|---|---|
| Phase 12 | Repair can be presented separately from the working deterministic layer. |
| Phase 14 | Compatibility work can test a real protection path. |

## Decision required at phase start

The timing threshold must be chosen from phase-10 fixture and Windows evidence, not intuition.

| Option | Consequence |
|---|---|
| Conservative threshold | Preserves more intentional repeats and removes fewer accidental repeats. This is the recommended starting point. |
| Aggressive threshold | Removes more repeats but increases text-loss risk. It requires stronger evidence and may be rejected. |
| No threshold meets the safety rule | Keep observation only and do not enable protection. |

Record the measured evidence, selected value, supported contexts, and maintainer decision before implementation.

## Work packages

### Package 1: prove suppression rules before wiring them

- [ ] Write failing tests for a clear same-key repeat at the approved timing value.
- [ ] Write failing tests for the boundary on both sides of that value.
- [ ] Write failing tests preserving intentional double letters, different keys, modifiers, key-up events, injected events, exclusions, and disabled protection.
- [ ] Add a test that proves the suppression branch ran for one synthetic event and preserve is used for every uncertain case.

### Package 2: make suppression opt-in and reversible

- [ ] Keep protection disabled until the user explicitly enables it in a supported context.
- [ ] Connect the Settings switch and tray action to the worker state, including start, pause, resume, and error state.
- [ ] Make pause immediate and visible. A failed worker must fall back to preserve mode.
- [ ] Keep one content-free indicator of current state: inactive, active, paused, unsupported, or failed.

### Package 3: protect excluded contexts

- [ ] Reject password fields, secure desktop, elevated applications, injected input, and all unknown contexts before policy evaluation.
- [ ] Test that an exclusion preserves the event even when timing otherwise resembles chatter.
- [ ] Verify the implementation has no hidden automatic restart that re-enables protection after a user pause.
- [ ] Document each supported and excluded context with evidence.

### Package 4: live proof and cleanup

- [ ] Test the exact synthetic scenarios in Notepad and Chromium with both keyboard layouts.
- [ ] Test pause during typing, worker failure during typing, and app exit during typing.
- [ ] Run all Rust and Electron checks after a cleanup pass.
- [ ] Update documentation, changelog, compatibility matrix, phase evidence, commit, and push.

## Required tests

- One clear synthetic chatter event reaches the suppression branch.
- Every uncertain event is preserved.
- Pause, unsupported context, worker failure, and injected event preserve input.
- Changing UI language does not change policy configuration.
- A protected context cannot be enabled by stale tray or Settings state.

## Acceptance evidence

```powershell
cargo fmt --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
Set-Location apps/desktop; npm run lint; npm run typecheck; npm test; npm run build
```

Expected: all checks pass. Live proof shows one tested clear chatter pattern is suppressed only while enabled, pause restores every event immediately, and unsupported contexts never change input.

## Windows checks

Record one row per supported app, layout, protection state, expected text, actual text, and result. Include Notepad and Chromium first. Retest after a worker crash and after pause.

## Traps

- A green test suite can hide a filter that never activates. Assert that the suppression branch was reached for a known synthetic event.
- A timing rule that passes an English sample may harm Dutch double-letter words. Test both languages with intentional repeats.
- A tray label without worker acknowledgement is a false status. Use actual worker state or show failure.

## Stop condition and rollback

Stop and disable active protection if any test or live check changes an intentional or excluded input event. The rollback is preserve-only observation with the user preference retained but marked unavailable. Do not erase failure evidence.

## Implementation record

No implementation has started. Record timing evidence, the maintainer decision, tests that failed first, supported contexts, exclusions, and Windows results.
