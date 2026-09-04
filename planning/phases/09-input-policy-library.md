# Phase 9: input policy library

## Goal

Create a small Rust library that decides only from safe event metadata whether an event is preserved or a repeat is suspicious.

## Read first

`docs/02-user-problem-and-safety.md`, `docs/07-input-pipeline.md`, and phase 8.

## Tasks

- [ ] Create Rust crate.
- [ ] Define safe event metadata.
- [ ] Test repeat threshold.
- [ ] Test timing boundary.
- [ ] Test modifiers.
- [ ] Test injected events.
- [ ] Test disabled state.
- [ ] Implement policy.
- [ ] Add property tests.
- [ ] Run Cargo checks.

## Files

Create `crates/input-core/`, unit tests, property tests, and a short API document.

## Verification

Run `cargo fmt --check`, `cargo clippy -- -D warnings`, and `cargo test`.

## Stop condition

The library must not accept typed characters, clipboard content, or application text.
