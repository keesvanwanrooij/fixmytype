# Phase 12: selected-text repair

## Goal

Offer explicit, local, previewable repair for a selected text range.

## Read first

`docs/09-privacy-and-data-handling.md`, `docs/19-local-ai-repair.md`, and phase 11.

## Tasks

- [ ] Define the selection boundary and supported controls.
- [ ] Define the loopback-only Ollama contract.
- [ ] Write a failing unavailable-model test.
- [ ] Write a failing original-text-preserved test.
- [ ] Add local model availability check.
- [ ] Add repair-language selection.
- [ ] Add level 1 through 5 prompt contracts.
- [ ] Add a preview screen.
- [ ] Add apply and single Undo actions.
- [ ] Verify no text is logged or sent remotely.

## Stop condition

No automatic replacement ships in this phase.

## Files and evidence

Modify the Electron main process, preload contract, Settings UI, repair tests, privacy documentation, and compatibility matrix. Capture a test proving unavailable Ollama preserves original text.
