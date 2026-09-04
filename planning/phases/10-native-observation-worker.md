# Phase 10: native observation worker

## Goal

Connect Windows event observation to the tested policy library without changing an input event.

## Read first

Phases 9, `docs/10-threat-model.md`, and `docs/11-windows-compatibility.md`.

## Tasks

- [ ] Create worker binary.
- [ ] Define IPC schema.
- [ ] Start event loop.
- [ ] Observe only.
- [ ] Ignore injected events.
- [ ] Exclude content.
- [ ] Test startup.
- [ ] Test shutdown.
- [ ] Test invalid IPC.
- [ ] Verify Windows controls.

## Files

Create `apps/input-worker/`, its IPC contract, worker tests, and compatibility evidence.

## Verification

Run Cargo checks, start and stop the worker repeatedly, then test Notepad and a Chromium browser manually.

## Stop condition

Any unexpected altered keystroke blocks promotion to phase 11.
