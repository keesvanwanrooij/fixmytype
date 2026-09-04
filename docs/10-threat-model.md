# Threat model

Primary harms are unintended text loss, unwanted text insertion, exposure of private text, malicious renderer escalation, unsafe external links, and dependency compromise.

Mitigations: preserve uncertain input; never enter password or secure-desktop contexts; mark injected events; provide pause and Undo; isolate Electron renderers; validate typed IPC; use local-only processing; restrict external URLs; pin and audit dependencies; test regression cases before implementation.

This is not a claim that all threats are solved. New native capabilities require review against this document.

See [README.md](../README.md), [docs hub](README.md), and [roadmap](../plans/README.md).

## New failure paths

A stale repair can overwrite later writing. A dictation result can land in the wrong focused application. An unsafe Undo can reverse a user's manual edit. Address these with target identity, tracked ranges and conflict checks, then test both success and rejection.

Screen content may contain malicious instructions. Treat it as quoted evidence, keep capture scoped, and never translate narration into privileged actions. A local inference server may offer cloud-backed entries; provider selection must prevent content leaving the machine.

## Operational failures

Partial downloads must not become executable resources. Cancelled jobs must release audio, GPU work and temporary files. A hook failure must preserve input. A privacy failure blocks release even if the normal interaction looks correct.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
