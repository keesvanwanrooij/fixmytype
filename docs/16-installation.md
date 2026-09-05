# Install and start

## Current source build

Install Node.js and the Rust Windows MSVC toolchain with its C++ build tools before building. Electron is installed with the desktop dependencies. From a terminal, clone the public repository, enter apps/desktop and run npm install, npm test and npm start. Tests and startup compile the native worker. The final command also typechecks, builds and launches Electron.

To check the Rust library, return to the repository root and run cargo test --workspace. Native input integration is separate from a passing library test.

## First-run setup target

The current source build is usable inside its writing workspace. Run `npm run setup:speech` from `apps/desktop` once for pinned, checksummed local Whisper resources. Start local Ollama and install `llama3.2:3b` for text repair. Use the app's Local setup screen to check availability. See [the desktop guide](../apps/desktop/README.md) for exact commands and current boundaries.

The setup screen must inspect available local runtimes, show ready or missing state, and explain the download size before installation. It should reuse an existing local service where compatible. Download failure and cancellation must leave existing resources working.

The first-user package will include a Windows installer or unpacked app plus checksums, supported-context notes and a test script. Until phase 12 has installer evidence, do not advertise a developer build as an end-user release.

## Recovery

If the window is blank, inspect renderer and preload errors. The current build needs relative Vite asset paths and a CommonJS sandbox preload. Repeatedly reinstalling dependencies does not diagnose a renderer crash.

Quit through the tray to exit completely. The desktop enforces single-instance ownership; a second launch reopens the existing window.

## Removal

The installer must state which binaries it removes and whether local preferences or retained history remain. Removing user content needs an explicit user choice. Runtime downloads must be listed separately from the application.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
