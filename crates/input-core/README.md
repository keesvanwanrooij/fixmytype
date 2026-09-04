# FixMyType input core

This crate classifies content-free keyboard-event metadata for a future Windows worker. It has no Windows API dependency, network dependency, text field, clipboard field, window title, process name, or input-changing capability.

`InputPolicy::classify` returns `Preserve` or `SuspiciousRepeat`. The second result is a recommendation only. No caller may use this crate as authority to suppress, replace, or delay a key event.

The caller supplies the time window. FixMyType has not selected a product-wide timing value. The classifier preserves events with modifiers, injected events, key-up events, different keys, missing previous metadata, and timestamps that run backwards.

Run the checks from the repository root:

```powershell
cargo fmt --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
```

Read the [root README](../../README.md), [documentation hub](../../docs/README.md), [planning index](../../planning/README.md), and [phase 3 plan](../../planning/phases/03-input-policy-library.md) before changing this crate.
