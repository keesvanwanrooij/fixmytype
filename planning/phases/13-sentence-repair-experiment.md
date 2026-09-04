# Phase 13: sentence-repair experiment

## Status

Planned

## Outcome

FixMyType can evaluate an explicitly enabled, allowlisted post-sentence suggestion in a small set of supported applications. It never presents this experiment as general automatic repair.

## User value

Some users may want help after a sentence boundary, but the project tests this carefully before promising behaviour that can alter text across applications.

## Read first

- [Decision log](../../docs/04-decision-log.md)
- [Local AI repair](../../docs/19-local-ai-repair.md)
- [Windows compatibility](../../docs/11-windows-compatibility.md)
- Phase 12, [Selected-text repair](12-selected-text-repair.md)

## Scope

Create an experiment flag, explicit app allowlist, user confirmation, visible suggestion surface, latency measurements, one exact Undo path, and a compatibility record. Keep every experiment artefact isolated so it can be removed.

## Non-goals

No default activation, no all-application automation, no hidden replacement, no password or secure-desktop use, no cloud fallback, and no broad compatibility claim.

## Dependencies and handoff

| Depends on | Why it must exist first |
|---|---|
| Phase 12 | It provides a local request path, preview, Apply, and exact Undo rule. |
| Phase 14 | It will independently assess accessible and compatible behaviour. |

| Unblocks | What this phase makes possible |
|---|---|
| Phase 15 | Measured local latency and failure behaviour for repair. |
| Phase 18 | A narrow beta test only if the experiment survives its stop condition. |

## Decision required at phase start

The maintainer approves the initial supported-app allowlist and the meaning of sentence boundary before code runs.

| Option | Consequence |
|---|---|
| One controlled editor | Lowest compatibility risk and recommended first experiment. |
| Notepad plus one Chromium editor | More useful evidence but adds target-selection and browser variation risk. |
| Any foreground application | Not permitted. It would overclaim support and widen text-loss risk. |

## Work packages

### Package 1: experiment boundary

- [ ] Create an off-by-default experiment flag separate from selected-text repair.
- [ ] Write the signed-in or application-identification boundary without storing window title or text.
- [ ] Add an explicit allowlist and test that every other application receives no suggestion.
- [ ] Write user-facing copy that says experiment, supported app, and Undo before enablement.

### Package 2: suggestion and rejection path

- [ ] Write failing tests for no selection, unavailable local Ollama, no allowlist match, rejected suggestion, and stale target.
- [ ] Detect only the approved sentence boundary and send no request until the user enables the experiment.
- [ ] Present the proposal without replacing text.
- [ ] Give Reject equal prominence and verify it leaves text unchanged.

### Package 3: exact application and Undo

- [ ] Write failing tests for Apply and exact Undo in each allowlisted application adapter.
- [ ] Apply only to an unchanged target range after the user selects Apply.
- [ ] Disable the experiment for an adapter that cannot prove exact Undo.
- [ ] Measure local request and preview latency with synthetic test text.

### Package 4: evidence and removal path

- [ ] Record app version, adapter version, language, result, latency, and limitation for every test.
- [ ] Keep experiment code, settings, fixtures, and documentation in clearly named files.
- [ ] Run Electron, Rust, and privacy checks after cleanup.
- [ ] Update compatibility documents, phase evidence, changelog if the experiment remains enabled, commit, and push.

## Required tests

- Default state, unsupported app, no selection, stale selection, unavailable service, and rejection preserve text.
- A supported app only receives a proposal after explicit enablement and sentence boundary.
- Apply and Undo prove exact original text restoration in each allowlisted adapter.
- Non-loopback and logging guards remain green.

## Acceptance evidence

Run the phase-12 command set, the experiment adapter tests, and the supported-app manual script. Expected: the experiment stays absent outside the allowlist, and every approved application can reject, apply, and undo the synthetic sentence exactly.

## Windows checks

For every allowlisted app, record the app version, Windows version, keyboard layout, sentence sample, proposal result, Reject result, Apply result, Undo result, and measured latency. A failed app is removed from the allowlist.

## Traps

- A sentence boundary is not a licence to rewrite. The proposal must stay visible until Apply.
- An allowlist keyed only by a friendly window label is weak and may match the wrong application. Use the smallest verified application identity available.
- A low latency result does not offset an Undo failure. Text restoration is the gate.

## Stop condition and rollback

Remove the experiment flag and adapter when exact Undo fails, selection identity is not reliable, or the experiment changes text in an unsupported app. Keep only anonymised compatibility evidence.

## Implementation record

No implementation has started. Record the approved allowlist, app-identity method, measured latency, and removal decision for every failed adapter.
