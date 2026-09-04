# Scope and non-goals

## Included through the first public release

- Windows 10 and 11 desktop support.
- Electron tray and Settings UI in Dutch and English.
- A native, unprivileged input worker with deterministic chatter policy.
- Local-only configuration, pause, per-app exclusions, and Undo.
- Optional selected-text repair through a user-provided local Ollama service.
- Clear diagnostics, tests, packaging, and release documentation.

## Explicit non-goals

- macOS, Linux, mobile, cloud sync, accounts, telemetry, ads, subscriptions, and paid features.
- A keyboard driver or attempts to bypass protected Windows input.
- Hidden auto-rewriting, remote AI, or storing a text history by default.
- Promising every Windows text control is compatible before it is manually verified.
- Voice dictation before the basic filter is proven safe; it remains a possible later proposal, not a promised release feature.

## Change control

An addition needs an issue or phase decision if it changes privacy, input safety, permissions, dependencies, public claims, or long-term maintenance. Small corrections may stay on `main` under the repository workflow.

Use [README.md](../README.md), [docs/README.md](README.md), and [planning/ROADMAP.md](../planning/ROADMAP.md) to navigate.
