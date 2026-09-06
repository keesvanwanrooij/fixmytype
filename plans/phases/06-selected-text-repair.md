# Phase 6: Local repair and personal tone

## Status

🔄 The app-owned provider and editor path are verified. Word export is available. Direct external editing and the remaining phase gates below are not complete.

## Outcome

The user can request local AI repair with Off, Suggest and Automatic semantics, style guidance and vocabulary.

## Why and scope

This phase implements the approved workflow in [the product register](../../docs/24-product-workflows.md). It owns the packages below. Later capabilities stay with their owning phase in [the delivery index](../README.md).

Planning size: One to two days including real local inference verification. This is a work estimate, not a completion guarantee.

## Read first

- Read [19-local-ai-repair](../../docs/19-local-ai-repair.md).
- Read [28-profiles-style-and-vocabulary](../../docs/28-profiles-style-and-vocabulary.md).
- Read [29-runtime-setup-and-scheduling](../../docs/29-runtime-setup-and-scheduling.md).
- Read [the architecture](../../docs/06-architecture.md) and [the test strategy](../../docs/12-testing-strategy.md).

## Dependencies and decisions

Required prior capabilities: phases 2, 4. The maintainer's GO authorizes implementation and commits on main. Use documented defaults and ask only if a new choice changes scope or permissions. Microphone and screen access still require explicit user interaction in the app.

## Work packages

### Package 1: Provider boundary

- [x] Test endpoint restrictions, cloud-backed entries and invalid output in `tests/local-repair.test.ts`. Add direct deadline and runtime-disconnect tests before closing the phase.
- [x] Create `src/main/local-repair.ts` with AbortSignal requests and a deadline at the Electron boundary.
- [x] Check the installed supported local resource and expose setup guidance. A general local-resource picker is deferred.
- [x] Send text as structured request data and keep it out of URLs, process arguments and logs.

### Package 2: Repair contract

- [x] Validate bounded requests and responses in `src/main/local-repair.ts` instead of a duplicate shared validator.
- [x] Apply profile guards for formulas, code, links and approved vocabulary.
- [x] Include editable style guidance while treating document instructions as untrusted input.
- [x] Test mode Off, ignored proposals, oversized response and empty replacement. The provider tests and `npm run test:repair` cover these cases.

### Package 3: User path

- [x] Connect Workspace selection to request, waiting, proposal, Accept and Ignore states.
- [ ] Complete cancellation for every target lifecycle. Mode, profile, language, intensity, style and vocabulary changes cancel results now; hide and quit cancel jobs. Target leases reject late writes after selection ownership is lost, but immediate provider cancellation for every target transition remains open.
- [x] Use a controlled local inference fixture to measure a real repair in Dutch and English.
- [x] Record latency and output quality without claiming every suggestion is correct.

### Package 4: cleanup and delivery

- [ ] Review the changed files for duplicated state, dead code, resource leaks and missing boundary validation.
- [ ] Run affected tests after cleanup and retain actual red/green evidence under plans/evidence.
- [ ] Update the phase record, reference docs and changelog with verified behaviour and known limitations.
- [ ] Review the staged diff, commit this verified phase to main and push it to GitHub.

## Acceptance criteria

Run the affected desktop checks from apps/desktop: npm test, npm run lint and npm run build. For Rust changes, run cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings and cargo test --workspace from the root. Run node scripts/check-docs.mjs after documentation changes. A command that was not run is not a pass.

The package-specific failure cases above must have tests or a documented physical fixture. A helper test cannot replace a required process, device or application check.

## Live checks

- [x] Repair synthetic damaged Dutch and English prose with the installed local runtime.
- [ ] Stop the runtime mid-request and verify original text remains.

## Stop condition and rollback

Never accept a localhost cloud proxy as local processing or apply output outside a validated range. Keep a usable draft, preserve existing user content, cancel app-owned jobs and document the reduced capability if a path fails.

## Implementation record

### Next checkpoint: bounded responses and cancellation

✅ This slice passed 89 desktop tests, lint, build, controlled real Electron cancellation/Ignore/failure checks and the real AI/Whisper workflow. The provider now reads at most 1 MiB of metadata and 64 KiB of generation bytes, checks cancellation during reading and requires exactly one replacement field. The initial UI test caught a stale waiting message after AI Off; that was fixed. See [repair evidence](../evidence/2026-09-06-repair.md).

Starting at `43ce0db`, add behavioural tests in `tests/local-repair.test.ts` for extra response fields, empty and excessive output, bounded network bodies, cancellation before and after a response, and runtime disconnect. Implement the smallest provider changes in `src/main/local-repair.ts`. Add real Electron tests proving mode Off, Ignore and delayed results preserve the original. Include vocabulary changes in cancellation. Run the full suite, lint, build and the controlled provider/renderer fixture, then clean up and push. No endpoint or runtime change is required. Physical microphone and direct Word editing are outside this checkpoint.

2026-09-06: The maintainer selected Word social posts as the first target. The [Word-first slice](../word-first-delivery.md) now exports an explicit draft snapshot to a new `.docx` through a native Save dialog. Real Electron interaction and an isolated installed-Word read-only round-trip passed. This is deliberate transfer, not external range replacement. The full phase still needs the remaining cancellation and provider failure checks above. See [export evidence](../evidence/2026-09-06-word.md).

2026-09-05: `src/main/local-repair.ts` validates the fixed Ollama endpoint, rejects cloud-backed aliases and guards numbers, vocabulary, code and formulas. Unit tests passed after initial missing-module failures. The first real English correction succeeded in 41.7 seconds including cold loading. This is not a latency target. The app-owned editor path is being prioritized at the maintainer's request; external selection capture still needs phase 4.

See [provider evidence](../evidence/2026-09-05-local-repair.md). The core provider package is delivered separately from the cross-phase UI wiring.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
