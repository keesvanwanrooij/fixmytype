# Privacy and data handling

FixMyType processes user content locally. Downloads retrieve application resources; they never upload writing, recordings, screenshots, preferences or diagnostics. Localhost is not sufficient proof of local inference: a runtime can proxy cloud requests, so cloud-backed providers must be rejected.

## Data inventory

Current implementation: preferences, style and vocabulary persist in the local profile. Draft text and the last 50 history entries stay in memory only. There is no retained-history opt-in, export or screen capture yet. Temporary audio is deleted after normal completion, cancellation and handled errors. Forced termination can leave files under the desktop `.cache/runtime/sessions` directory; startup recovery is still a phase-8 task. The inventory below also describes planned controls, not just shipped features.

| Data | Default lifetime | User control |
|---|---|---|
| Preferences and app profiles | Local profile until reset | You edit, export or reset them |
| Style card and vocabulary | Local profile until deleted | You approve examples and remove entries |
| Editor text and proposals | Current session | You clear or explicitly save them |
| Dictation and correction history | Session by default | You opt into a bounded local retention period |
| Audio and screen snapshots | Current operation only | Stop, cancel and quit release them |
| Diagnostics | Bounded content-free records | You inspect and clear them |

A saved history is user content, not diagnostics. Persistent history should use operating-system protected storage and explicit consent. An unavailable encryption service must not silently fall back to plaintext.

## Exclusions

Do not collect password values, secure desktop or elevated application input. A selected screen window can still contain private information; capture must be visible, scoped and easy to stop. Window titles and process identifiers are operational data, not fields to include in support reports by default.

## Process handling

Use structured IPC or stdin for content. Do not place text or audio in process arguments, error messages or Git fixtures. Temporary audio belongs in an app-owned directory with bounded lifetime and cleanup on normal completion and startup recovery.

## Evidence

Tests must reject unexpected fields, remote endpoints, path traversal, stale consent and oversized payloads. Tests use synthetic writing and audio. A bug report contains build, operation code and reproduction steps, not the user's document.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
