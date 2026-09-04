# Optimization: short title

## Status

Planned

## User value and metric

Name the user-visible cost, the exact metric, the baseline command, and the baseline result. Do not optimize an unmeasured claim.

## Scope and non-goals

State which component may change, what correctness rule must remain unchanged, and what this work will not alter.

## Method

- [ ] Record a repeatable baseline with machine and app version.
- [ ] Write a regression test or benchmark before changing the implementation.
- [ ] Make one measured change at a time.
- [ ] Compare the result against the baseline and record variance.
- [ ] Run functional, privacy, and text-safety checks after the measurement.

## Evidence and decision

Record commands, measurements, trade-offs, regression risk, commit, and whether the change ships or is reverted.
