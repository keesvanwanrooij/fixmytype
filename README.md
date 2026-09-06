# FixMyType

Your keyboard should not make writing harder.

FixMyType is an open-source Windows typing assistant being built for damaged keyboards and busy writers. The goal is to help you type, repair, dictate and listen while keeping your words on your computer.

You can now write, correct and dictate inside the desktop app. It has local AI suggestions, automatic sentence correction, guarded Undo, a repeated-letter filter and local Whisper dictation. System-wide correction and direct insertion into other apps are not connected yet. Use Copy text to move your draft into a browser, Word or another editor. See [delivery status](plans/README.md) for verified progress.

## One writing companion, your choice of help

You choose deterministic typing protection at levels 1 through 5. AI stays separate, with Off, Suggest and Automatic modes. Personal profiles distinguish browser prompts, prose, code and spreadsheets. Your own tone comes from an editable local style card and vocabulary.

Settings includes [key calibration](docs/18-chatter-protection.md). Measure a problem key, label unwanted and deliberate pairs, then review a proposal before accepting it. Only accepted per-key levels and counts are saved. This adjusts the FixMyType editor, not typing in other apps.

Keep typing while an earlier sentence is corrected in the FixMyType editor. If you edit that sentence before AI returns, the result becomes a draft instead of overwriting your changes. Dictation inserts at the original editor selection when that range is still valid. Both paths keep session history with Undo. AI can still misunderstand your meaning, so review changes before sharing them.

Read-aloud, external application adapters and the visual companion remain planned. The non-AI filter only suppresses exceptionally fast repeated presses of the same letter inside this app. It does not guess which of two different letters you intended.

The app preserves uncertain input. Unsupported external text fields receive a draft or suggestion. Passwords, elevated applications, secure desktop and formulas are excluded from automatic prose changes. You control recording, observation and retained history.

## Start the source build

You need Node.js and the Rust Windows MSVC toolchain with its C++ build tools. The desktop build and tests compile the native worker too.

~~~powershell
git clone https://github.com/keesvanwanrooij/fixmytype.git
cd fixmytype/apps/desktop
npm install
npm test
npm run setup:speech
npm start
~~~

The last command builds Electron and opens the current app. Run cargo test --workspace from the repository root to check the Rust library. Follow [installation](docs/16-installation.md) for prerequisites and packaging status. A source build is not yet an end-user installer.

Speech setup downloads about 150 MiB once, verifies SHA-256 checksums and then works locally. AI repair uses your local Ollama installation with `llama3.2:3b`. If needed, start Ollama and run `ollama pull llama3.2:3b` once. Runtime weights have their own upstream licenses and are not included in the repository's Apache-2.0 license.

For later starts on Windows, double-click `Start FixMyType.cmd` in the repository. You can also run `npm start` from `apps/desktop`.

## Try your first draft

1. Open Settings to choose Nederlands or English. Set the repair language separately.
2. Choose Suggest and type a sentence with a typo. Accept or ignore the result below the editor.
3. Choose Automatic if you want completed sentences corrected as you continue typing. Undo remains available in history.
4. Choose Dictate, allow your microphone, speak and choose Stop recording. Audio is processed locally. Each recording lasts at most 115 seconds.
5. Choose Save Word document below the editor, select a new `.docx` filename and choose Open saved document. Windows uses your default `.docx` app. You can also choose Copy text to paste into another editor.

Word export saves exactly the current draft, including paragraphs and emoji. Accept any suggestions you want before saving. Later changes are not synced, and existing files are never overwritten. The chosen folder controls retention and any file syncing. Direct correction inside an already open Word document remains planned.

The default dictation shortcut is `Control+Alt+Shift+D`. Configure shortcuts in Settings. Closing the window hides it in the tray and cancels recording. Quit from the tray to exit. Drafts and the last 50 history entries are session-only, so copy text you want to keep before quitting.

If a service is unavailable, Local setup shows how to prepare it. The first AI request can be slow while weights load. A failed correction leaves the original intact; try a shorter selection or retry after loading. See the [desktop guide](apps/desktop/README.md) for checks and known limits.

## Find your way

For social posts, enable spoken formatting before recording when you want commands such as `command new paragraph` or `opdracht nieuwe alinea`. The repair-language setting chooses the command language; Detect accepts both. Literal dictation remains the default. Review the raw transcript and formatted result in history before exporting to Word. See [speech commands](docs/26-dictation-and-commands.md).

| You want to | Start here |
|---|---|
| Understand the product and safety rules | [Documentation](docs/README.md) |
| See the thirteen delivery phases | [Plans](plans/README.md) |
| Read the ten approved additions | [Workflows](docs/24-product-workflows.md) |
| Test a candidate | [First-user script](docs/30-first-user-test.md) |
| Contribute code or tests | [Contributing](CONTRIBUTING.md) |
| Give an assistant project context | [CLAUDE.md](CLAUDE.md) and [llms.txt](llms.txt) |
| Report a vulnerability | [Security policy](SECURITY.md) |

## Built for a difficult keyboard

This project began with a keyboard that turned single presses into extra letters. The same problem made prompts, social posts and ordinary documents frustrating to write. FixMyType aims to reduce that work while leaving you in control of the result.

The local core stays free, without advertising, an account requirement or a paid tier. Code and documentation use [Apache-2.0](LICENSE); the [trademark policy](TRADEMARKS.md) describes rights to the project name. Every public compatibility claim must point to recorded evidence.

## Repository

~~~text
apps/desktop/     Electron main, React interface and local services
apps/input-worker/ Bounded native metadata process, no external writes
crates/input-core/ Pure Rust event policy and tests
docs/             Thirty product and engineering references
plans/            Phases, evidence, bug fixes and measured optimizations
scripts/          Repository checks
.github/          Community and automation configuration
~~~

## Support FixMyType

If this project helps you write with less frustration, a donation supports continued testing, fixes and accessibility work. You can also contribute a reproducible bug, a translation improvement or a Windows compatibility check through [the contribution guide](CONTRIBUTING.md).

[![Support FixMyType](https://img.shields.io/badge/Support_FixMyType-GitHub_Sponsors-EA4AAA?style=for-the-badge)](https://github.com/sponsors/keesvanwanrooij)
