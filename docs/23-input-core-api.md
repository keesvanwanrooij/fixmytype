# Input-core API

The `crates/input-core` Rust library is the first executable part of FixMyType's input policy. It is a pure, local library. It cannot install a hook, call a Windows API, open a network connection, store event history, or change a key event.

## Input contract

`InputEvent` accepts only this metadata:

- A numeric physical-key code.
- A caller-supplied timestamp in milliseconds.
- Key direction, down or up.
- A modifier bit set that retains Shift, Control, Alt, Windows and unknown bits. Any nonzero bit preserves input.
- An injected-event flag.

The public type has no character, text, clipboard, window-title, process-name, application, or handle field. Its fields stay private so callers cannot extend the contract without changing the crate.

## Output contract

`InputPolicy::classify` returns one of two recommendations:

- `Preserve`: The event must remain unchanged.
- `SuspiciousRepeat`: Two adjacent physical key-down records for the same key are within the caller-supplied time window, with no modifier or injected flag.

`SuspiciousRepeat` is not permission to suppress, replace, insert, or delay input. The Windows worker and later protection phase must establish their own safety conditions before any event-changing capability exists.

## Preserve-first cases

The classifier returns `Preserve` for a first event, another key, a key-up event on either side, any modifier bit on either side, either injected flag, equal or reversed timestamps, a disabled or unrepresentable window, and an event outside the supplied time window. A sub-millisecond window is disabled because event times have millisecond precision. Equal-to-window is included only for a strictly positive interval.

FixMyType has not selected a product-wide timing value. The caller supplies a time window for deterministic tests. Phase 5 may only propose a default after phase 4 provides observation evidence.

## Verification

Run these commands from the repository root:

```powershell
cargo fmt --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
```

Read the [root README](../README.md), [documentation hub](README.md), [planning index](../plans/README.md), [input pipeline](07-input-pipeline.md), and [phase 3 plan](../plans/phases/03-input-policy-library.md) before changing this contract.

## Sensitivity and calibration

`Sensitivity::new` accepts 1 through 5. `TimingTable::new` accepts five strictly increasing caller-provided millisecond windows between 1 and 100. There is no implicit hardware default. The ceiling bounds proposals; it does not prove a timing value is safe for a user's keyboard.

`summarize_calibration` consumes at most 1,000 explicitly labelled intervals between 1 and 5,000 milliseconds. It requires ten accidental and ten deliberate samples. Overlapping groups, invalid samples or a timing table that cannot separate them produce no proposal. Otherwise it proposes the lowest suitable level. The summary returns counts and status only, not a key or event sequence. User confirmation and calibration capture UI belong to phase 5.

## Privacy and caller responsibilities

Numeric key metadata can reveal text when accumulated. The crate receives individual records for classification and adds no event logging. Debug formatting of InputEvent and PhysicalKey is redacted, but accessors still expose operational data to the trusted caller. Do not log those values.

The caller must identify OS auto-repeat, track key-up lifetime and reset context on focus or device changes. Two key-down records alone cannot distinguish a held key from faulty hardware. Never use SuspiciousRepeat as permission to suppress an OS event. Deliberate double-letter intervals and key-up baselines are preservation fixtures, not physical device evidence.

The audit fixed unknown-bit masking and equal-timestamp classification after failing regressions. Two generated tests use seed 20260905 with 512 cases each: one asserts full preservation invariants, the other exercises valid candidates around the exact interval boundaries. All five supplied sensitivity windows are tested at their boundary and immediately beyond it.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
