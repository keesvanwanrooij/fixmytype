# First usable writing workflow, 2026-09-05

## Verified scope

The source build supports typing, local AI repair and local dictation in its own editor. External applications receive text through an explicit Copy text action, not through input injection. The runtime fixtures use synthetic prose and the public JFK sample from whisper.cpp b4938. No physical microphone recording was made for these checks.

## Commands and results

From `apps/desktop`, run `npm test`, `npm run lint`, `npm run build`, `npm run test:smoke`, `npm run test:runtime` and `npm run test:workflow`. The final unit suite contains 47 passing tests. Lint and the production build pass.

The real-engine check repaired English and Dutch prose, then transcribed the JFK fixture locally. One recorded Whisper run took 1,434 ms and left its sessions directory empty. This measures this fixture on this computer, not every recording.

The real Electron workflow verifies:

- Suggest leaves the original unchanged until Accept.
- Undo restores the original and does not immediately retrigger that correction.
- Automatic mode starts while later typing continues without a pause.
- The later draft and caret remain intact after the earlier replacement.
- A fake microphone drives the actual renderer PCM capture, WAV encoding, preload, main process and local Whisper executable.
- Stop releases every microphone track before transcription finishes.
- The transcript is inserted through its captured range, and dictation Undo restores the prior draft.
- Cancel releases the fake microphone without changing the draft; a new capture request without session consent is denied.

The real-engine check also cancels an owned Whisper child during processing and verifies that no session files remain afterwards.

The same test uses an isolated temporary profile. It does not alter the user's preferences. A rendered screenshot of the writing page was inspected. Chromium screenshot capture intermittently raises `UnknownVizError` on this host, so capture is opt-in with `FIXMYTYPE_CAPTURE=1`; behavioral assertions still fail normally and are not skipped.

## Cleanup and limits

The cleanup pass separated the document buffer, provider, audio encoder, recorder and IPC boundary. It added strict WAV validation, request deadlines, serialized jobs, microphone revocation on hiding, a banner across app pages and 50-entry session history. It also fixed continuous-typing starvation, signed-number preservation and sentence parsing around decimal points and URLs using failing regressions first.

Runtime resources are pinned to whisper.cpp b4938 and multilingual base revision `5359861c739e955e79d9a303bcbc70fb988958b1`; the setup script checks SHA-256 before use. Resource downloads remain ignored by Git. See [desktop setup](../../apps/desktop/README.md) for reproduction.

`npm run setup:speech` was also rerun successfully. Its first npm invocation exposed a Windows PowerShell module-path issue inherited from PowerShell 7: `Get-FileHash` was unavailable. The script now prefers its own shell's built-in module directory before importing the hashing and archive commands. Existing verified downloads were reused on the successful run.

Physical microphone quality in Dutch, Windows scaling, crash recovery, persistent history, speech commands, TTS, system-wide correction and packaged installation remain open. The app cannot guarantee that AI preserves intended meaning. Phase 13 still requires maintainer acceptance.

Navigation: [evidence](README.md), [phase 8](../phases/08-dictation-and-commands.md), [plans](../README.md), [project home](../../README.md).
