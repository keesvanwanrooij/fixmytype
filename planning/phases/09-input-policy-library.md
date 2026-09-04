# Phase 9: input policy library

## Status

Planned

## Outcome

A small Rust library classifies safe keyboard-event metadata as `preserve` or `suspicious repeat`. It cannot read text, change an event, call Windows APIs, access the network, or know which application received the event.

## User value

The future filter starts with a deterministic rule that can be inspected and tested before it is connected to Windows input. This protects intentional double letters and uncertain input from being silently removed.

## Read first

- [Safety invariants](../../docs/02-user-problem-and-safety.md)
- [Input pipeline](../../docs/07-input-pipeline.md)
- [Threat model](../../docs/10-threat-model.md)
- [Testing strategy](../../docs/12-testing-strategy.md)
- Phase 8, [Settings and localisation](08-settings-and-localisation.md)

## Scope

Create `crates/input-core/` with typed event metadata, a pure classifier, unit tests, property tests, public API documentation, and Cargo workspace wiring. The library returns a recommendation only. Its caller owns every later decision.

## Non-goals

This phase does not install a Windows hook, suppress input, change Electron UI, persist events, tune a live timing value, identify text fields, or send diagnostics. Phases 10 and 11 own observation and any later suppression.

## Dependencies and handoff

| Depends on | Why it must exist first |
|---|---|
| Phase 2 | It defines preserve-uncertain-input and protected-context rules. |
| Phase 3 | It defines the renderer and worker trust boundary. |
| Phase 8 | It defines the stored protection preference without claiming active protection. |

| Unblocks | What this phase makes possible |
|---|---|
| Phase 10 | The observation worker can emit typed metadata to one tested policy API. |
| Phase 11 | Suppression work has a deterministic test suite to protect. |

## Decisions already made

- The input core receives metadata only. Character content, clipboard data, window titles, process names, and application text are excluded.
- The default decision is `preserve`. `suspicious repeat` is a recommendation, not permission to delete input.
- Injected events and events with modifiers are preserved unless a future documented decision says otherwise.
- The timing default is not selected here. Phase 11 may propose one only after phase-10 evidence exists.

## Work packages

### Package 1: crate and public vocabulary

- [ ] Create `Cargo.toml` workspace entries and `crates/input-core/Cargo.toml` with no Windows or network dependency.
- [ ] Create `src/lib.rs`, `src/event.rs`, and `src/policy.rs` with a minimal public API and crate-level documentation.
- [ ] Define metadata fields: physical key identity, event timestamp, key state, modifier state, and injected-event flag.
- [ ] Write a compile-time or unit test proving the event type has no text or clipboard field.

### Package 2: policy rules, tested first

- [ ] Write a failing test that a first press is preserved.
- [ ] Write a failing test that an immediate same-key repeat without modifiers is classified as suspicious only at the documented boundary.
- [ ] Write failing boundary tests for equal-to, just-before, and just-after the configured interval.
- [ ] Write failing tests that different keys, key-up events, modifiers, and injected events are preserved.
- [ ] Implement the smallest pure classifier that makes those tests pass.

### Package 3: misuse resistance

- [ ] Add property tests that arbitrary metadata never panics and always returns one defined result.
- [ ] Add tests that changing a non-relevant field cannot turn a preserved event into a suspicious repeat.
- [ ] Add explicit invalid-timestamp handling that preserves input.
- [ ] Keep the policy configuration immutable per classifier instance and document the unit of time.

### Package 4: handoff evidence

- [ ] Add `docs/` API notes describing input and output fields in plain language.
- [ ] Run formatting, Clippy, unit tests, and property tests before and after cleanup.
- [ ] Record the exact test names and commit in `Implementation record`.
- [ ] Update the phase status only when every acceptance item has evidence.

## Required tests

- First physical key-down is preserved.
- Same key at each timing boundary returns the documented result.
- Different key, modifier, injected event, key-up event, and invalid timestamp are preserved.
- Generated metadata cannot panic the classifier.
- The public event model contains no text-bearing field.

## Acceptance evidence

```powershell
cargo fmt --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
```

Expected: every command exits successfully. Test output names the normal, boundary, modifier, injected-event, invalid-data, and generated-data cases.

## Windows checks

No live suppression check belongs here. On Windows, run the same Cargo commands in a clean checkout to confirm the library is buildable without a hook or elevated privilege.

## Traps

- A classifier that labels a repeat as removable has crossed a phase boundary. The only allowed outputs are recommendations.
- A test that checks only a return type can pass while the classifier always preserves. At least one test must prove the suspicious branch occurs for its synthetic input.
- A text field added "for later" violates the privacy boundary even if no caller uses it.

## Stop condition and rollback

Stop if the proposed API needs typed content or a Windows dependency. Revert the crate or keep it unused if tests cannot express the preserve-first rule. No user data exists to migrate.

## Implementation record

No implementation has started. Before coding, record the failing-test evidence and any material choice that changes the metadata contract.
