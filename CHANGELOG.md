# Changelog

All notable user-visible changes to FixMyType will be documented here. This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- The Electron source build now loads its bundled Settings screen from relative asset paths.
- The sandboxed Electron preload now uses CommonJS, so the Settings screen receives its safe desktop bridge.

### Added

- A local Settings screen in Dutch and English with separate repair-language selection.
- A persisted protection preference that stays clear about the planned input filter.
- A tray pause or resume control for that preference and a bottom Support FixMyType button.

### Changed

- Contributor workflow now requires material phase questions with clear options and consequences, and a verified GitHub push as build-loop step 8.

## [0.1.0] - 2026-09-04

### Added

- Public Apache-2.0 repository foundation with trademark clarification.
- Donation, security, conduct, contribution, and issue-reporting routes.
- Root, documentation, planning, and AI navigation for people and machine readers.
- Initial delivery planning and test-first collaboration rules.
