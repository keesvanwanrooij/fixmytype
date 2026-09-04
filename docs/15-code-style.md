# Code style

Use TypeScript with strict types in Electron and Rust with `clippy -D warnings` in the worker. Prefer small pure functions for policy, explicit typed boundaries for IPC, and comments that explain a safety decision rather than restating code. Keep user-facing text in locale files. Never log typed text.

Run formatting, linting, type checks, and tests before a commit. A cleanup pass removes duplicate logic and makes safety conditions easy to audit.

See [README.md](../README.md), [docs hub](README.md), and [roadmap](../planning/ROADMAP.md).
