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

| Phase | Status | Outcome | Read first |
|---|---|---|---|
| 1 | ✅ Complete | Project foundation | [01-project-foundation.md](phases/01-project-foundation.md) |
| 2 | ✅ Complete | Settings and localisation | [02-settings-and-localisation.md](phases/02-settings-and-localisation.md) |
| 3 | 🟡 In progress | Input policy library | [03-input-policy-library.md](phases/03-input-policy-library.md) |
| 4 | ⬜ Planned | Native observation worker | [04-native-observation-worker.md](phases/04-native-observation-worker.md) |
| 5 | ⬜ Planned | Safe chatter protection | [05-safe-chatter-protection.md](phases/05-safe-chatter-protection.md) |
| 6 | ⬜ Planned | Selected-text repair | [06-selected-text-repair.md](phases/06-selected-text-repair.md) |
| 7 | ⬜ Planned | Sentence-repair experiment | [07-sentence-repair-experiment.md](phases/07-sentence-repair-experiment.md) |
| 8 | ⬜ Planned | Compatibility and accessibility | [08-compatibility-and-accessibility.md](phases/08-compatibility-and-accessibility.md) |
| 9 | ⬜ Planned | Reliability and diagnostics | [09-reliability-and-diagnostics.md](phases/09-reliability-and-diagnostics.md) |
| 10 | ⬜ Planned | CI and supply chain | [10-ci-and-supply-chain.md](phases/10-ci-and-supply-chain.md) |
| 11 | ⬜ Planned | Windows packaging | [11-windows-packaging.md](phases/11-windows-packaging.md) |
| 12 | ⬜ Planned | Release candidate | [12-release-candidate.md](phases/12-release-candidate.md) |
| 13 | ⬜ Planned | Public release | [13-public-release.md](phases/13-public-release.md) |

## Delivery status

| ✅ Complete | 🟡 In progress | ⬜ Planned |
|---|---|---|
| Phases 1 to 2 | Phase 3 | Phases 4 to 13 |

The phase file is the operational checklist. A phase is complete only when every relevant task and acceptance criterion has evidence. The current app is not ready for end-user use.

## Release rule

No phase receives a release tag just because its document exists. A public release requires green automated checks, Windows compatibility evidence, a security review, an installer and checksums, current documentation, a clean repository, and an annotated tag.

## Shared guardrails

FixMyType is Windows-first, local-first, free, open source, and account-free. Electron owns the Settings UI. A Rust worker owns native input. The renderer never receives hook or filesystem privilege. No kernel driver, cloud processing, password-field handling, secure-desktop handling, telemetry, advertising, or paid tier is in scope. Preserve uncertain input. Make repairs explicit and undoable. Contact local Ollama only through loopback when the user enables it.

## Planning rules

- One phase is a coherent junior-engineer assignment of at least half a day. It has one written objective, explicit non-goals, ordered work packages, automated test gates, and manual Windows checks.
- Phase 1 combines completed project setup. Do not split setup work back into artificial delivery phases.
- Any behavior that can silently damage text begins with a failing test before implementation.
- A phase is not complete because code exists. It is complete only when its acceptance criteria and relevant verification have passed.
- Begin each substantial phase by documenting only material clarifying choices, their options and consequences, and the recommended decision.
- The roadmap records shipped status. `CHANGELOG.md` records user-visible changes. Neither is updated speculatively.
- Small, self-contained iterations may proceed directly on `main`; substantial phase work uses one branch when isolation or parallel work helps.
- Each new README must link to [README.md](../README.md), [docs/README.md](../docs/README.md), and this planning index.

See the [root README](../README.md) for why the project exists and the [documentation hub](../docs/README.md) for its safety commitments.
