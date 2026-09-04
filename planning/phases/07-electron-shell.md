# Phase 7: desktop shell

## Status

In progress

## Goal

Create a secure, local Electron and React shell that can be built, started, and tested.

## Tasks

- [x] Create `apps/desktop/package.json` and lock dependencies.
- [x] Write a failing Settings-state test in `apps/desktop/tests/`.
- [x] Add typed Settings state in `src/shared/settings.ts`.
- [x] Add TypeScript, Vitest, Vite, and build configuration.
- [x] Add a minimal React Settings renderer.
- [x] Add a sandboxed Electron `BrowserWindow` in `src/main/main.ts`.
- [x] Add a narrow preload bridge in `src/preload/preload.ts`.
- [ ] Add a tray icon, context menu, and show/hide behavior.
- [ ] Add renderer CSP and block unexpected navigation.
- [ ] Run lint, typecheck, tests, build, and a live Windows start check.

## Acceptance criteria

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm start` pass in `apps/desktop`.
