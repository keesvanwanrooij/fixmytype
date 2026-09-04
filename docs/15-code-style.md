# Code style

Use TypeScript with strict types in Electron and Rust with `clippy -D warnings` in the worker. Prefer small pure functions for policy, explicit typed boundaries for IPC, and comments that explain a safety decision rather than restating code. Keep user-facing text in locale files. Never log typed text.

Run formatting, linting, type checks, and tests before a commit. A cleanup pass removes duplicate logic and makes safety conditions easy to audit.

See [README.md](../README.md), [docs hub](README.md), and [roadmap](../plans/README.md).

## Contract-focused structure

Keep pure transformations separate from Electron, Windows calls and local processes. Represent states as closed unions rather than independent booleans that can contradict each other. Validate unknown input at every process and persistence boundary.

Use one transaction representation for manual edits, AI replacement, dictation and Undo. Keep provider details out of renderer business rules. Pass dependencies such as clock and process runner explicitly when they affect deterministic tests.

## Review

Remove unused listeners and cancel requests when their owner disappears. Bound memory and queue sizes. Explain safety decisions in comments, not every syntax step. A test should fail when behaviour breaks rather than merely compare a constant to itself.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
