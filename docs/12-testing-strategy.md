# Testing strategy

Pure policy logic uses deterministic unit and property tests. Electron configuration uses unit tests and static security assertions. The Windows worker uses unit tests plus manual compatibility checks. End-to-end tests cover Settings, tray state, language choices, pause, exclusions, repair preview, and Undo.

Every input-changing behavior begins with a failing regression test. Tests must cover intentional repeats, modifiers, injected events, disabled state, timing boundaries, model failure, and content-free diagnostics.

Read [README.md](../README.md), [docs hub](README.md), and [roadmap](../planning/ROADMAP.md).
