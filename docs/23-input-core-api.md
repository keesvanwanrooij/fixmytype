# Input-core API

The `crates/input-core` Rust library is the first executable part of FixMyType's input policy. It is a pure, local library. It cannot install a hook, call a Windows API, open a network connection, store event history, or change a key event.

## Input contract

`InputEvent` accepts only this metadata:

- A numeric physical-key code.
- A caller-supplied timestamp in milliseconds.
- Key direction, down or up.
- Four modifier flags, Shift, Control, Alt, and Windows.
- An injected-event flag.

The public type has no character, text, clipboard, window-title, process-name, application, or handle field. Its fields stay private so callers cannot extend the contract without changing the crate.

## Output contract

`InputPolicy::classify` returns one of two recommendations:

- `Preserve`: The event must remain unchanged.
- `SuspiciousRepeat`: Two adjacent physical key-down records for the same key are within the caller-supplied time window, with no modifier or injected flag.

`SuspiciousRepeat` is not permission to suppress, replace, insert, or delay input. The Windows worker and later protection phase must establish their own safety conditions before any event-changing capability exists.

## Preserve-first cases

The classifier returns `Preserve` for a first event, another key, a key-up event, either modifier state, either injected flag, a timestamp that runs backwards, and an event outside the supplied time window. Equal-to-window is included in the suspicious recommendation.

FixMyType has not selected a product-wide timing value. The caller supplies a time window for deterministic tests. Phase 5 may only propose a default after phase 4 provides observation evidence.

## Verification

Run these commands from the repository root:

```powershell
cargo fmt --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
```

Read the [root README](../README.md), [documentation hub](README.md), [planning index](../plans/README.md), [input pipeline](07-input-pipeline.md), and [phase 3 plan](../plans/phases/03-input-policy-library.md) before changing this contract.

## Audit scheduled after the scope update

The initial implementation masks unknown modifier bits. That can turn unknown metadata into 'no modifiers', which violates preserve-first behaviour. Phase 3 must add a failing regression test before correcting this path.

Numeric key metadata can reveal text when accumulated. The crate receives individual records for classification and must not add event logging. A field-accessor test alone does not prove a privacy property; review the type and its consumers.

Equal timestamps, zero windows, held keys and clock reset require explicit tests. A 40 ms fixture is a test parameter, not a production calibration. Test generation must have a recorded seed and useful invariant rather than only matching the return enum.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
