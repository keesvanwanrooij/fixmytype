# FixMyType planning

This directory turns the public promise in the [root README](../README.md) into small, verifiable phases. Product and safety documentation is indexed in [docs/README.md](../docs/README.md); this directory owns the order of work, the definition of done, and the record of improvements or regressions.

## Start here

| Need | Location |
|---|---|
| The full sequence | [full delivery overview](#full-delivery-overview) |
| Shared scope and safety constraints | [Shared guardrails](#shared-guardrails) |
| Work planned for one release phase | `phases/` |
| Measured performance or reliability work | `optimizations/` |
| Reproducible defects and their fixes | `bug-fixes/` |

## Full delivery overview

| Phase | Outcome | Read first |
|---|---|---|
| 1 | Public foundation | `phases/01-public-foundation.md` |
| 2 | Product contract | `phases/02-product-contract.md` |
| 3 | Architecture and threats | `phases/03-architecture-and-threats.md` |
| 4 | Quality system | `phases/04-quality-system.md` |
| 5 | Delivery planning | `phases/05-delivery-planning.md` |
| 6 | User documentation | `phases/06-user-documentation.md` |
| 7 | Desktop shell | `phases/07-electron-shell.md` |
| 8 | Settings and localisation | `phases/08-settings-and-localisation.md` |
| 9 | Input policy library | `phases/09-input-policy-library.md` |
| 10 | Native observation worker | `phases/10-native-observation-worker.md` |
| 11 | Safe chatter protection | `phases/11-safe-chatter-protection.md` |
| 12 | Selected-text repair | `phases/12-selected-text-repair.md` |
| 13 | Sentence-repair experiment | `phases/13-sentence-repair-experiment.md` |
| 14 | Compatibility and accessibility | `phases/14-compatibility-and-accessibility.md` |
| 15 | Reliability and diagnostics | `phases/15-reliability-and-diagnostics.md` |
| 16 | CI and supply chain | `phases/16-ci-and-supply-chain.md` |
| 17 | Windows packaging | `phases/17-windows-packaging.md` |
| 18 | Release candidate | `phases/18-release-candidate.md` |
| 19 | Public release | `phases/19-public-release.md` |

## Delivery status

| Complete | In progress | Planned |
|---|---|---|
| Phases 1–7 | Phase 8 | Phases 9–19 |

The phase file is the operational checklist. A phase is complete only when every relevant task and acceptance criterion has evidence. The current app is not ready for end-user use.

## Release rule

No phase receives a release tag just because its document exists. A public release requires green automated checks, Windows compatibility evidence, a security review, an installer and checksums, current documentation, a clean repository, and an annotated tag.

## Shared guardrails

FixMyType is Windows-first, local-first, free, open source, and account-free. Electron owns the Settings UI. A Rust worker owns native input. The renderer never receives hook or filesystem privilege. No kernel driver, cloud processing, password-field handling, secure-desktop handling, telemetry, advertising, or paid tier is in scope. Preserve uncertain input. Make repairs explicit and undoable. Contact local Ollama only through loopback when the user enables it.

## Planning rules

- One phase has one written objective, explicit non-goals, automated test gates, and manual Windows checks.
- Any behavior that can silently damage text begins with a failing test before implementation.
- A phase is not complete because code exists. It is complete only when its acceptance criteria and relevant verification have passed.
- Begin each substantial phase by documenting only material clarifying choices, their options and consequences, and the recommended decision.
- The roadmap records shipped status. `CHANGELOG.md` records user-visible changes. Neither is updated speculatively.
- Small, self-contained iterations may proceed directly on `main`; substantial phase work uses one branch when isolation or parallel work helps.
- Each new README must link to [README.md](../README.md), [docs/README.md](../docs/README.md), and this planning index.

See the [root README](../README.md) for why the project exists and the [documentation hub](../docs/README.md) for its safety commitments.
