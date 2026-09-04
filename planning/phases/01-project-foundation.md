# Phase 1: project foundation

## Status

✅ Complete

## Outcome

FixMyType has a public, navigable, Windows-first project foundation and a minimal Electron desktop shell. A new contributor can understand the product boundary, run the Settings shell locally, find every policy and plan, and make a safe first change.

## User value

The project can be inspected before it asks anyone to trust a text-safety tool. Contributors start from the same safety rules, while users can run a local Settings shell without an account or online service.

## Read first

- [Root README](../../README.md)
- [Documentation hub](../../docs/README.md)
- [Product vision](../../docs/01-product-vision.md)
- [Safety rules](../../docs/02-user-problem-and-safety.md)
- [Architecture](../../docs/06-architecture.md)
- [Development workflow](../../docs/14-development-workflow.md)
- [Contributing guide](../../CONTRIBUTING.md)

## Scope

This completed foundation combined the original repository, product-contract, architecture, quality, planning, user-documentation, and Electron-shell setup. It created the public GitHub project, policy documents, linked README network, quality workflow, detailed forward plan, and a secure React and TypeScript Settings shell.

## Non-goals

This phase did not filter keystrokes, run a Windows hook, read typed text, repair text, contact local Ollama, package an installer, or claim active protection. Those capabilities require later evidence and their own phase plans.

## Decisions retained

- Windows is the only supported platform for the current product.
- Processing remains local. The project has no account, advertising, paid tier, cloud processing, or telemetry.
- Electron owns the Settings UI. A later unprivileged Rust worker may own native input work.
- The renderer has context isolation, sandboxing, disabled Node integration, a narrow preload bridge, and blocked unexpected navigation.
- Interface language and repair language are separate settings. The interface supports Dutch and English.
- Future repair must be explicitly enabled and undoable. Uncertain input is preserved.
- Apache-2.0 applies to code. Project names and visual identity have a separate trademark policy.

## Completed work packages

### Package 1: public repository and governance

- [x] Create the public repository and `main` branch.
- [x] Add Apache-2.0, `NOTICE`, trademark guidance, code of conduct, contribution guide, security policy, and support route.
- [x] Configure GitHub issue templates, pull-request guidance, vulnerability reporting, description, and discovery tags.
- [x] Create an annotated `v0.1.0` repository-foundation tag.

### Package 2: product and safety contract

- [x] Write the product vision, user problem, text-safety invariants, scope, non-goals, decision log, and accessibility principles.
- [x] Define local-only data handling, protected contexts, threat boundaries, Windows compatibility scope, and no-driver rule.
- [x] State that future repair is opt-in and undoable, and that uncertain input is preserved.
- [x] Separate shipped behaviour from planned behaviour in public copy.

### Package 3: contributor navigation and operational documentation

- [x] Connect the root README, documentation hub, planning hub, `CLAUDE.md`, and `llms.txt` so people and tools can find the next authoritative document.
- [x] Add installation, configuration, protection, repair, troubleshooting, FAQ, and donation documents without promising unfinished behaviour.
- [x] Create bug-fix and optimisation registers with repeatable templates.
- [x] Define README link requirements for every new documentation entry point.

### Package 4: quality and delivery controls

- [x] Record the test-first loop, cleanup pass, typecheck, lint, Windows evidence, documentation update, commit, and GitHub push steps.
- [x] Require an intentionally failing test before implementation that could silently damage text.
- [x] Document the phase status vocabulary, evidence rule, release rule, and main-branch convention for small iterations.
- [x] Write detailed plans for all remaining product work.

### Package 5: secure desktop shell

- [x] Create `apps/desktop` with React, TypeScript, Vite, Vitest, ESLint, Electron, and locked dependencies.
- [x] Add a typed settings contract, accessible Settings renderer, tray show or hide flow, and narrow preload API.
- [x] Add CSP, navigation blocking, typed IPC validation, and local-only support-link handling.
- [x] Verify lint, typecheck, tests, build, and a live Electron renderer check.

## Verification evidence

```powershell
Set-Location apps/desktop
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

The foundation has current source-build evidence. The startup regression records in [bug fixes](../bug-fixes/README.md) capture the two blank-window fixes that were discovered during the shell work.

## Handoff to phase 2

Phase 2 may extend local Settings only. It must keep the renderer unprivileged, persist only validated preference fields, test failures before fixes, and avoid claiming that the future protection preference already changes keyboard input.
