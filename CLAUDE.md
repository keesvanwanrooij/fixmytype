# CLAUDE.md

This file sets the working rules for every human or AI contributor to FixMyType. It is a public repository. Write every change as though a person with an unreliable keyboard will depend on it tomorrow.

## Project promise

FixMyType is a Windows-first, local-first typing aid. The local core stays free, open source, ad-free, and without accounts or a paid tier. Chatter protection is separate from optional local text repair. Privacy, reversibility, and reliable input come before convenience.

The public promise is in [README.md](README.md), explanatory material lives in [docs/README.md](docs/README.md), and work order belongs to [planning/README.md](planning/README.md). Do not duplicate those documents here.

## Read before changing anything

1. Read [README.md](README.md).
2. Read [docs/README.md](docs/README.md).
3. Read [planning/README.md](planning/README.md), then the active phase plan.
4. Read [planning/README.md](planning/README.md), then the phase file you are changing.
5. Read the relevant safety, architecture, or test document.
6. Read the code and tests you would change.

If a required decision is missing, record it in the decision log once it exists and ask the maintainer. Do not invent a safety, privacy, licensing, accessibility, or scope decision.

## Non-negotiable safety rules

- Never send typed text, clipboard content, diagnostics, or settings to a cloud service.
- Never process password fields, the Windows secure desktop, or input from elevated applications.
- Never add a kernel driver without explicit written approval and a dedicated security review.
- Never turn an uncertain repeat into a silent deletion. Default to keeping input when evidence is weak.
- Every automated repair needs visible scope, an immediate pause control, and an Undo path.
- Never claim an untested application, layout, keyboard, or language is supported.

## The build loop

For every feature, bug fix, or behavior that can fail:

1. Write a focused test first.
2. Run it and verify that it fails for the intended missing behavior.
3. Implement the smallest correct change.
4. Run the focused test and the relevant full test suite.
5. Clean up duplication, unclear names, dead paths, and mixed responsibilities.
6. Run the tests again after cleanup.
7. Update the roadmap, changelog, and reference docs if behavior or scope changed.
8. Review `git diff`, commit the verified change with a clear Conventional Commit message, and push it to GitHub before reporting the work complete.

A test that passes before the behavior exists does not prove the behavior. Do not write broad code first and add tests afterward merely to make them green.

## Starting a phase

At the beginning of every phase, ask only the clarifying questions that materially change what will be built. Each question must explain, in plain language:

1. The decision being made.
2. Why it matters now.
3. Two to four distinct options.
4. The practical consequence of each option: what changes, what it costs, and what is given up.
5. A recommended option and the reason for that advice.

Do not ask routine implementation questions. If a safe default is already documented, use it and state that choice in the phase plan.

## Documentation and navigation

- Documentation is English; the application interface is Dutch and English.
- Do not use model recommendations, difficulty ratings, or comparable AI-targeted metadata in FixMyType files.
- Every README links to [README.md](README.md), [docs/README.md](docs/README.md), and [planning/README.md](planning/README.md), using correct relative paths.
- The root README is the canonical public entry point. `docs/README.md` is the documentation index. `planning/README.md` owns delivery status.
- Mark planned work as planned. Never present it as already shipped.
- Keep links, commands, version numbers, and claims verifiable. If not verified, say so.

## Writing for people

Write calm, direct copy that sounds like a thoughtful person, not generated promotion. Documentation stays English unless the maintainer requests Dutch. Dutch UI and documentation use `je` form. English copy addresses the reader as `you`.

- Write short, complete sentences. Every list item has a subject and a verb.
- Use `I` for what the maintainer or project does. Use `we` only for a small, clearly defined group.
- Never use an em dash. Use a comma, full stop, colon, or ordinary hyphen instead.
- Explain jargon the first time it appears. Do not stack three examples when two explain the point.
- Do not use bold text as emphasis inside running prose.
- Do not use rhetorical questions that the following sentence answers.
- Avoid AI-shaped constructions such as “not only X but also Y”, “it is important to note”, “in today’s world”, “in the current landscape”, “let’s dive in”, or “whether you are X or Y”.
- Remove inflated words when the sentence still works without them. Avoid: robust, seamless, unlock, leverage, transform, powerful, crucial, essential, valuable, comprehensive, versatile, and innovative.
- Never use these terms anywhere, including in a denial: noise, hype, in today’s world, transform, state-of-the-art, seamless, innovative, get rich quick, guaranteed returns, logic over emotion, or exclude emotions.

## Scope discipline

Windows only for the current roadmap. The settings screen includes separate interface language and repair language choices. A donation control is a small, explicit link to GitHub Sponsors; it never gates features, interrupts typing, or implies an upgrade.

Do not add accounts, telemetry, cloud processing, advertising, subscriptions, cloud sync, a paid tier, or voice features that delay safe chatter protection without an explicit phase decision.

## Git and release hygiene

- Use small, clear commits with English Conventional Commit messages, then push verified work to GitHub as build-loop step 8.
- Use `main` for quick, self-contained iterations such as a documentation correction, a small tested fix, or a narrow follow-up. Create one branch per substantial phase when the work needs review isolation, spans multiple coherent commits, or may run alongside other work.
- Never commit secrets, local settings, user text, recordings, or clipboard content.
- Never force-push, rewrite published history, or use a destructive reset without explicit instruction.
- Inspect `git diff` before a commit and run the phase verification before reporting completion.
- Create an annotated version tag only when the roadmap release rule and all stated acceptance criteria are met.

## Reporting

Report: what changed, what was tested, what was cleaned up, what remains unverified, and the next decision or phase. Use plain language. A user should never need to infer whether something is implemented, planned, or blocked.
