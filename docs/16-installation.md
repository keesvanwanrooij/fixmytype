# Install and start

## Current source build

Install Node.js and the Rust toolchain before building the respective components. Electron is installed with the desktop dependencies. From a terminal, clone the public repository, enter apps/desktop and run npm install, npm test and npm start. The final command typechecks, builds and launches Electron.

To check the Rust library, return to the repository root and run cargo test --workspace. Native input integration is separate from a passing library test.

## First-run setup target

The setup screen must inspect available local runtimes, show ready or missing state, and explain the download size before installation. It should reuse an existing local service where compatible. Download failure and cancellation must leave existing resources working.

The first-user package will include a Windows installer or unpacked app plus checksums, supported-context notes and a test script. Until phase 12 has installer evidence, do not advertise a developer build as an end-user release.

## Recovery

If the window is blank, inspect renderer and preload errors. The current build needs relative Vite asset paths and a CommonJS sandbox preload. Repeatedly reinstalling dependencies does not diagnose a renderer crash.

Quit through the tray before starting another instance. Future builds must enforce single-instance ownership so cache locks and shortcuts cannot conflict.

## Removal

The installer must state which binaries it removes and whether local preferences or retained history remain. Removing user content needs an explicit user choice. Runtime downloads must be listed separately from the application.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
