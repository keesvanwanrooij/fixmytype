# Workspace verification, 2026-09-05

The new preference and shortcut tests were written before implementation. They initially failed because the modules did not exist. An additional malformed enum regression failed when array values were coerced into strings; strict type validation made it pass.

From `apps/desktop`, run `npm test`, `npm run lint`, `npm run build` and `node node_modules/electron/cli.js scripts/smoke.cjs`.

The desktop suite contains 28 passing tests. The smoke script starts the built Electron app with an isolated temporary profile. It exercises the real preload, editor input, NL preference persistence, separate repair language, retained draft, AI mode, keyboard focus and a 740 by 600 viewport. It rejects renderer errors. Screenshots are generated in the ignored desktop `.cache` directory and were inspected.

This does not prove physical Windows text scaling, every keyboard path or external application support. The initial shortcut defaults collided on this computer; Control+Alt+Shift combinations registered successfully. The temporary smoke profile contains synthetic test text only.

Navigation: [evidence](README.md), [phase 2](../phases/02-settings-and-localisation.md), [plans](../README.md).
