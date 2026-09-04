# Test cases and safety invariants

| Case | Expected result |
|---|---|
| Same printable key within threshold | Suppress only when policy confidence is high. |
| Intentional double letter outside threshold | Preserve it. |
| Modifier or shortcut | Preserve it. |
| Worker-injected event | Never re-filter it. |
| Protection disabled or excluded app | Preserve every event. |
| Local repair unavailable | Preserve original selection. |
| Undo | Restore the exact prior text once. |
| Dutch and English UI | Correct translated control and accessible label. |

See [README.md](../README.md), [docs hub](README.md), and [roadmap](../plans/README.md).

## Revision regression matrix

Test two identical sentences with distinct IDs. Queue repair for the second and append three more sentences. The second may change only if its tracked range remains intact. Then repeat with insertion before it, manual overlap, reversed completion order and immediate mode Off.

Test Undo after newer text and after a manual edit to the replacement. The first succeeds without losing the suffix; the second returns a conflict. Include emoji and combining characters at selection boundaries.

## Voice and lifecycle regression matrix

Test audio permission denied, empty audio, local service timeout, worker exit, retry and cancellation. A target change retains a draft. A cancelled capture has no live track. Queue saturation leaves typing responsive. Every fixture uses synthetic or explicitly licensed content.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
