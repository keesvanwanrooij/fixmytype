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

Navigation: [README.md](../README.md), [docs/README.md](README.md), [planning/README.md](../planning/README.md).
