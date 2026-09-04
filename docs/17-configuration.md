# Configuration

The app's Settings screen owns interface language, repair language and all shortcut configuration. Dutch and English are separate from the language being repaired. Changing the interface must not rewrite user text or change the repair language.

## Typing and AI

Protection has an enabled state and sensitivity 1 through 5. Calibration can propose per-key adjustments. AI mode is Off, Suggest or Automatic. Changing to Off cancels queued repair jobs; it must not silently change protection or dictation.

A context profile chooses prose, prompt, code or spreadsheet rules. Profile matching does not by itself prove that an external control supports editing. Protected syntax remains excluded even when a user raises sensitivity.

## Personalization

The style card holds approved instructions and examples. Vocabulary stores terms that should retain their spelling. Both are editable and removable. The companion's personality controls delivery, not permission to take actions.

## Shortcuts and appearance

Shortcut changes validate conflicts and report Windows registration failure. The previous working set remains active if replacement fails. The companion can be hidden, and reduced motion is respected. The footer retains Support FixMyType.

## Storage

Keep preferences in a versioned schema with explicit migrations. Preserve valid v1 language choices when introducing new fields. A malformed record stays available for deliberate reset. Text history is a separate store with its own consent and retention controls.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
