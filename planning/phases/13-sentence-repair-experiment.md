# Phase 13: sentence-repair experiment

## Goal

Test explicit post-sentence suggestions without promising cross-application automation.

## Read first

Phase 12 and the decision log. This is an experiment, not a release promise.

## Tasks

- [ ] List supported applications before code.
- [ ] Keep the feature disabled by default.
- [ ] Add an app allowlist.
- [ ] Add an opt-in confirmation.
- [ ] Write a failing no-selection fallback test.
- [ ] Write a failing Undo test.
- [ ] Add a visible suggestion surface.
- [ ] Add rejection without modifying text.
- [ ] Measure latency locally.
- [ ] Record every compatibility limitation.

## Stop condition

Remove the experiment if Undo cannot restore exact text.

## Files and evidence

Keep experiment settings, allowlist, tests, latency measurements, and compatibility limits in separate files so the feature can be removed cleanly.
