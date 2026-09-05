# Phase 4: Target capabilities and native lifecycle

## Status

✅ Complete for the target-contract and native-lifecycle scope. External editing remains unsupported. Phase 2's physical scaling check remains separate.

## Outcome

The app identifies a chosen target and exposes only editing capabilities proven for its field type.

## Why and scope

This phase implements the approved workflow in [the product register](../../docs/24-product-workflows.md). It owns the packages below. Later capabilities stay with their owning phase in [the delivery index](../README.md).

Planning size: One to three days including Windows API investigation. This is a work estimate, not a completion guarantee.

## Read first

- Read [06-architecture](../../docs/06-architecture.md).
- Read [08-electron-security](../../docs/08-electron-security.md).
- Read [11-windows-compatibility](../../docs/11-windows-compatibility.md).
- Read [the architecture](../../docs/06-architecture.md) and [the test strategy](../../docs/12-testing-strategy.md).

## Dependencies and decisions

Required prior capabilities: phases 2, 3. The maintainer's GO authorizes implementation and commits on main. Use documented defaults and ask only if a new choice changes scope or permissions. Microphone and screen access still require explicit user interaction in the app.

## Work packages

### Package 1: Target contract

- [x] Create src/shared/target.ts with target ID, document identity, capabilities and consent epoch.
- [x] Test stale target, password, read-only, elevated and unknown contexts before adapter implementation.
- [x] Implement the app-owned editor adapter first and a capability result for unsupported external controls.
- [x] Document candidate Windows APIs and their read versus write limits in plans/evidence/04-targets.md.

### Package 2: Native process boundary

- [x] Create apps/input-worker with bounded versioned request and response messages.
- [x] Validate unknown fields, protocol version, oversized messages and repeated start or stop.
- [x] Keep target discovery out of timing-critical keyboard callbacks. No keyboard callbacks are installed in this phase.
- [x] Implement cancellation and shutdown that release all app-owned native resources.

### Package 3: Windows evidence

- [x] Build a controlled Windows fixture with plain, password and read-only fields.
- [x] Prove target changes invalidate operations before adding any external insertion path. The existing owned editor now checks target leases too.
- [x] Test worker crash, restart, no active target and Electron quit.
- [x] Record browser, Word, Excel and terminal capabilities honestly in the compatibility matrix.

### Package 4: cleanup and delivery

- [x] Review the changed files for duplicated state, dead code, resource leaks and missing boundary validation.
- [x] Run affected tests after cleanup and retain actual red/green evidence under plans/evidence.
- [x] Update the phase record, reference docs and changelog with verified behaviour and known limitations.
- [x] Review the staged diff and deliver this verified phase to main with its result commit and GitHub push.

## Acceptance criteria

Run the affected desktop checks from apps/desktop: npm test, npm run lint and npm run build. For Rust changes, run cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings and cargo test --workspace from the root. Run node scripts/check-docs.mjs after documentation changes. A command that was not run is not a pass.

The package-specific failure cases above must have tests or a documented physical fixture. A helper test cannot replace a required process, device or application check.

## Live checks

- [x] Run the controlled target fixture and verify denied targets.
- [x] Change focus while a request waits and confirm no mutation, even after focus returns to the editor.

## Stop condition and rollback

UI Automation TextPattern alone cannot safely write historical ranges. Unsupported writes must remain drafts. Keep a usable draft, preserve existing user content, cancel app-owned jobs and document the reduced capability if a path fails.

## Implementation record

### Verified outcome

The result passes 73 desktop tests and 21 Rust tests, desktop lint/build, real Electron target and lifecycle fixtures, NL/EN phase-2 regression checks, the compact-layout smoke check and the local AI/Whisper workflow. See [the full evidence](../evidence/04-targets.md) for red tests, cleanup findings, Windows fixtures and exact limits.

The native child starts idle. It reads only metadata after an explicit protocol start/probe, and the current renderer cannot invoke those operations. Main owns cancellation, deadlines and process restart. Real Win32 controls prove field classification only. The app-owned editor proves guarded mutation. No external field, browser, Word document, Excel cell or terminal prompt gains write capability from this phase.

The next code phase is [phase 5](05-safe-chatter-protection.md). Its hook and calibration work must use the same preserve-first rules and must not promote a field from its class name alone. Before phase-2 acceptance, the maintainer still needs to inspect actual Windows text scaling at 200 percent.

### Implementation checkpoint

Starting commit: `896ebf6`. Phase 3 is complete. Phase 2's code passes; its separate physical 200-percent scaling check remains open and does not block this independent safety boundary.

Goal: identify the app-owned document, invalidate delayed work when its target changes, and host a bounded native metadata observer without enabling external writes.

Decisions: `src/shared/target.ts` owns capability and consent-epoch checks. The writing hook must check a captured lease before applying an asynchronous result. A target change leaves the result available as a draft. Manual acceptance still requires a matching document range. A Rust `apps/input-worker` process accepts versioned JSON lines on stdin and returns metadata only. It does not install keyboard hooks, read window titles or text, or inject input. It starts idle. Native discovery runs only on an explicit probe request after start. All external write capabilities remain false, including recognizable Win32 edit fields. The Electron main process owns the child and closes it on quit or renderer failure.

Tasks, in execution order:

1. Add failing target and editor-adapter tests under `apps/desktop/tests` for stale epochs, changed documents and denied field types.
2. Implement the target contract and connect request/apply guards in `src/renderer/useWriting.ts` and `App.tsx`. Add a controlled Electron fixture with password, read-only and plain fields.
3. Add failing Rust protocol tests, then implement the strict reader, idle/start/stop/probe/shutdown states and Windows metadata adapter in `apps/input-worker`.
4. Add real child-process tests for malformed messages, crash, restart, EOF and cancellation. Wire ownership through `src/main/input-worker.ts` and `workspace-ipc.ts`. Add the native build to the source launcher path.
5. Run a controlled Windows fixture. Record the difference between native metadata recognition and supported editing in `plans/evidence/04-targets.md` and `docs/11-windows-compatibility.md`.
6. Review resource lifetimes, rerun desktop and Rust checks, update these checkboxes from actual evidence, and commit and push the verified result.

Out of scope: global key suppression belongs to phase 5. Browser, Office and terminal insertion remain unsupported. No settings change grants observation consent. A worker failure must leave the existing app-owned writing and dictation workflow usable.

Acceptance: `npm test`, `npm run lint`, `npm run build`, the phase-2 regression, the new target/worker checks and the existing workflow check must pass. Rust formatting, clippy and workspace tests must pass. Documentation links must resolve. No physical or external-application support is inferred from a helper test.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
