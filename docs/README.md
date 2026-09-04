# FixMyType documentation

This is the documentation hub for FixMyType. The project is a Windows-first, local-first typing aid for unreliable keyboards. Read the root [README](../README.md) for the public promise, then use this page to find the detailed product and engineering record.

## Documentation map

| Topic | Purpose | Status |
|---|---|---|
| [Planning overview](../planning/README.md) | Shared guardrails and all delivery phases | Active |
| [10-phase roadmap](../planning/ROADMAP.md) | The sequence from foundation to public release | Active |
| [Planning hub](../planning/README.md) | Where phase, optimization, and bug-fix plans live | Active |
| [Contributing](../CONTRIBUTING.md) | How to make a safe, reviewable contribution | Active |
| [Security policy](../SECURITY.md) | How to report a vulnerability privately | Active |
| [Support](../SUPPORT.md) | Donations, feedback, and project boundaries | Active |
| [AI contributor guide](../CLAUDE.md) | Repository reading order and test-first workflow | Active |
| [Product vision](01-product-vision.md) | Product promise and success measure | Active |
| [Safety invariants](02-user-problem-and-safety.md) | Text-loss and privacy boundaries | Active |
| [Scope and non-goals](03-scope-and-non-goals.md) | What the first release includes and excludes | Active |
| [Decision log](04-decision-log.md) | Binding product and technical decisions | Active |
| [Accessibility principles](05-accessibility-principles.md) | Usability requirements for an accessibility tool | Active |
| [Architecture](06-architecture.md) | Electron and native-worker boundaries | Active |
| [Input pipeline](07-input-pipeline.md) | Safe event and repair flow | Active |
| [Electron security](08-electron-security.md) | Renderer and IPC hardening requirements | Active |
| [Privacy](09-privacy-and-data-handling.md) | Local data limits and local-model policy | Active |
| [Threat model](10-threat-model.md) | Harm cases and mitigations | Active |
| [Windows compatibility](11-windows-compatibility.md) | Supported and excluded input contexts | Active |
| [Testing strategy](12-testing-strategy.md) | Automated and manual verification policy | Active |
| [Safety test cases](13-test-cases-and-safety-invariants.md) | Required regression cases | Active |
| [Development workflow](14-development-workflow.md) | Test-first to GitHub-push loop | Active |
| [Code style](15-code-style.md) | Auditable TypeScript and Rust conventions | Active |
| [Installation](16-installation.md) | Verified-release installation information | Active |
| [Configuration](17-configuration.md) | Settings behavior and safe defaults | Active |
| [Chatter protection](18-chatter-protection.md) | Deterministic local protection | Active |
| [Local AI repair](19-local-ai-repair.md) | Optional reviewable local repair | Active |
| [Troubleshooting](20-troubleshooting.md) | Safe first responses to failures | Active |
| [FAQ](21-faq.md) | Common product questions | Active |
| [Donations](22-donations-and-sustainability.md) | Voluntary project support | Active |

## Documentation principles

- Documentation is written in English so the public project can be understood internationally.
- Product UI is available in Dutch and English.
- A document says what is confirmed, planned, or undecided. It never presents a roadmap item as shipped.
- Every new README links to the [root README](../README.md), this hub, and the [roadmap](../planning/ROADMAP.md).
- Safety, privacy, and text-loss risks are explained before implementation claims are made.

## Planned reference set

The next documentation phases will add product scope, accessibility principles, architecture, input safety, Electron hardening, privacy handling, threat modelling, Windows compatibility, test strategy, setup, configuration, troubleshooting, FAQ, and donation sustainability. They will appear here only after they exist and are reviewed.

Return to the [root README](../README.md) or open the [roadmap](../planning/ROADMAP.md) to see what comes next.
