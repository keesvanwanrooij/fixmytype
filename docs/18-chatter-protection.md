# Chatter protection

A damaged keyboard may repeat the same switch or produce neighboring characters. Timing can help identify a repeat, but it does not reveal which word a user intended. Deterministic protection therefore preserves uncertain input and remains separate from AI repair.

## Levels and calibration

The owned editor uses windows of 8, 12, 18, 24 and 30 milliseconds for levels 1 through 5. These are development presets, not hardware-verified safety thresholds. Calibration uses the existing Rust summary function to propose the lowest level that covers the labelled unwanted intervals while remaining below every labelled deliberate interval.

## Calibrate one key

1. Open Settings and scroll to Key calibration. Choose a letter key and start the exercise.
2. Focus the marked test area and press the key once. If the keyboard generates another press, label that pair as unwanted. Otherwise press a second time deliberately and label the pair accordingly. Do not hold the key or use a modifier.
3. Discard a pair if you are uncertain about its label. Collect at least 10 unwanted pairs and 10 deliberate pairs. The exercise allows at most 60 labelled pairs. If a key does not repeat by itself, do not manufacture unwanted samples. Leave it unchanged.
4. Review the proposal. Insufficient, overlapping or unsupported timings produce no setting to accept. Review alone does not save anything.
5. Accept the proposed setting only if the labels describe your actions. The app saves the selected physical key, level and two counts. Individual timings are not saved. Cancel or leave Settings to discard the current exercise.
6. Test normal words in Write. An accepted key setting overrides general sensitivity for that key. Remove it from Settings to return to the general level. Pause still preserves every event.

Only A–Z physical key codes are offered in this slice. Their displayed letters assume a QWERTY layout; other layouts still need explicit evidence. Key hold, modifiers, composition, untrusted events and missing key metadata preserve input. The exercise measures inside FixMyType only, not in another app.

Chromium can distinguish script-dispatched key events, but its trusted-event flag does not prove a physical hardware origin. Detection of Windows-injected input belongs to the pending native path. Do not treat the DOM fixture as that evidence.

Accepted summaries use `fixmytype:calibration:v1` in local app storage, separate from preferences. Read failure or corrupt data does not erase the original bytes. A failed save leaves the prior accepted settings unchanged and shows an error. There is no automatic training from normal writing. See [the verification](../plans/evidence/2026-09-06-calibration.md).

Modifiers, shortcut combinations, injected events, composition and unknown flags must preserve input. Key-up handling must never leave a key logically held. A missing or stale target context prevents suppression.

## Native boundary

The Rust classifier returns advice and does not own a hook. Native suppression requires additional verification that the target, context, event origin and key lifetime are valid. A global pause must stop the active path immediately.

Per-application support and exclusions are visible. Code and spreadsheet profiles prioritize literal input. Protected targets receive no automatic filtering based on an application name alone.

## Verification

Use synthetic presses around each timing boundary and a physical test of deliberate doubled letters. Test key hold, rapid alternate keys, modifiers, pause, worker crash and target change. Report actual dropped or preserved events, never a claim based only on classifier output.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
