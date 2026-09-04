# Windows compatibility

The target machine uses Windows, an i5-14400F, 32 GB RAM and an RTX 4060 with 8 GB VRAM. This is a development baseline, not a minimum requirement or performance promise.

## Capability matrix

| Target | Read selection | Guarded historical edit | Status |
|---|---|---|---|
| FixMyType editor | App-owned selection | Revision transactions | Must receive live evidence as implemented |
| Chromium plain text fields | Adapter investigation | Field-specific adapter required | Planned |
| Rich browser editors | Adapter investigation | Editor-specific transaction required | Planned |
| Word | Adapter investigation | Document range contract required | Planned |
| Excel prose cells | Adapter investigation | Cell identity and type required | Planned |
| Excel formulas | Excluded from automatic prose repair | No automatic rewrite | Deliberate exclusion |
| Codex and Claude Code prompts | Target investigation | Prompt-specific support required | Planned |
| Terminals and command lines | Deliberate draft transfer initially | No historical backspacing | Planned limited support |
| Passwords, elevated apps and secure desktop | Excluded | Excluded | No support claim |

## Test a row

Record Windows build, app build, target version, field type, keyboard layout and scaling. Use a synthetic document. Test insert, selection change, focus change, repeated sentence, late result, Undo, pause and target closure. Record separate results for plain typing, repair and dictation.

A screen-reader label test is not a native editing test. A main-process start is not evidence that React rendered. A DOM screenshot at browser zoom is not evidence for Windows text scaling. Each result must state exactly how it was obtained.

## Promotion

A failing mutation test demotes the target to suggestions or draft transfer. The user can still read and edit in the internal workspace. Expanding the supported list requires its own recorded test rather than a filename match.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
