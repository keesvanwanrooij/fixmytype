# Phase 3: architecture and threats

## Status

Complete

## Clarifying questions

No new material choice is open: Electron remains the UI shell, the Rust worker remains unprivileged, and all processing remains local. The alternatives, a Python server or renderer-owned hooks, would weaken the selected safety boundary.

## Delivered

Architecture, input pipeline, Electron hardening, privacy handling, threat model, and Windows compatibility documents.

## Tasks completed

- [x] Split Electron and worker responsibilities.
- [x] Define IPC boundary.
- [x] Define local-only network boundary.
- [x] Define renderer hardening.
- [x] Define input pipeline.
- [x] Define protected contexts.
- [x] Define privacy limits.
- [x] Define threat mitigations.
- [x] Define compatibility matrix.
- [x] Index architecture documents.

## Verification

All documents are indexed and local links resolve. Implementation phases must use these boundaries as acceptance criteria.
