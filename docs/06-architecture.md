# Architecture

The desktop application uses React and TypeScript inside a sandboxed Electron renderer. Electron main owns trusted services and validates IPC, the messages crossing process boundaries. A Rust input library supplies deterministic policy. A separate Rust metadata worker starts idle and exposes no external write capability. App-owned editing uses document ranges and target leases; external adapters remain unverified.

## Modules and ownership

| Component | Owns | Must not own |
|---|---|---|
| Renderer | Editor, preferences, history view, suggestion review and companion controls | Arbitrary filesystem, shell commands or remote inference |
| Electron main | Runtime discovery, local inference, speech processes, shortcut registration and consent state | Unrestricted renderer requests |
| Revision engine | Document identity, tracked ranges, cancellation and guarded Undo | Blind replacement by sentence number or string search |
| Native adapter | Target identity, permitted read/write capabilities and input event lifetime | Access to protected targets or an assertion that every app is compatible |
| Rust input core | Numeric event classification and sensitivity configuration | Text storage or permission to suppress |
| Local runtime | Explicit repair, transcription or chosen-window interpretation jobs | Autonomous computer actions |

## Contracts

Typed requests carry an operation ID, limits and the intended target. Validate again in the receiving process. A text update also carries the captured document revision and range version. Exact text comparison alone is insufficient when identical sentences repeat.

The internal editor records edits as transactions and rebases untouched ranges. External adapters must expose their actual ability to validate and mutate a range. UI Automation TextPattern is a read interface, not a general range-writing API. Without a dependable write contract, offer a suggestion or deliberate transfer instead of changing historical text.

## Lifecycle

The [worker protocol](../apps/input-worker/README.md) accepts bounded JSON lines, rejects schema drift and exits on EOF. Main owns request deadlines, cancellation and restart. Restart never restores observation consent. The public preload exposes health only, not native start/probe operations. See [target evidence](../plans/evidence/04-targets.md) for the owned-editor and process checks.

A single app instance owns shortcuts and workers. Closing the window hides it; Quit cancels recording, speech, inference and native callbacks. A lost worker connection leaves protection paused. Startup restores preferences but does not restore microphone or screen consent.

## Local services

Repair initially uses an installed local Ollama runtime. Speech uses an explicitly configured local Whisper-compatible executable and local weights. Narration uses a locally installed voice. Each provider reports unavailable, ready, busy or failed and supports cancellation. Content is kept out of command lines and logs.

The runtime scheduler prioritizes capture and user-requested work over background narration. See [runtime setup](29-runtime-setup-and-scheduling.md) and [revision protocol](25-revision-and-undo.md).

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
