# Phase 19: public release

## Status

Planned

## Outcome

FixMyType publishes a verified Windows release with an installer, checksums, accurate documentation, support routes, an annotated tag, and a clear statement of supported and excluded contexts.

## User value

People can find, install, verify, use, remove, and support the app without being misled about its current limits.

## Read first

- [Root README](../../README.md)
- [Installation](../../docs/16-installation.md)
- [Windows compatibility](../../docs/11-windows-compatibility.md)
- [Donations and sustainability](../../docs/22-donations-and-sustainability.md)
- Phase 18, [Release candidate](18-release-candidate.md)

## Scope

Complete the release checklist, inspect the repository, update public status and installation documents, build the approved installer, publish checksums, create an annotated tag and GitHub release, and monitor security and support routes.

## Non-goals

No feature development, no compatibility expansion, no unreviewed dependency update, no paid tier, no cloud service, and no public claim based on unverified future work.

## Dependencies and handoff

| Depends on | Why it must exist first |
|---|---|
| Phases 1 to 18 | Every release gate and candidate result must be complete and recorded. |

| Unblocks | What this phase makes possible |
|---|---|
| Post-release maintenance | Bug-fix, optimisation, and support work against a tagged public version. |

## Decisions required at phase start

Confirm release version, release title, supported-context wording, signing state, and whether the candidate is approved for publication. Do not infer approval from a green workflow.

## Work packages

### Package 1: final release review

- [ ] Confirm every required prior phase row, matrix row, CI run, installer result, and critical report disposition has evidence.
- [ ] Review `git status`, commit history, ignored files, dependency alerts, secrets, license notices, and public links.
- [ ] Re-run the release command set from the approved commit.
- [ ] Stop for any discrepancy between package checksum, source SHA, documentation version, or candidate evidence.

### Package 2: public documentation

- [ ] Update README status, source-run command, supported and excluded contexts, and donation link.
- [ ] Update installation, configuration, troubleshooting, FAQ, security, and support pages with only verified behaviour.
- [ ] Update `CHANGELOG.md` with user-visible changes and known limitations.
- [ ] Verify every README still links to the root README, documentation hub, and planning index.

### Package 3: release artifact

- [ ] Build the approved installer from the approved source commit.
- [ ] Generate and independently verify SHA-256 checksums.
- [ ] Create an annotated version tag with release date and source commit.
- [ ] Create GitHub release notes with install steps, checksum instructions, supported contexts, exclusions, reporting routes, and donation link.

### Package 4: early maintenance

- [ ] Verify published links, download, checksum, install, start, tray quit, and uninstall from a clean Windows environment.
- [ ] Monitor security alerts and support routes using the documented triage policy.
- [ ] Open a bug-fix record for every reproducible report and prioritise text-loss, privacy, security, startup, and installation issues.
- [ ] Record release URL, tag, checksum, checks, and first review date in the implementation record.

## Required tests

- Full CI and dependency audit pass from the tagged commit.
- Installer checksum verifies on a clean Windows environment.
- Public install, first start, supported path, exit, uninstall, and support links are checked from published assets.
- All public compatibility statements map to phase-14 or phase-18 evidence.

## Acceptance evidence

Record tag, GitHub release URL, installer filename, checksum, source SHA, CI run URL, clean-machine verification, documentation-link check, current dependency-alert state, and explicit maintainer release approval.

## Windows checks

Use the public asset, not a development build. Install on a clean environment, verify checksum first, launch the app, inspect Settings and tray state, run one supported synthetic script, quit, uninstall, and confirm the documented data result.

## Traps

- A tag made before the installer or checksum is verified is not a release record. Tag only the approved artifact commit.
- A public README can accidentally claim experimental or unsupported repair behaviour. Compare every claim with the matrix.
- Support links that work in a checkout can be broken in the published release. Check them after publication.

## Stop condition and rollback

Do not publish when any critical text-loss, privacy, security, startup, install, checksum, or documentation defect remains open. If a published artifact is unsafe, withdraw the download, state the affected version, preserve the evidence, and publish a fixed replacement only after repeating the relevant gates.

## Implementation record

No public release exists. Record approval, tag, release URL, artifact checksum, source commit, verification environment, open known limitations, and next maintenance review.
