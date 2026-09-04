# Bug-fix plans

This directory holds reproducible defects that need work beyond a tiny correction. Start from the [root README](../../README.md), read [docs/README.md](../../docs/README.md), and place the fix against the current [plans/README.md](../README.md).

Each record must include safe reproduction steps, expected and actual behavior, safety impact, a failing regression test, the smallest fix, verification after cleanup, and user-visible release notes where relevant. Never include private text, passwords, or recordings.

## Records

| Record | Status | Summary |
|---|---|---|
| [001-electron-relative-renderer-assets.md](001-electron-relative-renderer-assets.md) | Fixed | Electron opened a blank Settings window because the renderer bundle used absolute file paths. |
| [002-sandboxed-preload-commonjs.md](002-sandboxed-preload-commonjs.md) | Fixed | Electron rejected the ES-module preload, leaving the Settings screen without its desktop bridge. |
