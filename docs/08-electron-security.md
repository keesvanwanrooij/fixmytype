# Electron security

FixMyType loads packaged local content only. Every renderer uses `contextIsolation`, sandboxing, a restrictive content-security policy, disabled Node integration, no webviews, blocked navigation, and a minimal typed preload bridge. IPC handlers validate the sender and every argument.

No remote page receives Electron privileges. The donation action is a hard-coded allowlisted URL opened only after a click. The app does not load remote scripts, analytics, fonts, or update content into the renderer.

Read [README.md](../README.md), [docs hub](README.md), and [roadmap](../plans/README.md).

## IPC and runtime permissions

Validate sender frame, operation name, payload shape and payload size in Electron main. A renderer cannot supply arbitrary executable paths, shell strings, remote endpoints or download destinations. File selection uses a trusted dialog and a purpose-specific validation path.

Keep preload as CommonJS while sandboxing is enabled. Retain context isolation and disabled Node integration. Apply navigation blocking and a content security policy. Enforce a single owner for shortcuts and recording sessions.

## Content isolation

Model output, transcript and screen observations are plain text, not HTML or instructions. Render them as text. Microphone and display permissions are tied to a live feature session and must be revoked on cancellation or window closure. Desktop sources are selected explicitly rather than enumerated into every renderer.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
