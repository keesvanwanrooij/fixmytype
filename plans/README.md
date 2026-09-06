# FixMyType delivery plans

This is the canonical delivery status for the approved typing, repair, dictation and companion product. Read [the project home](../README.md), [documentation](../docs/README.md) and [the ten approved additions](../docs/24-product-workflows.md) before implementing a phase.

## Usable now

✅ The source build supports local AI suggestions and automatic correction inside FixMyType, even while later typing continues. It supports guarded Undo, repeated-letter filtering, local Whisper dictation and explicit copying to other apps. Start it with `Start FixMyType.cmd` or follow [the desktop guide](../apps/desktop/README.md).

✅ Verification now includes 78 desktop tests, 22 Rust tests, lint, a production build, real Electron interaction, local AI correction and a fake-microphone-to-Whisper workflow. Settings also supports explicitly accepted key calibration. See [calibration evidence and feedback](evidence/2026-09-06-calibration.md), [target evidence](evidence/04-targets.md) and [dictation evidence](evidence/2026-09-05-dictation-workflow.md).

The expanded phases remain in progress where their original scope exceeds this usable slice. External input hooks, direct insertion, TTS, spoken commands, companion work, packaging and physical acceptance are not complete.

## Phase status

| Phase | Status | Outcome |
|---|---|---|
| 1 | ✅ Complete | [Project foundation](phases/01-project-foundation.md) |
| 2 | 🧪 Code verified; physical scaling pending | [Workspace, profiles and shortcuts](phases/02-settings-and-localisation.md) |
| 3 | ✅ Complete | [Preserve-first input policy](phases/03-input-policy-library.md) |
| 4 | ✅ Complete | [Target capabilities and native lifecycle](phases/04-native-observation-worker.md) |
| 5 | 🔄 Calibration delivered; native path pending | [Typing protection and personal calibration](phases/05-safe-chatter-protection.md) |
| 6 | 🔄 In progress | [Local repair and personal tone](phases/06-selected-text-repair.md) |
| 7 | 🔄 In progress | [Concurrent sentence repair, history and Undo](phases/07-sentence-repair-experiment.md) |
| 8 | 🔄 In progress | [Dictation, vocabulary and spoken commands](phases/08-dictation-and-commands.md) |
| 9 | ⬜ Planned | [Narration and chosen-window companion](phases/09-companion-and-narration.md) |
| 10 | ⬜ Planned | [Guided setup, resource scheduling and CI](phases/10-runtime-setup-and-ci.md) |
| 11 | ⬜ Planned | [Compatibility, accessibility and measured reliability](phases/11-compatibility-and-reliability.md) |
| 12 | ⬜ Planned | [Windows package and first-user candidate](phases/12-windows-candidate.md) |
| 13 | ⬜ Planned | [First-user acceptance and public release gate](phases/13-first-user-acceptance.md) |

Phase 2's code and keyboard/tray lifecycle checks are complete; its physical Windows text-scaling check remains open. Phase 3 is complete with isolated Windows build evidence. A prior 'app works' message confirmed startup only, not scaling or external application compatibility.

## Work order

Finish one verified capability at a time, using its ordered packages. Independent preparation can proceed while a physical check is pending; record the dependency instead of silently skipping it. The final candidate must support the [first-user script](../docs/30-first-user-test.md).

### Current execution focus

✅ The follow-up [repair checks](evidence/2026-09-06-repair.md) now pass 89 desktop tests and real Electron cancellation tests. Local AI and fake-microphone Whisper still pass their combined workflow. The next slice adds explicit spoken formatting without changing literal dictation by default.

The maintainer now prioritizes Word social posts, sentence repair and dictation. The [Word-first delivery slice](word-first-delivery.md) now saves a new `.docx` and offers a separate open action. Its 84 desktop tests and isolated installed-Word round-trip pass. See [Word evidence](evidence/2026-09-06-word.md). Direct editing in Word and physical feedback remain pending. Repair and speech improvements follow next.

The app-owned portions of phases 6, 7 and 8 are delivered. Phase 2 has a tested 24px gap above its setup action. Phases 3 and 4 pass their contracts. Phase 5 now delivers visible calibration and per-key settings for the owned editor; native interception remains open. The [first physical feedback list](evidence/2026-09-06-calibration.md) covers calibration, intended repeats, dictation and phase 2's pending 200-percent Windows text-size check. Each slice has a pushed checkpoint before work and a verified result afterward. Keep unsupported native integration and physical acceptance explicit.

Use [phase instructions](phases/README.md) for evidence rules, [bug fixes](bug-fixes/README.md) for regressions and [optimizations](optimizations/README.md) for measurements. The [evidence index](evidence/README.md) lists actual checks.

## Release rule

A public release requires passing automated checks, supported-target and accessibility evidence, install and uninstall results, reviewed dependencies, accurate documentation and a checksummed artifact. Tag the verified commit only. Phase 13 requires actual maintainer acceptance; do not infer that result from tests.

## Shared constraints

All processing stays local. Microphone and chosen-window observation need visible, revocable sessions. The app cannot send messages or execute terminal commands based on document instructions. Formula, code and protected-target guards apply independently of AI mode. Preserve content when target ownership is uncertain.

Work on main with explicit-path staging, tests before failure-prone changes, a cleanup review and a GitHub push per phase. A phase has at least half a day of substantive junior work; checklist length is not a substitute for an observable result.
