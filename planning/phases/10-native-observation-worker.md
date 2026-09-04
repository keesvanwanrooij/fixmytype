# Phase 10: native observation worker

## Status

Planned

## Outcome

A Windows worker observes the smallest permitted keyboard-event metadata, sends it through a versioned local contract, and never alters or suppresses an event.

## User value

This phase proves that FixMyType can observe the required signal without interfering with ordinary typing. It gives the project Windows evidence before any input-changing path exists.

## Read first

- [Architecture](../../docs/06-architecture.md)
- [Input pipeline](../../docs/07-input-pipeline.md)
- [Electron security](../../docs/08-electron-security.md)
- [Windows compatibility](../../docs/11-windows-compatibility.md)
- Phase 9, [Input policy library](09-input-policy-library.md)

## Scope

Create `apps/input-worker/`, a versioned local IPC schema, worker lifecycle handling, content-free health state, and Windows observation evidence. The worker may call the phase-9 classifier for measurement but may not act on its recommendation.

## Non-goals

No key suppression, no kernel driver, no elevated-app handling, no password-field support, no secure-desktop support, no event log containing characters, and no renderer access to hook handles. Phase 11 owns active protection.

## Dependencies and handoff

| Depends on | Why it must exist first |
|---|---|
| Phase 9 | It provides a tested metadata contract and policy vocabulary. |
| Phase 7 | It provides the Electron main-process and preload boundary. |

| Unblocks | What this phase makes possible |
|---|---|
| Phase 11 | It provides evidence that passive observation is stable before suppression is considered. |
| Phase 15 | It establishes the worker lifecycle and content-free health signals. |

## Decision required at phase start

Choose the Windows observation API only after a short spike proves it can meet every boundary below.

| Option | Consequence |
|---|---|
| Raw Input | It has a narrow data path but may not cover every desired context. Test foreground delivery first. |
| Low-level keyboard hook | It may offer broader observation but requires stricter performance and failure testing. It must return without changing events. |
| No acceptable API | The project stops before active protection rather than widening privilege or collecting content. |

Recommendation: run an observation-only spike and select only the API with reproducible, content-free evidence. The maintainer approves the result before package 2.

## Work packages

### Package 1: prove the observation boundary

- [ ] Create an observation spike outside production code with no event mutation path.
- [ ] Test Notepad and one Chromium browser with a normal account, without elevated applications.
- [ ] Record whether the candidate API supplies only the phase-9 metadata fields.
- [ ] Record CPU use while idle and during continuous typing without storing typed characters.

### Package 2: worker and IPC contract

- [ ] Create `apps/input-worker/` with explicit start, ready, health, stop, and failure messages.
- [ ] Version the IPC envelope and reject unknown version, message type, and field shape.
- [ ] Keep the Electron renderer behind the existing preload bridge. Only the main process starts or stops the worker.
- [ ] Write failing tests for invalid IPC, repeated start, repeated stop, and worker exit before lifecycle implementation.

### Package 3: passive event path

- [ ] Map Windows metadata into the phase-9 event type without adding characters or application text.
- [ ] Ignore injected events and record only a count in a content-free health result if diagnostics later need it.
- [ ] Ensure every callback returns without preventing, replacing, or delaying the Windows event.
- [ ] Add an explicit unsupported-context result for secure desktop, elevated applications, and unknown contexts.

### Package 4: lifecycle and Windows evidence

- [ ] Test normal start, stop, process crash, restart, and Electron shutdown.
- [ ] Verify the worker has no network connection, file log, or elevated privilege requirement.
- [ ] Run the Windows matrix in Notepad and Chromium with Dutch and English keyboard layouts.
- [ ] Record Windows version, worker version, API choice, exact steps, and results in the compatibility document.

## Required tests

- Invalid IPC cannot start an observation path.
- Start and stop are idempotent.
- A worker crash changes health state without crashing Electron.
- Injected events are not forwarded as normal events.
- The worker source and tests demonstrate no suppression call exists.

## Acceptance evidence

```powershell
cargo fmt --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
Set-Location apps/desktop; npm run lint; npm run typecheck; npm test; npm run build
```

Expected: all checks pass. Live evidence shows the worker starts and stops cleanly in Notepad and Chromium, while every typed character remains unchanged.

## Windows checks

| Environment | Steps | Expected result | Evidence |
|---|---|---|---|
| Windows 10 or 11, Notepad, Dutch layout | Start worker, type ordinary and repeated letters, stop worker | All input remains unchanged and worker health changes correctly | Version, date, result |
| Windows 10 or 11, Chromium, English layout | Repeat the same steps | All input remains unchanged and worker health changes correctly | Version, date, result |

## Traps

- A passive hook can still affect typing through latency or a wrong return path. Compare typed output with the worker stopped and running.
- Logging a virtual key with a window title or application name creates unnecessary personal data. Keep diagnostics content-free.
- An observation result is not permission to enable filtering. Phase 11 needs separate tests and maintainer approval.

## Stop condition and rollback

Stop if passive observation changes, delays, or destabilizes input in any test context. Disable worker startup from Electron and retain only content-free failure evidence. Do not continue to phase 11.

## Implementation record

No implementation has started. Record the chosen API, why alternatives were rejected, and live Windows evidence before marking this phase complete.
