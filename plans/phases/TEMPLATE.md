# Phase N: short title

## Status

⬜ Planned

## Outcome

State one observable result. A reader must be able to tell whether it happened without interpreting a vague claim.

## User value

Explain the user problem this phase reduces and link to the document that publishes the promise.

## Read first

- [Root README](../../README.md)
- [Documentation hub](../../docs/README.md)
- [Planning index](../README.md)
- The specific safety, architecture, and test documents for this phase.

## Scope

List the behaviour, data, and interfaces this phase may change.

## Non-goals

List adjacent work that remains out of scope and name the phase that owns it.

## Dependencies and handoff

| Depends on | Why it must exist first |
|---|---|
| Phase N | The prior contract or verified behaviour. |

| Unblocks | What becomes safe to start afterwards |
|---|---|
| Phase N | The next capability or release gate. |

## Decisions already made

List binding choices with the consequence. Do not reopen a decision that is already in [the decision log](../../docs/04-decision-log.md). If a missing choice materially changes safety, privacy, scope, or user-visible behaviour, ask the maintainer before implementation.

## Work packages

### Package 1: prepare and prove the rule

- [ ] Name the files to create or modify.
- [ ] Write and run the failing test for each failure-prone rule.
- [ ] Record why the test failed before implementation.

### Package 2: implement the smallest safe behaviour

- [ ] State the exact boundary the implementation must preserve.
- [ ] Add only the files and interface needed for this package.
- [ ] Run the focused test and the full relevant suite.

### Package 3: connect the user path

- [ ] Name the visible control, IPC action, or Windows path.
- [ ] Keep unsupported behaviour unavailable or clearly marked as planned.
- [ ] Test keyboard and error paths where the user can reach them.

### Package 4: clean up and record evidence

- [ ] Remove duplication, dead paths, unclear naming, and stale copy.
- [ ] Run every acceptance command after cleanup.
- [ ] Update docs, this plan, the changelog when user-visible, then commit and push.

## Required tests

List each test by behaviour, not only filename. Include the normal case, boundary case, malformed or unavailable input, and the case that would silently damage text.

## Acceptance evidence

```powershell
# Exact commands for this phase.
```

State the expected result for each command. Add the exact live Windows steps and what must be visible or preserved.

## Windows checks

| Environment | Steps | Expected result | Evidence |
|---|---|---|---|
| Windows version, app version, input context | Exact user actions | Observable result | Date and result |

## Traps

- Name a reasonable mistake, its symptom, and the evidence that catches it.
- State which unsupported context must remain unavailable.

## Stop condition and rollback

State the result that blocks promotion. State how to disable or remove the new path without deleting user data or hiding evidence.

## Implementation record

Add dated facts while building: test-first evidence, commits, Windows evidence, deferred work, and the next maintainer decision. Do not rewrite history to make a phase look complete.
