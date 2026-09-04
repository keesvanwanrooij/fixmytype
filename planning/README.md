# FixMyType planning

This directory turns the public promise in the [root README](../README.md) into small, verifiable phases. Product and safety documentation is indexed in [docs/README.md](../docs/README.md); this directory owns the order of work, the definition of done, and the record of improvements or regressions.

## Start here

| Need | Location |
|---|---|
| The full sequence | [10-phase roadmap](ROADMAP.md) |
| The current foundation contract | [Phase 0 foundation plan](00-foundation/00-repository-foundation-plan.md) |
| Work planned for one release phase | `phases/` |
| Measured performance or reliability work | `optimizations/` |
| Reproducible defects and their fixes | `bug-fixes/` |

## Planning rules

- One phase has one written objective, explicit non-goals, automated test gates, and manual Windows checks.
- Any behavior that can silently damage text begins with a failing test before implementation.
- A phase is not complete because code exists. It is complete only when its acceptance criteria and relevant verification have passed.
- Begin each substantial phase by documenting only material clarifying choices, their options and consequences, and the recommended decision.
- The roadmap records shipped status. `CHANGELOG.md` records user-visible changes. Neither is updated speculatively.
- Small, self-contained iterations may proceed directly on `main`; substantial phase work uses one branch when isolation or parallel work helps.
- Each new README must link to [README.md](../README.md), [docs/README.md](../docs/README.md), and [ROADMAP.md](ROADMAP.md).

See the [root README](../README.md) for why the project exists and the [documentation hub](../docs/README.md) for its safety commitments.
