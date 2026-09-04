# Threat model

Primary harms are unintended text loss, unwanted text insertion, exposure of private text, malicious renderer escalation, unsafe external links, and dependency compromise.

Mitigations: preserve uncertain input; never enter password or secure-desktop contexts; mark injected events; provide pause and Undo; isolate Electron renderers; validate typed IPC; use local-only processing; restrict external URLs; pin and audit dependencies; test regression cases before implementation.

This is not a claim that all threats are solved. New native capabilities require review against this document.

See [README.md](../README.md), [docs hub](README.md), and [roadmap](../planning/README.md).
