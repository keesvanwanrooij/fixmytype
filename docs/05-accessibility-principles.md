# Accessibility principles

FixMyType is itself an accessibility tool, so its interface must reduce effort rather than demand precision.

## Principles

- Use clear words, large controls, visible keyboard focus, and short explanations.
- Keep protection status visible in the tray and Settings screen.
- Make every action usable with keyboard, mouse, and screen reader.
- Never rely only on colour to describe whether protection or repair is enabled.
- Use language that distinguishes a suggestion from a completed change.
- Provide Dutch and English UI, with no mixed-language controls.
- Keep the Support FixMyType control quiet, optional, and away from typing controls.

## Acceptance checks

Every user-visible phase includes keyboard-only navigation, Windows high-contrast review, 200% text scaling review, screen-reader labels for controls, and a Dutch/English wording review.

Return to [README.md](../README.md), [docs/README.md](README.md), or [plans/README.md](../plans/README.md).

## Workspace and companion acceptance

Every visible control has a name, state and keyboard path. A compact companion cannot be the only way to pause, dictate or stop speech. The user can hide it and disable motion. A moving indicator must have an equivalent text label.

Tab order follows the visible reading order. Dialogs restore focus to their launcher. Mode changes use plain descriptions of what will happen. Pending jobs and conflicts use status announcements without repeatedly stealing focus.

## Physical checks

Test English and Dutch labels at 100, 150 and 200 percent Windows scaling, with visible focus and high contrast. Browser zoom and DOM assertions cover only part of this evidence. Keep the untested physical matrix rows pending.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
