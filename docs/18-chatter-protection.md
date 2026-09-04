# Chatter protection

A damaged keyboard may repeat the same switch or produce neighboring characters. Timing can help identify a repeat, but it does not reveal which word a user intended. Deterministic protection therefore preserves uncertain input and remains separate from AI repair.

## Levels and calibration

Levels 1 through 5 control conservative timing sensitivity. The numeric timing values used in tests are synthetic, not field-verified hardware defaults. Calibration gathers visible timing summaries for problem keys, including intentional double letters, and shows a proposal before saving.

Modifiers, shortcut combinations, injected events, composition and unknown flags must preserve input. Key-up handling must never leave a key logically held. A missing or stale target context prevents suppression.

## Native boundary

The Rust classifier returns advice and does not own a hook. Native suppression requires additional verification that the target, context, event origin and key lifetime are valid. A global pause must stop the active path immediately.

Per-application support and exclusions are visible. Code and spreadsheet profiles prioritize literal input. Protected targets receive no automatic filtering based on an application name alone.

## Verification

Use synthetic presses around each timing boundary and a physical test of deliberate doubled letters. Test key hold, rapid alternate keys, modifiers, pause, worker crash and target change. Report actual dropped or preserved events, never a claim based only on classifier output.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
