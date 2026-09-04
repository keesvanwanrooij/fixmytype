# Contributing to FixMyType

Thank you for helping make typing less exhausting. FixMyType touches a sensitive part of a computer: text input. A small mistake can delete or alter someone’s words, so contributions must be narrow, tested, and easy to review.

Start at the [root README](README.md), read the [documentation hub](docs/README.md), and check the active work in the [roadmap](planning/README.md).

## Before you begin

1. Search existing issues and plans to avoid duplicate work.
2. Open an issue or discussion for a behavior, safety, architecture, or scope change.
3. Read [CLAUDE.md](CLAUDE.md), even if you are not using an AI assistant.
4. At the start of a substantial phase, resolve only material choices with clear options, consequences, and a recorded recommendation.
5. Keep one pull request focused on one phase task or one reproducible defect. Small, self-contained iterations may be committed directly to `main`.

## Required development loop

For any behavior that can fail, write a test first and demonstrate that it fails before implementation. Implement the smallest safe change, run the focused and relevant full tests, clean up the code, then run the tests again. Include the commands and results in the pull request.

Never test with a real password, private clipboard contents, or recordings containing someone else’s speech.

## Pull request checklist

- [ ] The change matches an approved roadmap item or issue.
- [ ] A test failed before the implementation and passes afterward.
- [ ] Relevant checks pass after the cleanup pass.
- [ ] Documentation and navigation links are updated when behavior or paths changed.
- [ ] No cloud call, telemetry, secret, private text, or generated build output is included.
- [ ] The interface is reviewed in Dutch and English if user-visible text changed.
- [ ] The verified commit has been pushed to GitHub before this work is called complete.

## Reporting a vulnerability

Do not open a public issue for a security vulnerability. Follow [SECURITY.md](SECURITY.md).

## Code of conduct

All participation follows [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). By contributing, you agree to license your contribution under Apache-2.0 unless you clearly state otherwise before it is accepted.
