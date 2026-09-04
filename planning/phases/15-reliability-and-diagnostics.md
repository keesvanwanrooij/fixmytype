# Phase 15: reliability and diagnostics

## Status

Planned

## Outcome

FixMyType recovers predictably from worker, local Ollama, and Settings failures. Its local diagnostics help a user report a problem without containing typed text, clipboard data, proposals, window titles, or identifiers.

## User value

When an accessibility tool fails, users need a clear safe state and a useful explanation. They should not need to choose between privacy and support.

## Read first

- [Privacy and data handling](../../docs/09-privacy-and-data-handling.md)
- [Threat model](../../docs/10-threat-model.md)
- [Troubleshooting](../../docs/20-troubleshooting.md)
- Phase 14, [Compatibility and accessibility](14-compatibility-and-accessibility.md)

## Scope

Define an allowlist of diagnostic fields, local rotation rules, worker restart state, local Ollama timeout state, Settings recovery, offline behaviour, performance measurements, memory measurements, and a user-readable diagnostics screen.

## Non-goals

No telemetry, crash-upload service, remote log upload, account, typed-text history, clipboard capture, automatic support ticket, or performance claim without a measured baseline.

## Dependencies and handoff

| Depends on | Why it must exist first |
|---|---|
| Phases 10 to 13 | They provide worker and repair failure paths to exercise. |
| Phase 14 | It provides real compatibility findings and supported context boundaries. |

| Unblocks | What this phase makes possible |
|---|---|
| Phase 18 | Beta testers receive clear recovery guidance and content-free reports. |
| Phase 19 | Public support instructions can state what evidence a report includes. |

## Decisions already made

- Diagnostics are local, off by default unless required for a visible failure state, and content-free.
- A failure moves input handling to preserve mode and repair to unavailable mode.
- Measurements use synthetic input and record machine and version context.

## Work packages

### Package 1: diagnostic data contract

- [ ] Write a field allowlist before any logger: timestamp, component, version, error code, state transition, and measured duration only.
- [ ] Write failing tests rejecting text-bearing keys, clipboard fields, URLs outside loopback, window titles, process names, and free-form exception data.
- [ ] Define bounded local rotation and user-controlled clear action.
- [ ] Document what a user can inspect or share.

### Package 2: recovery paths

- [ ] Write failing tests for worker exit, repeated worker crash, local Ollama timeout, unavailable service, malformed Settings, and offline state.
- [ ] Implement a visible preserve-mode fallback for input failure and unavailable state for repair failure.
- [ ] Ensure restart uses bounded attempts and never re-enables a user-paused feature.
- [ ] Test Settings recovery retains malformed bytes until the user deliberately changes or clears them.

### Package 3: measurements

- [ ] Define idle CPU, typing-path latency, startup time, worker restart time, repair timeout, and memory metrics.
- [ ] Record baseline commands and synthetic fixtures before optimisation work.
- [ ] Run repeated measurements with Windows version, hardware class, app version, and variance.
- [ ] Add a benchmark regression threshold only where a baseline is stable enough to support it.

### Package 4: user path and evidence

- [ ] Add a diagnostics screen with status, error code, safe recovery action, and copy-safe report contents.
- [ ] Test keyboard access, Dutch and English copy, high contrast, and 200 percent scaling.
- [ ] Run privacy, Electron, Rust, and matrix checks after cleanup.
- [ ] Store redacted synthetic examples and measurement results beside the phase record, then commit and push.

## Required tests

- A diagnostic serializer rejects every disallowed field.
- Worker and local-service failures preserve input or original text and show an understandable state.
- Restart is bounded and respects a user pause.
- Logs rotate and clear without retaining removed content.
- Benchmarks use synthetic data only.

## Acceptance evidence

Run all project checks plus the diagnostics test suite and the documented benchmark commands. Expected: redacted output contains only allowlisted fields, each failure reaches a safe state, and every metric has baseline context.

## Windows checks

Trigger each synthetic failure in a supported application. Record state before failure, user-visible message, resulting input or repair behaviour, recovery action, and diagnostic contents. Test Windows scaling and keyboard-only access to the diagnostics screen.

## Traps

- A logger that serializes an arbitrary error object can retain a request body. Use a strict diagnostic type instead.
- Automatic restart can turn a deliberately paused feature back on. Carry the user preference through every restart path.
- A single fast run is not a performance result. Keep baseline, environment, repetitions, and variance together.

## Stop condition and rollback

Disable diagnostics and block beta if a privacy test finds text-bearing content. Disable a failing worker or repair path rather than repeatedly restarting it. Keep redacted evidence only.

## Implementation record

No implementation has started. Record the field allowlist, failure tests, measurement environment, and every remaining limitation.
