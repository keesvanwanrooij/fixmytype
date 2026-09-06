# Deliberate rewriting evidence

Checkpoint: `0e76793`. Date: 2026-09-06. Scope: [phase 6](../phases/06-selected-text-repair.md).

Two provider tests initially failed: rewrite intent had no effect and unknown intent was not rejected before inference. They now pass. The real Electron hidden-window check first reached the job handler instead of the visibility guard. New jobs are now refused while hidden. A subsequent real workflow run exposed an initial-visibility scheduling gap; a removed-on-unmount visibility listener now resumes scanning after showing the window.

`npm run test:repair` proves that Rewrite uses a fixed named intent, stays a proposal in Automatic, leaves later typing untouched, and supports Accept followed by Undo. Its existing Off, Ignore, vocabulary cancellation and failure checks still pass. Test-only hidden-window and disconnect rejections deliberately appear in stderr without private text.

Real local NL/EN inference was exercised with synthetic descriptions of a walk. English shortened the filler as requested. The initial Dutch output introduced an incorrect activity word. Guidance was tightened to reuse concrete nouns and verbs; the next result retained the activity but still had awkward phrasing. This is a known quality limitation, not a passing natural-language accuracy claim. Every rewrite needs review and never applies automatically.

After cleanup, 96 desktop tests passed. Lint and the production build passed. The real AI/Whisper workflow passed after the visibility fix. The new button uses the existing toolbar layout and range capture, rather than a second mutation path. Docs explain the distinction between correction and rewriting.

Navigation: [Project home](../../README.md), [documentation](../../docs/README.md), [delivery plans](../README.md).
