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

See [README.md](../README.md), [docs hub](README.md), and [roadmap](../planning/ROADMAP.md).
