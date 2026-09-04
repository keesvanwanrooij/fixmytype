# Input pipeline

1. Windows delivers a keyboard event to the unprivileged worker.
2. The worker ignores protected contexts, modifiers, injected input, and disabled protection.
3. A deterministic policy compares only safe event metadata and timing.
4. It preserves uncertain input; it may suppress a high-confidence repeated event.
5. The worker reports only content-free status to Electron.
6. The tray and Settings UI show state; the user can pause immediately.

Selected-text repair is separate: user requests it, Electron reads the explicit selection through an approved mechanism, calls local Ollama, presents a reviewable replacement, and preserves Undo.

See [README.md](../README.md), [docs hub](README.md), and [roadmap](../planning/ROADMAP.md).
