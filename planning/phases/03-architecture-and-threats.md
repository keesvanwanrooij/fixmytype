# Phase 3: architecture and threats

## Status

Complete

## Clarifying questions

No new material choice is open: Electron remains the UI shell, the Rust worker remains unprivileged, and all processing remains local. The alternatives, a Python server or renderer-owned hooks, would weaken the selected safety boundary.

## Delivered

Architecture, input pipeline, Electron hardening, privacy handling, threat model, and Windows compatibility documents.

## Verification

All documents are indexed and local links resolve. Implementation phases must use these boundaries as acceptance criteria.
