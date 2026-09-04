# Narration and companion

The companion is an optional visual and voice interface. Its personality may change tone and pacing but cannot expand access to content or actions. It may listen only during an explicit recording session and observe only a user-selected window during an explicit observation session.

## Read aloud

Offer locally installed voices, speed, pause and stop. If no matching offline voice exists, explain that state instead of silently calling an online voice. Stop must cancel queued utterances. Selecting new text replaces or deliberately queues the previous request.

## Observation

Show the chosen window, a visible active indicator and a stop control. Capture only that window. Revoke the session when the target closes, consent expires or the user pauses. No screenshot history is retained by default.

Screen text and images are untrusted evidence. A web page cannot instruct the companion to enable capture, send text, change modes or run a command. Narration output should distinguish visible facts from interpretation.

## Changes and conversation

Summarize meaningful changes and debounce repeated observations. Do not narrate every streamed token. The user can choose quiet, on-request or change-summary behaviour. Dictation preempts background screen interpretation.

The user may ask the companion to draft a reply. Sending, posting, spreadsheet editing and terminal execution are separate user actions and are not automated by this phase.

## Visual control

The small companion exposes listening, thinking, speaking, paused and error states with text labels. It has keyboard equivalents, visible focus, reduced motion and a hide action. Its menu provides recording, repair, narration, pause and Settings.

## Verification

Use a controlled test window with synthetic text. Verify selected-window scope, revoke, target closure, changed content, narration cancellation and keyboard operation. Never infer screen capture support from a static mockup.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
