# Phase 17: Windows packaging

## Status

Planned

## Outcome

A repeatable Windows installer can install, start, upgrade, uninstall, and roll back FixMyType from a verified build. Each package has versioned checksums and an honest signing status.

## User value

People should not need development tools to try the app, and they should be able to remove it cleanly if it does not fit their system.

## Read first

- [Installation](../../docs/16-installation.md)
- [Security policy](../../SECURITY.md)
- [Release rule](../README.md#release-rule)
- Phase 16, [CI and supply chain](16-ci-and-supply-chain.md)

## Scope

Choose and document installer technology, establish one version source, build an installer from CI-verified inputs, generate checksums, document signing, test install and upgrade paths, test uninstall, and document rollback.

## Non-goals

No claim of signed public distribution before a real signing certificate and verification evidence exist. No auto-update channel, store listing, or release publication belongs here unless a later explicit decision adds it.

## Dependencies and handoff

| Depends on | Why it must exist first |
|---|---|
| Phase 16 | It provides a repeatable verified source and supply-chain gates. |
| Phase 14 | It provides the Windows contexts that the package must preserve. |

| Unblocks | What this phase makes possible |
|---|---|
| Phase 18 | Testers can receive a reproducible candidate package. |
| Phase 19 | The public release has an installable artifact and checksums. |

## Decision required at phase start

Choose installer tooling, signing state, and upgrade identifier with the maintainer. The chosen tool must support clean uninstall and a stable upgrade path without hidden online services.

## Work packages

### Package 1: package contract

- [ ] Record executable name, package ID, version source, install location, per-user or per-machine scope, data location, uninstall behaviour, and rollback strategy.
- [ ] Compare installer options against offline build, upgrade, uninstall, checksum, and signing requirements.
- [ ] Choose one tool and document why rejected options failed a required condition.
- [ ] Write a failing packaging smoke test or script for missing version and missing artifact inputs.

### Package 2: reproducible build and checksum

- [ ] Add package configuration that consumes the single version source.
- [ ] Build from a clean checkout after CI passes.
- [ ] Generate SHA-256 checksums and test a deliberate checksum mismatch.
- [ ] Verify no source map, user profile, test fixture, development path, or private data is inside the installer.

### Package 3: install lifecycle

- [ ] Test clean install on a Windows virtual machine or clean user profile.
- [ ] Test first start, tray exit, Settings persistence, supported feature state, and local data location.
- [ ] Test upgrade from the previous candidate without losing Settings or creating duplicate shortcuts.
- [ ] Test uninstall removes binaries and shortcuts while explaining what happens to local settings and diagnostics.

### Package 4: signing, rollback, and documentation

- [ ] Document unsigned developer-package warnings truthfully and separate them from public-release requirements.
- [ ] If signing exists, verify publisher, timestamp, and tamper failure on a clean machine.
- [ ] Test rollback to the prior package and record which data is retained.
- [ ] Update installation and troubleshooting docs, phase evidence, commit, and push.

## Required tests

- Missing version or artifact prevents a package build.
- A checksum mismatch is detected.
- Clean install, upgrade, uninstall, and rollback have separate recorded results.
- Package inspection contains no private or development-only data.

## Acceptance evidence

Record installer filename, SHA-256, source commit, Windows build, signing state, clean-install result, upgrade result, uninstall result, rollback result, and known warning. The package is not public until phase 19.

## Windows checks

Use a clean Windows environment and one upgrade environment. Capture visible installer and Windows trust messages. Test Settings persistence, tray quit, supported protection state, and removal without using private text.

## Traps

- A package that works on the build machine can depend on a local runtime or path. Clean-machine proof is required.
- An unsigned package must not be described as signed or release-ready.
- Uninstall can leave a worker registered or Settings in an unclear location. Verify both explicitly.

## Stop condition and rollback

Do not advance while installation, upgrade, uninstall, checksum, or signing-status evidence is missing. Withdraw a broken candidate, publish no download link, and preserve the source commit and test record.

## Implementation record

No packaging choice has been made. Record the chosen tool, package ID, version source, checksums, signing state, and clean-machine evidence.
