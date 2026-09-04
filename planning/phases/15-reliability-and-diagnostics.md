# Phase 15: reliability and diagnostics

## Goal

Make failures recoverable and diagnosable without storing user text.

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
