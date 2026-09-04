# User problem and safety invariants

Keyboard chatter is irregular. A user may need repeated letters in words such as “letter”, “hello”, or “coffee”, while a damaged switch may create the same repeat accidentally. FixMyType must treat uncertainty as a reason to preserve input, not as permission to delete it.

## Safety invariants

1. Never intentionally inspect or change password fields, the secure desktop, or elevated-app input.
2. Never send typed text, clipboard data, audio, or diagnostics to a remote service.
3. Never suppress input when the filter cannot identify its own injected event or cannot make a confident local decision.
4. Always offer a fast global pause and an Undo for any change that reached the focused app.
5. Keep an opt-in local diagnostic record free of content; it may record an event type and timing but never typed characters.
6. A repair suggestion must show its scope and be reversible before a more automatic mode can be considered.

## Harm cases to test

- Intentional doubled letters remain intact.
- Shortcut combinations and modifier keys are never filtered.
- A disabled setting changes no input.
- A local model failure leaves the original text untouched.
- A user can stop protection without needing the app window.

Start at [README.md](../README.md), continue through [docs/README.md](README.md), and follow [planning/ROADMAP.md](../planning/ROADMAP.md).
