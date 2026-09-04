# FixMyType Repository Foundation Plan

## Status

locked

## Goal

Establish a public, Windows-first FixMyType repository with a safe Electron desktop architecture, a donation-converting README, and a ten-phase, test-first delivery plan for keyboard chatter filtering and optional local rewriting.

## Why

The project exists to give people with damaged or unreliable keyboards immediate, private typing relief without requiring a cloud account, subscription, or paid service.

## Out of Scope

- macOS and Linux support.
- Any cloud processing, account, telemetry, advertising, subscription, or paid feature.
- Automatic rewriting of text in arbitrary applications after every period in the first release. This is not reliably safe across all Windows controls without explicit selection or application-specific accessibility support.
- A kernel keyboard driver, bypassing Windows secure-desktop boundaries, or handling password fields.
- Publishing, pushing, or creating a GitHub repository until the repository name and GitHub authentication are verified.

## Decisions

1. **License: Apache-2.0.** It is a sound permissive license for a permanently free local core and includes an explicit patent grant. `TRADEMARKS.md` will separately reserve the FixMyType name and logo because Apache-2.0 does not grant trademark rights.
2. **Product shape: Electron is the Windows tray/settings shell, not the input engine.** Electron provides the familiar settings UI, auto-update packaging later, and system-tray integration. A minimal native Windows worker, implemented in Rust, owns low-level keyboard observation/suppression and communicates with Electron only through a narrow local IPC contract. The renderer never gets native-input privileges.
3. **Safety boundary: no kernel driver in v0.x.** The worker must never process a secure desktop, password entry, elevated application input, or its own injected keystrokes. It must provide an immediate toggle and an undo path.
4. **Two independent user controls.** `Chatter protection` is a local, deterministic input filter. `Sentence repair` is an opt-in local Ollama action, automatically offered or triggered only after a sentence boundary according to user settings. The default is off for sentence repair.
5. **Five repair levels.** Level 1 corrects clear mechanical glitches only; level 2 corrects spelling and obvious broken words; level 3 improves grammar while preserving voice; level 4 rewrites for clarity; level 5 rewrites for the selected intent/tone. Levels 3-5 require explicit user confirmation or an explicit per-app opt-in until reliable undo is proven.
6. **Language scope: Dutch and English.** The interface has a persistent Dutch/English setting independent of the repair-language setting. Each correction path can auto-detect or receive a Dutch/English preference. Unsupported/mixed content must be left unchanged rather than guessed.
7. **Local-first means local.** The app makes no network request for typing, repair, settings, or diagnostics. Ollama is contacted only on loopback when the user enables it. No text is retained after a request unless the user explicitly saves a local history.
8. **Electron hardening is mandatory.** The packaged UI uses local content, sandboxed and context-isolated renderers, no Node integration, a restrictive CSP, typed allowlisted IPC, blocked navigation, and no remote webviews.
9. **Settings and support stay quiet.** Interface language and repair language live together in the Settings screen. A small footer link may open only the allowlisted `https://github.com/sponsors/keesvanwanrooij` donation page after an explicit user click; it must never interrupt typing or gate a feature.
10. **Test-first delivery.** Every behavior that can silently harm text starts with a failing unit or integration test, followed by the smallest implementation, full relevant test run, then a refactor pass and repeat run.
11. **Release policy: SemVer pre-1.0.** Repository foundation is `v0.1.0`; initial working chatter protection is `v0.2.0`; later public releases are annotated Git tags accompanied by a changelog and signed Windows installer checksums. No tag is created for an unverified phase.

## Tasks

- [ ] **Phase 1 — Public foundation.** Create `LICENSE`, `NOTICE`, `TRADEMARKS.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, `.github/FUNDING.yml`, issue templates, pull-request template, `CHANGELOG.md`, `VERSION`, `.gitignore`, and `docs/README.md`.
- [ ] **Phase 2 — Product contract.** Create `docs/01-product-vision.md`, `docs/02-user-problem-and-safety.md`, `docs/03-scope-and-non-goals.md`, `docs/04-decision-log.md`, and `docs/05-accessibility-principles.md`, including the separate interface- and repair-language contract.
- [ ] **Phase 3 — Architecture and threats.** Create `docs/06-architecture.md`, `docs/07-input-pipeline.md`, `docs/08-electron-security.md`, `docs/09-privacy-and-data-handling.md`, `docs/10-threat-model.md`, and `docs/11-windows-compatibility.md`.
- [ ] **Phase 4 — Quality system.** Create `docs/12-testing-strategy.md`, `docs/13-test-cases-and-safety-invariants.md`, `docs/14-development-workflow.md`, `docs/15-code-style.md`, `CLAUDE.md`, and `AGENTS.md`.
- [ ] **Phase 5 — Delivery planning.** Create `planning/README.md`, `planning/ROADMAP.md`, `planning/phases/01-foundation.md` through `planning/phases/10-public-release.md`, `planning/optimizations/README.md`, and `planning/bug-fixes/README.md`.
- [ ] **Phase 6 — Public-facing documentation.** Create `README.md`, `docs/16-installation.md`, `docs/17-configuration.md`, `docs/18-chatter-protection.md`, `docs/19-local-ai-repair.md`, `docs/20-troubleshooting.md`, `docs/21-faq.md`, `docs/22-donations-and-sustainability.md`, and `llms.txt`.
- [ ] **Phase 7 — Electron shell, tests first.** Create `apps/desktop/` for Electron/TypeScript, its Vitest tests, a minimal tray application, settings renderer, hardened preload bridge, and build scripts. Demonstrate failing tests before implementation in the phase record.
- [ ] **Phase 8 — Native input prototype, tests first.** Create `apps/input-worker/` for Rust/Win32 input handling, `crates/input-core/` for deterministic policy logic, unit/property tests, and an IPC contract. Start with observation mode; do not suppress input until tests and manual compatibility evidence are reviewed.
- [ ] **Phase 9 — Safe filtering and local repair, tests first.** Implement opt-in chatter protection, exclusions, toggle, undo, local Ollama availability check, explicit selected-text repair, and gated sentence-boundary behavior. Add regression tests for intentional double letters, shortcuts, keyboard layouts, timing, injected input, failures, and privacy.
- [ ] **Phase 10 — Release readiness.** Add GitHub Actions, dependency/license audits, code-signing documentation, installer packaging, upgrade/rollback notes, accessibility/manual test matrix, release checklist, annotated `v0.1.0` tag for the documented foundation and later tags only after their acceptance criteria pass.

## Acceptance Criteria

- The root contains 20–30 substantive English Markdown documents, excluding GitHub templates and generated lockfiles; `docs/README.md` indexes each one.
- `README.md` explains the real user problem, privacy promise, product limits, contribution path, and a specific GitHub Sponsors donation call to `https://github.com/sponsors/keesvanwanrooij` without claiming unavailable functionality.
- The Settings screen offers Dutch and English UI text, plus an independent repair-language control (`Automatic`, `Dutch`, or `English`), with tests for both language paths.
- The footer donation control clearly labels GitHub Sponsors, is not shown as an upgrade, opens only the allowlisted sponsor URL after a user click, and never blocks a feature.
- `CLAUDE.md` requires: read the relevant phase and decision log; write a failing test first for any failure-prone behavior; implement minimally; run tests; perform a cleanup pass; rerun tests; update roadmap/changelog; never silently broaden scope.
- No FixMyType documentation uses model recommendations, difficulty ratings, or comparable AI-targeted metadata.
- `planning/ROADMAP.md` has exactly ten phases, each with goals, dependencies, non-goals, test gates, manual Windows verification, and release status.
- All documentation links resolve under `npx markdown-link-check README.md docs/README.md planning/ROADMAP.md` once the Node toolchain is added.
- Phase 7 passes `npm run lint`, `npm run typecheck`, and `npm test` in `apps/desktop`.
- Phase 8 passes `cargo fmt --check`, `cargo clippy -- -D warnings`, and `cargo test` in `apps/input-worker`.
- A test suite demonstrates that a deliberately broken chatter-policy implementation fails before the correct implementation is written, then passes after implementation and after refactoring.
- The public repository has an Apache-2.0 `LICENSE`, an annotated `v0.1.0` tag only after the foundation contents are verified, and no secrets or user text in its history.
