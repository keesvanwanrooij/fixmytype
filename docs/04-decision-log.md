# Decision log

This log records product and technical decisions that constrain implementation. A future entry states the date, decision, alternatives considered, consequence, and owner.

| Date | Decision | Consequence |
|---|---|---|
| 2026-09-04 | Windows only for the current roadmap | Native input work and verification focus on Windows 10/11. |
| 2026-09-04 | Electron is the UI shell; a Rust worker owns native input | The renderer has no input-hook privileges. |
| 2026-09-04 | Apache-2.0 with a separate trademark policy | Reuse is broad; the FixMyType name is not automatically reusable. |
| 2026-09-04 | Local core stays free, open source, account-free, and ad-free | No cloud or paid-feature architecture is designed. |
| 2026-09-04 | Dutch and English interface; repair language is separate | UI locale never forces repair locale. |
| 2026-09-04 | Repair is opt-in and undoable | Automatic rewriting cannot be silently enabled. |
| 2026-09-04 | Quick iterations use `main`; substantial phases may use a branch | Small fixes ship quickly while larger work stays reviewable. |
| 2026-09-04 | Electron renderer has no native input or filesystem privilege | The main process and Rust worker retain narrow, testable responsibilities. |
| 2026-09-04 | No kernel driver or protected-input support | Safety and reversibility take priority over broad interception. |

No contributor may reverse a decision that changes privacy, scope, or text safety without an explicit maintainer decision.

Navigation: [README.md](../README.md), [docs/README.md](README.md), [plans/README.md](../plans/README.md).

## Approved expansion on 2026-09-05

The maintainer approved all ten ideas in [the workflow register](24-product-workflows.md) and gave GO for implementation. The English work directory is now plans/. Work proceeds in phases on main with tests, cleanup and GitHub commits.

AI mode is Off, Suggest or Automatic. Both typing sensitivity and repair intensity have levels 1 through 5. The user wants older-sentence correction during continued typing, which requires tracked ranges and target-specific capabilities.

Dictation uses a configurable toggle shortcut, adds a local transcript history and inserts into a validated captured selection. Narration and a chosen-window companion are included. Persistent history, microphone and screen capture have visible user controls.

Personalization starts with approved prompt guidance and vocabulary rather than silent collection or automatic fine-tuning. The companion can prepare text but cannot send messages or execute commands. These decisions supersede the earlier voice non-goal and blanket history exclusion.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
