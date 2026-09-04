# Development workflow

Work follows the maintainer's approved 13-phase plan on main. The 2026-09-05 GO authorizes the ten accepted ideas, documentation repair, tests, cleanup, optimizations and phase commits. Ask a new question only when an unresolved choice changes user intent or authority.

## Eight steps

1. Write a focused behavioural test for the next failure-prone rule.
2. Run it and record the intended failure.
3. Implement the smallest complete path that satisfies the rule.
4. Run the focused check and relevant integration tests.
5. Review duplication, invalid states, resource lifetime, privacy and copy.
6. Run affected checks after cleanup and measure performance changes.
7. Update English reference docs, the active plan and user-facing release notes.
8. Review the diff, commit the verified scope and push to GitHub.

## Phase boundaries

A phase is an observable product capability or release gate, sized for at least half a day of junior work. Its packages name source files, expected behaviour and failure cases. A phase is complete only when automated and required live checks have evidence.

An integration blocker does not invalidate useful completed packages. Record them honestly and work on independent authorized packages. Do not mark a provider ready when it only has a mock, or treat a source build as an installer.

## Cleanup and optimization

Keep a short review record for each phase. Remove copied state and redundant listeners. Bound queues and audio buffers. Measure a suspected bottleneck before optimizing it. Record the before and after fixture, duration and tradeoff in plans/optimizations.

## Repository hygiene

Preserve unrelated user files. Stage explicit paths. Store synthetic fixtures only. Never include writing, recordings, runtime weights, credentials or local configuration in a commit. All README links must resolve after moves.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
