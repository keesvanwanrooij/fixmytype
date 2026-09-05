# Windows compatibility

The target machine uses Windows, an i5-14400F, 32 GB RAM and an RTX 4060 with 8 GB VRAM. This is a development baseline, not a minimum requirement or performance promise.

## Capability matrix

| Target | Read selection | Guarded historical edit | Status |
|---|---|---|---|
| FixMyType editor | App-owned selection | Revision and target-lease checks | Verified in real Electron with late results, target changes and Undo. See [phase-4 evidence](../plans/evidence/04-targets.md). |
| Controlled Win32 EDIT fixture | Metadata only, no selection read | No writes | Plain, password, read-only and disabled field categories tested. This is not general application support. |
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

The native worker starts idle. Its health check is not evidence that system-wide typing protection is connected. Browser, Word, Excel and terminal rows remain unverified even when Windows supplies an opaque target identifier. All native read-selection and write capabilities are currently false.

A failing mutation test demotes the target to suggestions or draft transfer. The user can still read and edit in the internal workspace. Expanding the supported list requires its own recorded test rather than a filename match.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
