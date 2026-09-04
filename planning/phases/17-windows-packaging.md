# Phase 17: Windows packaging

## Goal

Produce a repeatable Windows installer and a documented signing and rollback path.

## Read first

Phase 16, `SECURITY.md`, and the current version and changelog.

## Tasks

- [ ] Choose installer technology.
- [ ] Define version source.
- [ ] Build a reproducible installer.
- [ ] Generate checksums.
- [ ] Document signing requirements.
- [ ] Test unsigned developer install.
- [ ] Test upgrade path.
- [ ] Test uninstall path.
- [ ] Document rollback.
- [ ] Verify no private data ships in package.

## Acceptance criteria

A clean Windows machine can install, start, update, and remove the app.

## Stop condition

Do not call an unsigned developer package a public release installer.
