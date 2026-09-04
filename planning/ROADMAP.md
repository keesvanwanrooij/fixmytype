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
| 7 | Electron shell: secure tray UI, Settings screen, tests first | Planned |
| 8 | Input prototype: observation-mode native worker, deterministic policy tests | Planned |
| 9 | Safe protection and repair: opt-in controls, undo, local model integration | Planned |
| 10 | Release readiness: CI, packaging, Windows verification, changelog, tags | Planned |

## Phase 1: public foundation

**Goal:** make the repository safe to discover, read, support, and contribute to before application code arrives.

**Done when:** the public files are linked, Apache-2.0 and trademark boundaries are clear, GitHub Sponsors is configured, contributor and security routes exist, and documentation navigation is verified.

**Not in this phase:** Electron code, keyboard hooks, sentence repair, a Windows installer, or a release tag.

## Release rule

No phase receives a version tag just because its checklist has words in it. The first annotated tag, `v0.1.0`, is created only after the documented foundation has been reviewed, all links are valid, the repository is public, and no secret or private information is present.

Return to the [root README](../README.md), [docs hub](../docs/README.md), or [planning hub](README.md).
