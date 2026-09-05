# Phase 3 verification

The pre-implementation checkpoint is `201da7d`. The verified code commit is `9a366d0`.

## Red, green and cleanup

Tests first exposed discarded unknown modifier bits, equal-timestamp classification and raw key/timestamp Debug output. The generated candidate test found the equal-timestamp failure with seed 20260905. Calibration tests failed before the new API existed.

The corrected code retains all modifier bits, preserves disabled and invalid timing, redacts event Debug output and validates sensitivity and timing tables. Calibration returns only counts and a proposal status. It refuses insufficient, invalid or overlapping examples. It requires explicit labels, at least ten examples per group and at most 1,000 intervals. No capture, event history, OS hook or suppression was added.

Cleanup kept calibration separate from event classification, removed the lossy known-bit mask and replaced the old generated enum-membership assertion with preservation invariants. The module scans samples once and does not allocate a copy of them.

## Commands

The following commands passed in the main Windows checkout and a separate detached worktree at the exact code commit:

~~~powershell
cargo fmt --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
cargo tree --workspace --edges normal
~~~

Sixteen tests passed. The two generated tests each use 512 cases and seed 20260905. All five sensitivity boundaries are checked. The dependency tree shows only fixmytype-input-core for normal dependencies. `git status --short` in the isolated worktree was empty. No native input privilege was needed.

The isolated verification worktree and its generated build output were removed after the check. The verified sources remain in Git. Native key lifetime, OS auto-repeat identification, target permissions and physical calibration UI remain responsibilities of later phases, not missing capabilities of this advisory library.

Navigation: [evidence](README.md), [phase 3](../phases/03-input-policy-library.md), [plans](../README.md).
