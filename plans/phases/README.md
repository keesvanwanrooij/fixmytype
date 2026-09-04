# Phase execution guide

Read [the project home](../../README.md), [documentation](../../docs/README.md) and [the full phase overview](../README.md). Each phase file below has an outcome, prerequisites, source-level tasks, failure cases, cleanup, live checks and a stop condition.

## All phases

1. [Project foundation](01-project-foundation.md)
2. [Workspace, profiles and shortcuts](02-settings-and-localisation.md)
3. [Preserve-first input policy](03-input-policy-library.md)
4. [Target capabilities and native lifecycle](04-native-observation-worker.md)
5. [Typing protection and personal calibration](05-safe-chatter-protection.md)
6. [Local repair and personal tone](06-selected-text-repair.md)
7. [Concurrent sentence repair, history and Undo](07-sentence-repair-experiment.md)
8. [Dictation, vocabulary and spoken commands](08-dictation-and-commands.md)
9. [Narration and chosen-window companion](09-companion-and-narration.md)
10. [Guided setup, resource scheduling and CI](10-runtime-setup-and-ci.md)
11. [Compatibility, accessibility and measured reliability](11-compatibility-and-reliability.md)
12. [Windows package and first-user candidate](12-windows-candidate.md)
13. [First-user acceptance and public release gate](13-first-user-acceptance.md)

## Working rules

A ✅ Complete marker requires actual evidence. 🟡 In progress means some verified packages exist. ⬜ Planned means the revised phase is not implemented. ⛔ Blocked identifies the exact dependency, not merely slow work.

Record the failing behavioural test before implementation, the checks after cleanup and the commit that contains the result. Physical checks must state Windows build, target, actions and observation. Do not infer a screen-reader or scaling result from a startup confirmation.

Each package names a source area and an observable result. Split a large package into a linked file when it becomes difficult to execute safely, while preserving phase numbering. Keep estimates in ordinary engineering language and omit AI-selection metadata.
