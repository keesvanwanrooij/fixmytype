# FixMyType: local Windows typing help for unreliable keyboards

[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-2b6cb0.svg)](LICENSE)
[![Platform: Windows](https://img.shields.io/badge/platform-Windows-0078D4.svg?logo=windows&logoColor=white)](docs/README.md)
[![Processing: local](https://img.shields.io/badge/processing-local%20only-13795B.svg)](docs/README.md)
[![Support FixMyType](https://img.shields.io/badge/Support-FixMyType-EA4AAA.svg?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/keesvanwanrooij)

FixMyType is a free, open-source Windows app for people whose keyboards create accidental repeats, double letters, or unreliable keystrokes. It quietly filters clear keyboard chatter while you type. Optional local repair can then suggest corrections in Dutch or English, with a visible result and Undo before anything is changed. Your words stay on your computer.

**Status:** early development. The first public foundation is being built. Do not rely on it for critical work yet.

## Start here

| If you want to... | Read |
|---|---|
| Understand the problem and product promise | [Documentation hub](docs/README.md) |
| See every planned release phase | [10-phase roadmap](planning/ROADMAP.md) |
| Follow or review the current work | [Planning hub](planning/README.md) |
| Contribute safely | [Contributing guide](CONTRIBUTING.md) and [security policy](SECURITY.md) |
| Give an AI assistant safe project context | [CLAUDE.md](CLAUDE.md) and [llms.txt](llms.txt) |
| Support the project | [Support FixMyType](https://github.com/sponsors/keesvanwanrooij) |

## Why FixMyType exists

A damaged keyboard can make ordinary typing exhausting. A single press may become two letters, a word may turn into noise, and correcting each mistake steals attention from the message itself. Replacing a keyboard is not always immediately possible or sufficient. FixMyType is being built to make the computer adapt to the person, rather than demanding perfect input from unreliable hardware.

The project starts with the least intrusive help: detect clear accidental repeats locally, leave intentional double letters alone, and make protection easy to pause. Text repair is a separate, explicitly enabled tool. It never becomes a reason to send private writing to a cloud service.

## What the app will do

- Filter clear keyboard chatter on Windows, without a cloud connection.
- Offer a quick pause control, tray status, and Undo.
- Provide a calm settings screen in **Nederlands** or **English**.
- Keep app language separate from repair language: `Automatic`, `Dutch`, or `English`.
- Suggest local sentence repair only when you enable it and can reverse it.
- Keep the local core free, open source, ad-free, and without accounts.

## What it will not do

- Record passwords, work around the Windows secure desktop, or use a kernel keyboard driver.
- Promise that every repeated letter is an error.
- Silently rewrite text, block an application without a clear opt-out, or sell a paid tier.
- Send your typed text to a remote AI service.

## A careful approach to AI

An AI rewrite can be useful for damaged text, but it is never the first line of defence. Chatter protection must work deterministically and locally. Optional repair runs only against a local model you control, begins in a reviewable mode, and always preserves an Undo path. Full safety decisions will live in the [documentation hub](docs/README.md).

## Support FixMyType

FixMyType is built openly for people who need it. There will be no ads, account requirement, or paid feature tier in the local core. If it saves you time, reduces frustration, or helps someone you know keep typing, you can help keep the project free.

**[Support FixMyType on GitHub Sponsors](https://github.com/sponsors/keesvanwanrooij)**

You can also improve the project by testing Windows setups, reporting a reproducible bug, translating interface text, or contributing code. Start with [CONTRIBUTING.md](CONTRIBUTING.md).

## Project map

```text
README.md                 Public home and navigation
CLAUDE.md                 Rules for human and AI contributors
docs/                     Product, safety, architecture, and user documentation
planning/                 Roadmap, phase plans, optimization, and bug-fix queues
.github/                  Community files, funding, issue forms, automation
apps/                     Future Electron app and native Windows input worker
tests/                    Future automated and Windows compatibility tests
```

Every README must link back to this page, [docs/README.md](docs/README.md), and [planning/ROADMAP.md](planning/ROADMAP.md). This keeps the public project navigable for people and machine readers alike.

## License and name

The code and documentation are available under [Apache License 2.0](LICENSE). Apache-2.0 grants broad reuse rights and an express patent licence; it does not grant rights to the FixMyType name or future logo. See [NOTICE](NOTICE) and [TRADEMARKS.md](TRADEMARKS.md).

## Navigation contract

This README is the canonical starting point. The documentation hub owns explanatory material, the roadmap owns planned work, and the decision log will own unresolved product choices. If a link is broken or a document is hard to find, please [open an issue](https://github.com/keesvanwanrooij/fixmytype/issues/new/choose).
