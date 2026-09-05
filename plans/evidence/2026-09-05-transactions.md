# Transaction verification, 2026-09-05

Nine tests in `tests/document-buffer.test.ts` cover range rebasing, delayed correction, later typing, guarded Undo, identical sentences, reverse result order, stale ranges, Unicode boundaries and cross-document ownership. The decimal/URL sentence regression and foreign-document regression failed against the initial implementation and passed after correction.

`npm run test:workflow` exercises the built Electron app and real local AI. It verifies that Suggest does not write before Accept, Undo restores the original, automatic correction preserves later typing and the caret, and an undone sentence is not immediately corrected again. An added continuous-typing test failed because the timer reset on every keystroke. The timer now depends on completed sentences, and that test passed.

The core has one app-owned document per mounted workspace. Anchor identifiers are unique across document instances. The UI serializes inference rather than applying concurrent unbounded requests. A map-to-set cleanup makes processed-range lookup linear rather than repeatedly scanning every range for every sentence.

External editors, persistent history and history export are not verified by this fixture. Do not describe this as system-wide correction.

Navigation: [evidence](README.md), [phase 7](../phases/07-sentence-repair-experiment.md), [plans](../README.md).
