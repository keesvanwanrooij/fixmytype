# Electron security

FixMyType loads packaged local content only. Every renderer uses `contextIsolation`, sandboxing, a restrictive content-security policy, disabled Node integration, no webviews, blocked navigation, and a minimal typed preload bridge. IPC handlers validate the sender and every argument.

No remote page receives Electron privileges. The donation action is a hard-coded allowlisted URL opened only after a click. The app does not load remote scripts, analytics, fonts, or update content into the renderer.

Read [README.md](../README.md), [docs hub](README.md), and [roadmap](../planning/README.md).
