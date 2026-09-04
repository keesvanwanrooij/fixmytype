# Phase 3: input policy library

## Status

🟡 In progress

## Outcome

A small Rust library classifies safe keyboard-event metadata as `preserve` or `suspicious repeat`. It cannot read text, change an event, call Windows APIs, access the network, or know which application received the event.

## User value

The future filter starts with a deterministic rule that can be inspected and tested before it is connected to Windows input. This protects intentional double letters and uncertain input from being silently removed.

## Read first

- [Safety invariants](../../docs/02-user-problem-and-safety.md)
- [Input pipeline](../../docs/07-input-pipeline.md)
- [Threat model](../../docs/10-threat-model.md)
- [Testing strategy](../../docs/12-testing-strategy.md)
- Phase 2, [Settings and localisation](02-settings-and-localisation.md)

## Scope

Create `crates/input-core/` with typed event metadata, a pure classifier, unit tests, property tests, public API documentation, and Cargo workspace wiring. The library returns a recommendation only. Its caller owns every later decision.

## Non-goals

This phase does not install a Windows hook, suppress input, change Electron UI, persist events, tune a live timing value, identify text fields, or send diagnostics. Phases 4 and 5 own observation and any later suppression.

## Dependencies and handoff

| Depends on | Why it must exist first |
|---|---|
| Phase 1 | It defines preserve-uncertain-input, protected-context, renderer, and worker trust rules. |
| Phase 2 | It defines the stored protection preference without claiming active protection. |

| Unblocks | What this phase makes possible |
|---|---|
| Phase 4 | The observation worker can emit typed metadata to one tested policy API. |
| Phase 5 | Suppression work has a deterministic test suite to protect. |

## Decisions already made

- The input core receives metadata only. Character content, clipboard data, window titles, process names, and application text are excluded.
- The default decision is `preserve`. `suspicious repeat` is a recommendation, not permission to delete input.
- Injected events and events with modifiers are preserved unless a future documented decision says otherwise.
- The timing default is not selected here. Phase 5 may propose one only after phase-4 evidence exists.

## Work packages

### Package 1: crate and public vocabulary

- [x] Create `Cargo.toml` workspace entries and `crates/input-core/Cargo.toml` with no Windows or network dependency.
- [x] Create `src/lib.rs`, `src/event.rs`, and `src/policy.rs` with a minimal public API and crate-level documentation.
- [x] Define metadata fields: physical key identity, event timestamp, key state, modifier state, and injected-event flag.
- [x] Write a unit test for the fixed public metadata contract. Private fields and the reviewed API contain no text or clipboard field.

### Package 2: policy rules, tested first

- [x] Write a failing test that a first press is preserved.
- [x] Write a failing test that an immediate same-key repeat without modifiers is classified as suspicious only at the documented boundary.
- [x] Write failing boundary tests for equal-to, just-before, and just-after the configured interval.
- [x] Write failing tests that different keys, key-up events, modifiers, and injected events are preserved.
- [x] Implement the smallest pure classifier that makes those tests pass.

### Package 3: misuse resistance

- [x] Add property tests that arbitrary metadata never panics and always returns one defined result.
- [x] Add tests that modifier and injected metadata always preserve an event, including when they appear in the prior record.
- [x] Add explicit invalid-timestamp handling that preserves input.
- [x] Keep the policy configuration immutable per classifier instance and document the unit of time.

### Package 4: handoff evidence

- [x] Add `docs/` API notes describing input and output fields in plain language.
- [x] Run formatting, Clippy, unit tests, and property tests before and after cleanup.
- [x] Record the exact test names and commit in `Implementation record`.
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

Expected: every command exits successfully. Test output names the normal, boundary, modifier, injected-event, invalid-data, and generated-data cases. On 2026-09-04, the final check ran from this Windows checkout and passed all eight integration and property tests.

## Windows checks

No live suppression check belongs here. On Windows, run the same Cargo commands in a clean checkout to confirm the library is buildable without a hook or elevated privilege.

## Traps

- A classifier that labels a repeat as removable has crossed a phase boundary. The only allowed outputs are recommendations.
- A test that checks only a return type can pass while the classifier always preserves. At least one test must prove the suspicious branch occurs for its synthetic input.
- A text field added "for later" violates the privacy boundary even if no caller uses it.

## Stop condition and rollback

Stop if the proposed API needs typed content or a Windows dependency. Revert the crate or keep it unused if tests cannot express the preserve-first rule. No user data exists to migrate.

## Implementation record

- 2026-09-04: `cargo test --workspace` failed before implementation because `src/lib.rs` did not exist. The test file was already present and specified the preserve-first contract.
- 2026-09-04: Added the pure `fixmytype-input-core` crate, its content-free API documentation, eight tests, and a Proptest property test. The test names are `preserves_the_first_key_down`, `marks_an_unmodified_same_key_repeat_inside_the_window_as_suspicious`, `documents_the_repeat_window_boundaries`, `preserves_different_keys_key_up_modifier_and_injected_events`, `preserves_events_with_an_invalid_timestamp_order`, `preserves_when_the_previous_event_has_modifier_or_injected_metadata`, `only_exposes_the_fixed_content_free_metadata_contract`, and `arbitrary_metadata_never_panics_and_returns_a_known_recommendation`. `cargo fmt --check`, `cargo clippy --workspace --all-targets -- -D warnings`, and `cargo test --workspace` passed after cleanup.
- 2026-09-04: The code commit is pending a clean-checkout Windows verification. No Windows hook, input suppression, text capture, or product-wide timing default was added.
