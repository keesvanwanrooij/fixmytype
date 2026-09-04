# Local runtime setup and scheduling

Setup discovers compatible local components before offering downloads. Show executable identity, version, required files, readiness and measured constraints. Do not equate an installed service with a completed feature integration.

## Guided setup

Downloads require an explicit button and show size, purpose, source and disk use. Pin artifact versions and verify checksums before publishing files. Reject path traversal during extraction. Cancellation removes partial downloads but leaves the previous working installation intact.

Repair uses a verified local Ollama provider. Transcription uses a local Whisper-compatible worker. Narration uses offline Windows voices. Screen interpretation is a separate optional local capability. A provider cannot substitute cloud processing when resources are unavailable.

## Hardware baseline

The development machine has an i5-14400F, about 32 GB system RAM, and an RTX 4060 with about 8 GB VRAM. Treat these as measured local facts, not claims about another user's machine. Setup should detect hardware and present conservative defaults.

## Queue policy

Microphone capture and UI input remain responsive independently of inference. Explicit dictation outranks background narration. Text repairs are cancellable by document and range. New work that replaces an old task cancels that task instead of accumulating it.

Bound concurrency, queue length, text size, image size and recording duration. Show waiting state. On exhaustion, preserve the draft and report which task is waiting. Never terminate another application's inference task.

## Tests

Test cancellation while queued and running, queue capacity, out-of-order completion, service exit, failed download verification and retry. Measure cold and warm inference separately. Record baseline and changes in plans/optimizations.

## References

The implementation follows the [whisper.cpp project](https://github.com/ggml-org/whisper.cpp) for local speech execution and the [Ollama API](https://docs.ollama.com/api/introduction) for local request contracts. Verify the installed versions before relying on a flag or response shape.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
