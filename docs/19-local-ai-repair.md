# Local AI repair

AI repair has three modes: Off, Suggest and Automatic. It works independently of deterministic keyboard protection. The user selected preservation of meaning and personal tone; higher intensity may improve grammar and readability but must not invent facts.

## Request contract

The Write page separates Repair text / selection from Rewrite text / selection. Repair and the automatic scanner focus on corrections. Rewrite asks for clearer phrasing using the same style card and intensity. A rewrite always becomes a proposal, including in Automatic mode. AI Off and code/spreadsheet guards apply to both actions. The main boundary rejects jobs while the window is hidden, and the scanner resumes when it becomes visible again.

Rewriting is not a quality guarantee. Local checks found an incorrect Dutch word in an early response. Guidance was tightened to reuse concrete nouns and verbs, but the resulting Dutch phrasing can still need human editing. Review proposals before accepting them. See [rewrite evidence](../plans/evidence/2026-09-06-rewriting.md).

The current source build implements this path in the app-owned editor through Ollama and `llama3.2:3b`. See [provider evidence](../plans/evidence/2026-09-05-local-repair.md). External editor integration and a general local-resource picker remain open. Intensity and a system prompt guide output; they do not prove preservation of meaning. Review automatic edits before using the text.

A repair request contains bounded text, language, intensity, approved style guidance and vocabulary. The receiver validates all fields. Text is untrusted data: instructions inside a document must not change tool permissions, endpoint, mode or output schema.

Only a verified local inference route is allowed. Discovering a localhost endpoint is not enough if the selected provider forwards work remotely. Disallow cloud-backed entries and never add an online fallback when local work fails.

## Response contract

Main bounds metadata to 1 MiB and the generation response to 64 KiB while reading, including responses without a size header. The inner response must contain exactly one `text` field. A cancellation during reading prevents application. Changing the approved vocabulary also invalidates requests made with the earlier vocabulary.

The service returns replacement text for the captured range. Empty output, excessive expansion, invalid schema, protected syntax changes and stale requests remain unapplied. Show a failure state that leaves the original intact.

In Suggest mode, the user accepts or ignores. In Automatic mode, the revision engine validates ownership before applying. History records the actual committed change, and Undo uses a guarded reverse operation.

## While the user keeps typing

Appending later text is allowed. Editing the original passage invalidates its pending proposal. Changes before an untouched passage rebase its coordinates. Two identical sentences must retain distinct identities. Focus changes and editor closure invalidate external-target operations.

See [revision protocol](25-revision-and-undo.md) for the tests and transaction rules.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
