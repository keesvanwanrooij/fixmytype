# FixMyType

Your keyboard should not make writing harder.

FixMyType is an open-source Windows typing assistant being built for damaged keyboards and busy writers. The goal is to help you type, repair, dictate and listen while keeping your words on your computer.

Current status: the desktop Settings shell and initial Rust policy library run. The expanded writing workspace, native protection, local AI, speech and companion are in development. See [delivery status](plans/README.md) for verified progress.

## One writing companion, your choice of help

You choose deterministic typing protection at levels 1 through 5. AI stays separate, with Off, Suggest and Automatic modes. Personal profiles distinguish browser prompts, prose, code and spreadsheets. Your own tone comes from an editable local style card and vocabulary.

The intended workflow lets you keep typing while older sentences are repaired. Dictation puts a transcript into local history and a validated selected destination. Narration reads your text aloud. An optional companion describes a chosen window and helps prepare replies. These capabilities must pass their individual tests before they are advertised as available.

The app preserves uncertain input. Unsupported external text fields receive a draft or suggestion. Passwords, elevated applications, secure desktop and formulas are excluded from automatic prose changes. You control recording, observation and retained history.

## Start the source build

You need Node.js for the desktop and Rust for native components.

~~~powershell
git clone https://github.com/keesvanwanrooij/fixmytype.git
cd fixmytype/apps/desktop
npm install
npm test
npm start
~~~

The last command builds Electron and opens the current app. Run cargo test --workspace from the repository root to check the Rust library. Follow [installation](docs/16-installation.md) for prerequisites and packaging status. A source build is not yet an end-user installer.

## Find your way

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
crates/input-core/ Pure Rust event policy and tests
docs/             Thirty product and engineering references
plans/            Phases, evidence, bug fixes and measured optimizations
scripts/          Repository checks
.github/          Community and automation configuration
~~~

## Support FixMyType

If this project helps you write with less frustration, a donation supports continued testing, fixes and accessibility work. You can also contribute a reproducible bug, a translation improvement or a Windows compatibility check through [the contribution guide](CONTRIBUTING.md).

[![Support FixMyType](https://img.shields.io/badge/Support_FixMyType-GitHub_Sponsors-EA4AAA?style=for-the-badge)](https://github.com/sponsors/keesvanwanrooij)
