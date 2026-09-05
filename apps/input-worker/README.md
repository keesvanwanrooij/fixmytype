# Native metadata worker

This Rust process provides a Windows metadata boundary. It does not filter keystrokes or change text. The desktop starts it idle for a health check. No renderer API can start native observation or choose an executable.

## Build and test

Run these commands from the repository root:

~~~powershell
cargo build --locked -p fixmytype-input-worker
cargo test --workspace
cargo fmt --check
cargo clippy --workspace --all-targets -- -D warnings
~~~

The desktop's `npm test` and `npm start` also build this worker. You need the Rust Windows MSVC toolchain and its C++ build tools. The development executable lives under `target/debug`. Packaging that executable is a phase-12 task, not an installer claim.

## Protocol

Each request is one UTF-8 JSON line, including a newline, with at most 4,096 bytes. Its only fields are `version`, `id` and `operation`. Version is 1. Request IDs are positive, increasing JavaScript-safe integers. Unknown fields, duplicate IDs, unsupported versions, malformed input and oversized lines produce `INVALID_MESSAGE` and terminate the process. Input is never echoed.

~~~json
{"version":1,"id":1,"operation":"status"}
~~~

The supported operations are `status`, `start`, `stop`, `probe` and `shutdown`. Starting twice or stopping twice is idempotent. Only `probe` after `start` calls Windows discovery. Status does not inspect the desktop. Stop clears the last target and increments the consent epoch. EOF exits normally; shutdown acknowledges before exiting. A new process always starts idle.

Probe results contain an opaque process/window identifier, an unknown document identity, a field category and two false capabilities: `read_selection` and `replace_range`. The identifier can be reused by Windows and is not a document identity. Metadata is a snapshot, not continuing authority. Every external write remains denied.

## Windows boundary

The adapter queries focused-window metadata and privilege state. It recognizes classic Win32 EDIT styles for plain, password, read-only and disabled fields. Unknown controls and inaccessible processes stay unknown. Elevated targets are excluded. It never requests a window title, text value, selection contents, screenshot or keyboard hook. It never moves the caret or sends a key.

All native handles opened for privilege queries are closed. No persistent native callbacks exist. The parent owns process cancellation, a 1.5-second request deadline and a 500-millisecond exit fallback. It validates replies independently and will not accept a worker advertising external write capability.

See [phase-4 evidence](../../plans/evidence/04-targets.md) for real Windows fixtures and their limits. Browser, Office and terminal adapters remain unverified and cannot be promoted from a plain-field label.

Navigation: [project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../../plans/README.md), [desktop](../desktop/README.md).
