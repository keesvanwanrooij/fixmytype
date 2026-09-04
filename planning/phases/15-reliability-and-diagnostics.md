# Phase 15: reliability and diagnostics

## Goal

Make failures recoverable and diagnosable without storing user text.

## Read first

`docs/09-privacy-and-data-handling.md`, `docs/10-threat-model.md`, and phase 14 findings.

## Tasks

- [ ] Define content-free diagnostic fields.
- [ ] Add local log rotation.
- [ ] Add worker restart handling.
- [ ] Add model-timeout handling.
- [ ] Add settings corruption recovery.
- [ ] Add offline behavior tests.
- [ ] Add timing performance measurements.
- [ ] Add memory-use measurements.
- [ ] Add a user-readable diagnostics screen.
- [ ] Verify logs contain no characters or clipboard text.

## Stop condition

Disable diagnostics if privacy tests fail.

## Evidence

Keep benchmark commands, redacted sample logs, failure tests, and recovery results beside the implementation.
