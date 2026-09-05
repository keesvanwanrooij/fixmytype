# Visible key calibration: first phase-5 slice

Date: 2026-09-06. Checkpoint: `cbee5b1`. Windows build 26200. The user's existing draft and app profile were not touched. The root untracked package-lock file remains outside this work.

## Delivered

Settings has a visible A–Z key exercise in Dutch and English. Each pair is labelled by the user as unwanted or deliberate. The Rust input core proposes a level only when at least ten samples in each group can be separated by an existing timing window. Accept stores only a per-key level and aggregate counts. Cancel, new exercise and unmount discard temporary timings. Removal restores general sensitivity for that key.

The worker receives only bounded interval/intent pairs. Calibration does not start native observation, install a hook or persist settings. Main and renderer validate the proposal separately. The owned editor uses an accepted key's level, while pause and profile exclusions still take precedence.

## Red and green evidence

- The existing filter test failed because Shift and untrusted events could be suppressed. The filter now requires trusted, complete keyboard metadata and preserves modifiers.
- Calibration capture and storage tests first failed because their module did not exist. They pass for pair bounds, holds, modifiers, alternative keys, invalid clocks, cancellation, bounded aggregate records and storage failure.
- A cleanup test exposed object-to-string coercion in malformed labels. Validation now checks the string type before membership and returns false instead of throwing.
- The Rust calibration protocol test failed with `INVALID_MESSAGE` before the new operation existed. It now returns level 2 for ten 12ms unwanted intervals and ten 40ms deliberate intervals, without changing idle state. A later null-field test failed before the strict deserializer was added.
- The real child-owner test failed before it sent the calibration payload and validated the extended reply. It now passes through the actual Rust executable.
- The rendered test failed because the panel was missing. The first input simulation needed an acknowledgement per delivered event to keep its synthetic clock deterministic. It now exercises twenty labelled pairs, review without saving, a denied storage write, successful explicit acceptance, cancellation and removal.
- A screenshot review found default browser button styling. A new hit-area assertion failed before the controls reused the existing button styles. The Dutch active exercise was rendered and inspected after the fix.

## Verified checks

The desktop suite passes 78 tests across 19 files. Rust passes 22 tests. Desktop lint, production build, Rust formatting and clippy pass. The real Electron calibration, phase-2 and target/lifecycle checks pass. The local AI and fake-microphone-to-Whisper workflow still passes. The repository documentation checker validates links and phase numbering.

The calibration integration check uses real Chromium keyboard events with a controlled synthetic timestamp getter. It verifies that accepted KeyA level 2 suppresses a 12ms repeat while an uncalibrated KeyB keeps general level 1 and preserves the same interval. Shift and pause preserve input. All corresponding key-up events remain unprevented. This is evidence of the DOM input path, not a native Windows hook or a hardware measurement.

Run `npm run build`, `npm run test:calibration`, `npm run test:phase2`, `npm run test:targets` and `npm run test:workflow` from apps/desktop. The workflow requires the already installed local runtimes and public audio fixture. `FIXMYTYPE_CAPTURE=1` also captures the synthetic Dutch calibration screen under the ignored .cache folder. Run Rust checks and `node scripts/check-docs.mjs` from the repository root.

## Physical feedback needed

1. Try one genuinely damaged key in Settings. Do not deliberately create unwanted samples. Report whether the labels match what the keyboard did and whether the proposal is understandable.
2. After accepting a proposal, type normal Dutch and English doubled-letter words, alternate keys and held keys in Write. Check that intended input survives. Pause and remove the setting if it does not.
3. Dictate a short draft, correct it, use Undo and copy it to your normal editor. This first-user microphone check still requires your explicit action.
4. Check the interface with Windows Accessibility Text size at 200 percent. Report any clipped or unreachable control. This is the remaining phase-2 acceptance row.

Native suppression, per-application exclusions, hook lifetime measurements and physical keyboard acceptance remain open in phase 5. No system-wide protection claim is added.

Navigation: [project home](../../README.md), [documentation](../../docs/README.md), [plans](../README.md), [phase 5](../phases/05-safe-chatter-protection.md).
