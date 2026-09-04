# Bug fix: sandboxed Electron preload uses CommonJS

## Status

✅ Fixed

## Report

Affected source build: `npm start` in `apps/desktop` on Windows. The app window opened, but its Settings area remained blank.

Electron runs a sandboxed preload as CommonJS. The TypeScript build emitted `preload.ts` as an ES module because the package uses `"type": "module"`. Electron rejected that file with `Cannot use import statement outside a module`. The renderer then tried to call `window.fixMyType.syncSettings`, but the safe bridge was missing and React stopped rendering.

Expected result: Electron loads a CommonJS preload and exposes the intentionally small `window.fixMyType` bridge before React starts.

Safety impact: this is a startup defect. The repair pipeline is still disabled by product policy. The fix preserves context isolation, sandboxing, disabled Node integration, and the existing narrow IPC surface.

## Scope and safety decision

The fix changes only the preload build format and the path used by the main process. It does not enable Node APIs in the renderer, relax IPC validation, change stored settings, or add a fallback bridge in browser code.

## Regression test first

- [x] Add `apps/desktop/tests/preload-path.test.ts` before the helper exists.
- [x] Run `npm test -- --run tests/preload-path.test.ts` and confirm it fails because the preload-path module does not exist.
- [x] Assert that the application targets `preload.cjs` next to the compiled preload output.

## Fix and cleanup

- [x] Add one pure `resolvePreloadPath` helper in the main process.
- [x] Build the preload from `preload.cts`, which TypeScript emits as CommonJS.
- [x] Point the BrowserWindow configuration to `preload.cjs`.
- [x] Retain the existing type-only settings import, which is erased from the generated preload.
- [x] Keep the obsolete `preload.js` out of the runtime path. A later package build can clean stale development output.

## Verification evidence

```powershell
Set-Location apps/desktop
npm test -- --run tests/preload-path.test.ts
npm test
npm run build
```

Result: the focused regression test passes, all 20 tests pass, and the build creates `dist/preload/preload.cjs` with CommonJS `require` output.

The app was also launched with Electron remote debugging. The running renderer reported `typeof window.fixMyType === "object"` and contained the complete Settings markup, including the bottom Support FixMyType button. This confirms that React no longer stops before rendering.
