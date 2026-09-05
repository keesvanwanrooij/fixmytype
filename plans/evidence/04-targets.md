# Phase 4: Target and worker verification

Date: 2026-09-05. Baseline checkpoint: `a917373`, after the layout result `896ebf6`. Host: Windows 11 Home, build 26200, Node 24.18.0 and Rust 1.97.1. Tests use synthetic text and isolated app profiles. The user's running app and draft were not closed.

## Result and scope

The app-owned editor has a document identity, immutable capability snapshot and consent epoch. Delayed repair and dictation results need the captured lease and a valid document range before applying. Choosing another text field or leaving the writing surface invalidates the old lease, even if focus later returns. A denied result stays in session history as a draft. Explicit acceptance or Undo requires a current owned document and an unchanged tracked range.

The native worker is a real Rust child process. Main starts it idle, checks readiness and owns its lifetime. Native discovery exists only behind the worker's explicit start/probe protocol; the UI has no native-observation start route in this phase. It reads field and process metadata, not text. No native target gets read-selection or write capability. Direct input protection remains phase 5.

## Red, green and cleanup

1. The target tests first failed because the target contract did not exist. The implemented contract passes 13 tests, including stale epochs, changed documents, denied contexts and attribute-only inspection.
2. Four Rust protocol tests first failed against a no-op server. They now pass for lifecycle, strict schemas, message bounds, IDs, malformed data and EOF.
3. Child-owner tests first failed because the owner module did not exist. Twelve tests now cover real native crash/restart, missing executable, cancellation, overlap, timeout and hostile replies. A cleanup test exposed acceptance of an array where a state string was required. It failed, the validator was corrected, and the test passes.
4. A real Electron fixture holds an AI response, focuses a synthetic password input, returns focus to the editor and releases the response. Neither original text nor password content changes. The draft is retained. A read-only editor also rejects a late result. Restoring a valid target allows a normal correction.
5. The fixture crashes the renderer, verifies that its actual native child exits, reloads and checks a fresh worker. Quitting Electron releases that child too. The first run exposed a notification sent to a disposed frame. A stderr regression failed before the fix and now passes without that diagnostic.
6. The existing real-engine workflow initially exposed overlapping health checks reporting a healthy worker as unavailable. Main now shares in-flight checks and queries independent runtimes concurrently. The workflow passes with AI, speech and worker readiness all true.
7. Cleanup also made leases explicit at every apply call, bounded response allocation before concatenation, removed quit listeners with their window and formatted the changed files. No user text is added to logs or process arguments.

## Executed checks

| Check | Observed result |
|---|---|
| `npm test` in apps/desktop | 73 tests pass across 18 files, including real child processes. |
| `npm run lint` and `npm run build` | The typed desktop and native source build pass. |
| `npm run test:targets` | The real Electron target, renderer-crash and quit assertions pass. |
| `npm run test:phase2` | NL/EN keyboard, spacing, tray and restart assertions pass. |
| `npm run test:workflow` | Local Ollama, concurrent typing, cursor retention, Whisper fake-microphone capture, cancellation and Undo pass. |
| `cargo test --workspace` | 21 Rust tests pass, including a real Win32 EDIT fixture. |
| `cargo fmt --check` and workspace clippy with warnings denied | Both checks pass. |
| `node scripts/check-docs.mjs` | Repository links and phase numbering pass. |

The Win32 fixture creates hidden plain, password, read-only and disabled EDIT windows with a fixed synthetic value. The production metadata inspector identifies each category and grants no external rights. The test reads the fixture's own value afterward to verify it is unchanged. A null handle produces no target. This is not a browser or Office compatibility test, and it does not exercise the secure desktop or an elevated user app.

## Windows API decisions

Microsoft documents TextPattern as a read interface, without general text mutation. It cannot justify historical range replacement. See [TextPattern overview](https://learn.microsoft.com/en-us/dotnet/framework/ui-automation/ui-automation-textpattern-overview).

ValuePattern can set a control's value, but that is not a revision-aware historical edit contract. Read-only and unsupported controls need explicit handling. FixMyType does not fall back to simulated backspacing. See [ValuePattern.SetValue](https://learn.microsoft.com/en-us/dotnet/api/system.windows.automation.valuepattern.setvalue?view=windowsdesktop-10.0).

GetGUIThreadInfo exposes active and focused window metadata, which can change during activation. The observer rechecks foreground and focus after inspection and returns no target on a mismatch. A successful snapshot still grants no external read or write capability. See [GetGUIThreadInfo](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getguithreadinfo) and [GUITHREADINFO](https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-guithreadinfo).

## Remaining boundaries

The compatibility matrix remains unsupported for direct browser, Word, Excel and terminal edits. Windows input timing callbacks and suppression are not installed. Protected or uncertain contexts remain denied. Physical Windows 200-percent text scaling belongs to phase 2 and still needs maintainer confirmation. The worker fixture is not evidence for scaling, a physical keyboard or a microphone.

Navigation: [project home](../../README.md), [documentation](../../docs/README.md), [plans](../README.md), [phase 4](../phases/04-native-observation-worker.md), [worker](../../apps/input-worker/README.md).
