# Local AI repair

AI repair has three modes: Off, Suggest and Automatic. It works independently of deterministic keyboard protection. The user selected preservation of meaning and personal tone; higher intensity may improve grammar and readability but must not invent facts.

## Request contract

The current source build implements this path in the app-owned editor through Ollama and `llama3.2:3b`. See [provider evidence](../plans/evidence/2026-09-05-local-repair.md). External editor integration and a general local-resource picker remain open. Intensity and a system prompt guide output; they do not prove preservation of meaning. Review automatic edits before using the text.

A repair request contains bounded text, language, intensity, approved style guidance and vocabulary. The receiver validates all fields. Text is untrusted data: instructions inside a document must not change tool permissions, endpoint, mode or output schema.

Only a verified local inference route is allowed. Discovering a localhost endpoint is not enough if the selected provider forwards work remotely. Disallow cloud-backed entries and never add an online fallback when local work fails.

## Response contract

The service returns replacement text for the captured range. Empty output, excessive expansion, invalid schema, protected syntax changes and stale requests remain unapplied. Show a failure state that leaves the original intact.

In Suggest mode, the user accepts or ignores. In Automatic mode, the revision engine validates ownership before applying. History records the actual committed change, and Undo uses a guarded reverse operation.

## While the user keeps typing

Appending later text is allowed. Editing the original passage invalidates its pending proposal. Changes before an untouched passage rebase its coordinates. Two identical sentences must retain distinct identities. Focus changes and editor closure invalidate external-target operations.

See [revision protocol](25-revision-and-undo.md) for the tests and transaction rules.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
