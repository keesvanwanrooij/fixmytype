# Phase 12: selected-text repair

## Status

Planned

## Outcome

Users can explicitly send a selected text range to a local Ollama service, inspect a proposed Dutch or English repair, apply it once, and undo the exact replacement once. The original remains available until the user chooses Apply.

## User value

People with damaged keyboards can ask for help after they finish a selected fragment, without turning ordinary typing into invisible automatic rewriting.

## Read first

- [Privacy and data handling](../../docs/09-privacy-and-data-handling.md)
- [Threat model](../../docs/10-threat-model.md)
- [Local AI repair](../../docs/19-local-ai-repair.md)
- [Configuration](../../docs/17-configuration.md)
- Phase 11, [Safe chatter protection](11-safe-chatter-protection.md)

## Scope

Add a local-only Ollama availability check, a versioned loopback request contract, level 1 through 5 repair rules, a selected-text preview, Apply, one exact Undo, error states, and privacy evidence. Keep request content in memory only for the active user action.

## Non-goals

No automatic sentence replacement, background analysis, cloud fallback, history of typed text, telemetry, account, cross-device sync, or use in unsupported applications. Phase 13 owns a separate post-sentence experiment.

## Dependencies and handoff

| Depends on | Why it must exist first |
|---|---|
| Phase 8 | It provides separate UI and repair language choices. |
| Phase 11 | It establishes the separate deterministic protection layer and visible state language. |

| Unblocks | What this phase makes possible |
|---|---|
| Phase 13 | A reversible selected-text path and local request contract. |
| Phase 15 | Local failure and timeout handling for the repair path. |

## Decisions already made

- Repair is explicit, local, previewable, and undoable. It is disabled by default.
- Only loopback Ollama may be contacted after the user enables repair. No remote fallback exists.
- Interface language and repair language remain separate.
- Levels 1 through 5 change the repair instruction, not whether the app may silently replace text.

## Work packages

### Package 1: define local contract and failure states

- [ ] Write a typed request and response schema with request ID, repair language, level, original selection, proposal, and no persistence fields.
- [ ] Write failing tests for unavailable Ollama, malformed response, timeout, non-loopback endpoint, and rejected request.
- [ ] Implement a loopback-only client with short bounded timeout and no automatic retry of text.
- [ ] Add a test that network errors preserve the selected original text.

### Package 2: define repair levels and preview

- [ ] Write one documented contract for each level 1 through 5 with examples of allowed and disallowed change.
- [ ] Write failing tests that each level retains the original selection and keeps request language explicit.
- [ ] Add a preview state that displays original and proposal without applying either automatically.
- [ ] Make unavailable-service and malformed-response messages clear in both interface languages.

### Package 3: apply and exact undo

- [ ] Define supported selection controls and the boundary where an app cannot supply a reliable selection.
- [ ] Write failing tests for Apply, rejected proposal, one Undo, repeated Undo, and changed target text.
- [ ] Apply only after a user action and store the exact pre-apply range in memory for one Undo.
- [ ] Disable Apply when the target selection no longer matches the original boundary.

### Package 4: privacy and live proof

- [ ] Verify request logs, diagnostics, and crash reports contain no original or proposed text.
- [ ] Run one local Ollama fixture and one unavailable-service fixture without network access.
- [ ] Test Dutch and English repair language separately from the interface locale.
- [ ] Update privacy, configuration, repair docs, phase evidence, changelog, commit, and push.

## Required tests

- An unavailable service, malformed response, timeout, rejected proposal, and changed target preserve the original.
- A preview never modifies its target.
- Apply changes only the exact selection after a click.
- One Undo restores exact original text and a second Undo cannot alter unrelated text.
- The request URL is loopback and no output or log contains selected text.

## Acceptance evidence

```powershell
Set-Location apps/desktop; npm run lint; npm run typecheck; npm test; npm run build
cargo test --workspace
```

Expected: tests name all failure-preservation and Undo cases. Live proof shows a selected Dutch and English fragment can be previewed, applied once, undone exactly, and rejected without change.

## Windows checks

Record the supported selection control, application version, interface language, repair language, level, original text, visible proposal, Apply result, Undo result, and absence of retained text after the action. Store only test text created for verification, never a user's private text.

## Traps

- A local endpoint can still become remote through a redirect or configurable host. Reject every non-loopback destination.
- An Undo that pastes at the current caret position is not an exact Undo. Verify the original target still matches.
- A preview that updates its target before Apply violates the product promise even if Undo exists later.

## Stop condition and rollback

Stop if exact Undo cannot be guaranteed in a supported control, if a request leaves loopback, or if diagnostics retain text. Disable the repair entry point and retain no request history.

## Implementation record

No implementation has started. Record the supported selection boundary, local Ollama version used for test fixtures, every failure-first test, and manual results.
