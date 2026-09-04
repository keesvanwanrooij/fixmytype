# FixMyType roadmap

This roadmap describes the order in which FixMyType becomes a safe public Windows tool. It is deliberately conservative: text safety and reversibility come before convenience features. The public overview is in the [root README](../README.md); detailed references are indexed in [docs/README.md](../docs/README.md); working plans live in [planning/README.md](README.md).

| Phase | Outcome | Status |
|---|---|---|
| 1 | Public foundation: governance, navigation, licence, funding, and project rules | Complete |
| 2 | Product contract: users, safety invariants, scope, accessibility, decisions | Complete |
| 3 | Architecture and threat model: Electron shell, Windows worker, IPC, privacy | Complete |
| 4 | Quality system: tests, test cases, development workflow, coding standards | Complete |
| 5 | Delivery planning: phase documents, optimization queue, bug-fix process | Complete |
| 6 | User documentation: setup, configuration, protection, local repair, FAQ | Complete |
| 7 | Desktop shell: React, Electron main process, secure preload, local window | In progress |
| 8 | Settings and localisation: tray controls, Dutch/English, stored local preferences | Planned |
| 9 | Input policy library: deterministic timing rules and property tests | Planned |
| 10 | Native observation worker: Windows event observation with content-free diagnostics | Planned |
| 11 | Safe chatter protection: suppression, injected-event guard, pause and exclusions | Planned |
| 12 | Selected-text repair: local Ollama availability, preview, apply and Undo | Planned |
| 13 | Sentence-repair experiment: explicit opt-in, app allowlist and rollback | Planned |
| 14 | Compatibility and accessibility: Windows matrix, keyboard, screen reader, scale | Planned |
| 15 | Reliability and diagnostics: recovery, local logs, performance measurements | Planned |
| 16 | CI and supply-chain checks: tests, lint, audit, licence and secret gates | Planned |
| 17 | Windows packaging: installer, signing path, updates and rollback | Planned |
| 18 | Release candidate: closed beta, issue triage, regression and documentation pass | Planned |
| 19 | Public release: release checklist, tag, installer checksums and support handoff | Planned |

## Phase 1: public foundation

**Goal:** make the repository safe to discover, read, support, and contribute to before application code arrives.

**Done when:** the public files are linked, Apache-2.0 and trademark boundaries are clear, GitHub Sponsors is configured, contributor and security routes exist, and documentation navigation is verified.

**Not in this phase:** Electron code, keyboard hooks, sentence repair, a Windows installer, or a release tag.

## Release rule

No phase receives a version tag just because its checklist has words in it. The first annotated tag, `v0.1.0`, is created only after the documented foundation has been reviewed, all links are valid, the repository is public, and no secret or private information is present.

Return to the [root README](../README.md), [docs hub](../docs/README.md), or [planning hub](README.md).
