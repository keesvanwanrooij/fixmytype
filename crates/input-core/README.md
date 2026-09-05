# FixMyType input core

This crate classifies numeric keyboard-event metadata for a future Windows worker. It has no Windows API dependency, network dependency, text field, clipboard field, window title, process name, or input-changing capability. Numeric key sequences can still reveal writing, so raw metadata must not be logged.

`InputPolicy::classify` returns `Preserve` or `SuspiciousRepeat`. The second result is a recommendation only. No caller may use this crate as authority to suppress, replace, or delay a key event.

The caller supplies the time window. FixMyType has not selected a product-wide timing value. The classifier preserves events with modifiers, injected events, key-up events, different keys, missing previous metadata, and timestamps that run backwards.

Unknown modifier bits, equal timestamps and disabled windows also preserve input. `Sensitivity` validates levels 1-5; `TimingTable` holds five explicit timing values. `summarize_calibration` returns an aggregate proposal only after enough labelled samples show separation from deliberate repetitions. The caller must still identify held keys, secure context and actual key lifetime. See [the API contract](../../docs/23-input-core-api.md) for bounds and examples of caller responsibilities.

Run the checks from the repository root:

```powershell
cargo fmt --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
```

Read the [root README](../../README.md), [documentation hub](../../docs/README.md), [planning index](../../plans/README.md), and [phase 3 plan](../../plans/phases/03-input-policy-library.md) before changing this crate.
