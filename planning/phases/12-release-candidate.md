# Phase 12: release candidate

## Status

⬜ Planned

## Outcome

A limited group can install a clearly labelled release candidate, follow a safe test script, report issues without private text, and receive a build that passed all prior gates.

## User value

Real Windows use finds compatibility and text-safety problems that synthetic tests cannot reveal. The candidate stays limited until those reports are understood.

## Read first

- [Security policy](../../SECURITY.md)
- [Troubleshooting](../../docs/20-troubleshooting.md)
- [FAQ](../../docs/21-faq.md)
- Phases 8 through 11 and their evidence

## Scope

Create a candidate checklist, safe tester script, anonymised feedback route, bug-fix records, triage rules, retest steps, final copy review, privacy review, and candidate freeze criteria.

## Non-goals

No public marketing claim, broad download link, feature addition, automatic data collection, or release tag. Phase 13 owns publication.

## Dependencies and handoff

| Depends on | Why it must exist first |
|---|---|
| Phases 8 to 11 | They provide accessibility, reliability, CI, and installer evidence. |

| Unblocks | What this phase makes possible |
|---|---|
| Phase 13 | A known candidate build and resolved critical issue list. |

## Decisions already made

- Text-loss, privacy, startup, install, and security reports receive first triage.
- Testers use synthetic sample text and never send private writing.
- A report without enough environment evidence remains open, not guessed away.

## Work packages

### Package 1: candidate and tester kit

- [ ] Select the CI-verified installer commit and checksum.
- [ ] Write a short script covering install, Settings, tray, supported protection, repair if enabled, pause, quit, uninstall, and rollback.
- [ ] State excluded contexts and exact stop instruction for unexpected text change.
- [ ] Provide the private vulnerability route and public bug route without requiring logs containing text.

### Package 2: triage and repair loop

- [ ] Create a bug-fix record for every reproducible report.
- [ ] Reproduce using synthetic text, environment matrix, and candidate checksum.
- [ ] Disable or remove a feature that causes text loss or privacy harm before seeking a broader test.
- [ ] Write regression tests first, fix, clean up, run CI, and rerun the exact tester path.

### Package 3: release review

- [ ] Re-run CI, dependency review, package verification, compatibility matrix, and diagnostics privacy tests on the candidate commit.
- [ ] Review Dutch and English copy for clear planned versus available claims.
- [ ] Review README, installation, security, support, FAQ, and troubleshooting links.
- [ ] Create a disposition list for every tester report: fixed, excluded, unreproducible with requested evidence, or deferred.

### Package 4: freeze decision

- [ ] Confirm no critical text-loss, privacy, startup, install, or security defect is open.
- [ ] Freeze feature scope and record the candidate SHA and checksum.
- [ ] Ask the maintainer for explicit approval to begin public-release steps.
- [ ] Commit evidence and push without creating a public tag.

## Required tests

- Every confirmed report gets a regression test where automation can express it.
- Candidate installer checksum and source SHA match CI evidence.
- The final matrix has no unreviewed critical row.
- Public documents make no claim beyond the accepted matrix.

## Acceptance evidence

Record candidate version, SHA-256, source SHA, CI run, tester-script version, tester environments, anonymised report dispositions, complete matrix result, and explicit maintainer approval.

## Windows checks

Each tester follows the same synthetic script. Capture installation outcome, app launch, visible state, supported input result, pause result, repair result when enabled, uninstall, and rollback. Do not collect their normal writing.

## Traps

- A quiet beta does not prove safety if testers lack a script or report route.
- Treating a text-loss report as a copy issue delays the only class of defect that must stop the candidate.
- A new feature after freeze invalidates candidate evidence.

## Stop condition and rollback

Stop the candidate and withdraw its download if a critical defect appears. Disable the affected feature or return to the last verified candidate. Never hide the report from the disposition record.

## Implementation record

No candidate exists. Record selected build, tester count without identifying people, report outcomes, fixes, matrix evidence, and approval decision.
