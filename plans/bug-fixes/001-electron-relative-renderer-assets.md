# Bug fix: Electron renderer uses relative asset paths

## Status

Fixed

## Report

Affected source build: `npm start` in `apps/desktop` on Windows. Vite built `dist/renderer/index.html` with `/assets/...` script and stylesheet paths. Electron opens that file using `file://`, so those absolute paths point outside the renderer directory. The window appeared but the React Settings interface stayed blank.

Expected result: the Electron Settings window loads its bundled script and stylesheet from `dist/renderer/assets/`.

Safety impact: this is a startup defect. It does not alter typed text or privacy boundaries, but it blocks the user from reaching Settings and tray controls.

## Scope and safety decision

Only Vite's build base path changes. Electron CSP, preload boundaries, IPC, renderer code, and local settings storage remain unchanged.

## Regression test first

- [x] Add `apps/desktop/tests/vite-config.test.ts` before changing the build config.
- [x] Run the focused test and confirm it fails because `config.base` was undefined.
- [x] Assert `config.base` is `./`, which keeps bundled paths inside the file-loaded renderer directory.

## Fix and cleanup

- [x] Set `base: "./"` in `apps/desktop/vite.config.ts`.
- [x] Build the renderer and inspect `dist/renderer/index.html`.
- [x] Confirm generated script and stylesheet paths begin with `./assets/`.
- [x] Keep the test focused on configuration rather than copied built output.

## Verification evidence

```powershell
Set-Location apps/desktop
npm test
npm run lint
npm run typecheck
npm run build
```

Result: 19 tests pass, lint passes, TypeScript passes, and the production build writes relative asset paths. A fresh `npm start` check remains the user-visible confirmation because native window contents cannot be inspected from this task environment.
