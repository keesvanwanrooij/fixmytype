# Architecture

FixMyType has three local processes: an Electron main process for lifecycle and tray control, a sandboxed renderer for Settings, and a Rust input worker for Windows-only input work. The renderer communicates through a typed preload bridge; it never receives Node, filesystem, clipboard, or hook access.

The main process starts the worker, validates every IPC message, stores local settings, and is the only process permitted to open the fixed GitHub Sponsors URL. The worker owns timing and event-origin decisions. Optional Ollama requests originate in the main process only and target loopback.

Navigation: [README.md](../README.md), [docs hub](README.md), [roadmap](../planning/README.md).
