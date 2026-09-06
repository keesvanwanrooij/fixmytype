# Changelog

All notable user-visible changes to FixMyType will be documented here. This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Settings keeps its save confirmation visible and translated when you change the interface language.

- Local AI replies have streaming size limits and strict replacement fields. Cancellation and vocabulary changes discard pending results; cancelling through AI Off also clears the waiting message.

- The app-owned repeated-letter filter preserves Shift, untrusted events and missing physical-key metadata.

- The Local setup recheck button now has 24px of space above it, verified in Dutch and English.

- The Rust policy preserves unknown modifier bits, equal timestamps and disabled or unrepresentable timing windows. Debug output no longer exposes key codes or event timestamps.

- Settings no longer reports a successful save when local storage rejects the write.
- Tray actions and tooltip follow the Dutch or English interface setting.

- The Electron source build now loads its bundled Settings screen from relative asset paths.
- The sandboxed Electron preload now uses CommonJS, so the Settings screen receives its safe desktop bridge.

### Added

- Dictation offers opt-in Dutch and English paragraph, line and punctuation commands. Literal mode stays the default. Formatted transcripts retain recognized text in session history and use guarded Undo.

- The writing workspace exports a new Word document with paragraphs, tabs and Unicode intact. Save and Open are separate actions, and existing files are never overwritten.

- Settings offers Dutch and English key calibration with explicit pair labels, Rust proposals, accepted per-key levels, cancellation and removal. Raw intervals are not persisted.

- Target leases keep delayed corrections from applying after the chosen text field changes. Protected and unsupported targets receive no write capability.
- An idle Rust metadata worker has bounded messages, parent-owned cancellation and tested crash, restart and quit handling. Native input suppression remains unconnected.

- Rust sensitivity validation and bounded, explicitly labelled calibration summaries. These remain advisory until connected to a confirmed calibration workflow.

- A writing workspace with AI Off, Suggest and Automatic modes, local Ollama repair, guarded history and Undo.
- Local Whisper dictation with explicit microphone capture, a stop/cancel banner and session cleanup.
- Repeated-letter filtering inside the writing editor, five sensitivity levels, four profiles and configurable shortcuts.
- A checked speech setup script, a Windows source launcher and real-engine workflow tests with fake microphone input.

- A local Settings screen in Dutch and English with separate repair-language selection.
- A persisted protection preference that stays clear about the planned input filter.
- A tray pause or resume control for that preference and a bottom Support FixMyType button.

### Changed

- Completed-sentence scheduling no longer waits for later typing to stop. Late edits preserve later text and cursor position.
- Delivery status distinguishes app-owned functionality from pending system-wide protection, speech commands and companion work.

- Contributor workflow now requires material phase questions with clear options and consequences, and a verified GitHub push as build-loop step 8.

## [0.1.0] - 2026-09-04

### Added

- Public Apache-2.0 repository foundation with trademark clarification.
- Donation, security, conduct, contribution, and issue-reporting routes.
- Root, documentation, planning, and AI navigation for people and machine readers.
- Initial delivery planning and test-first collaboration rules.
