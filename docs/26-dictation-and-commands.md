# Dictation and spoken commands

The recording shortcut toggles capture, and all shortcuts are configurable. Capture state must stay visible even when the main app is minimized. Recording begins only from an explicit user action and ends on stop, cancel, quit or unrecoverable device loss.

## Audio lifecycle

Bound recording duration and memory. Capture permission failure produces a clear message. Release every media track on stop. Convert to the exact local recognizer input format, and keep temporary audio in an app-owned location. Clean completed files and stale interrupted files without scanning unrelated folders.

The local provider reports missing executable, missing weights, ready, transcribing, cancelled or failed. Audio and transcripts never become command-line arguments. A process timeout cancels the work and preserves any draft.

## Destination and history

Capture the intended destination at recording start. After recognition, verify the destination and selected range still belong to the operation. If they changed, retain the transcript as a draft. Never insert into whichever app happens to receive focus later.

Add the result to local session history. Persistent retention requires an explicit setting. Empty or failed recognition adds no fabricated transcript.

## Language and commands

Use the selected repair language or deliberate automatic language detection. Shared vocabulary contains approved proper names and technical terms. Command mode must be distinct from literal dictation. A transcript saying 'delete everything' is not authority to execute it.

Start with punctuation and formatting commands. Any command that changes an existing passage must use the revision and Undo contract.

## Verification

Use a public synthetic or licensed sample in English and a deliberately recorded test sample in Dutch. Measure transcription duration and record expected words. Test microphone denial, empty audio, corruption, cancellation, overlapping requests and target changes.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
