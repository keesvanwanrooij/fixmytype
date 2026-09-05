# Local repair verification, 2026-09-05

## Provider checks

The provider tests failed before implementation because the module did not exist. The signed-number regression then failed against implemented code: `-10%` could become `10%`. The token guard was corrected and all four provider tests passed.

Checks cover the fixed loopback endpoint, local resource metadata, rejected cloud-backed aliases, malformed JSON, protected numbers, code and formula guards, disabled AI and input bounds. Requests have a 45-second deadline in the Electron boundary. Output is treated as a proposal, not as trusted instructions.

## Real engine checks

`npm run test:runtime` uses the installed Ollama runtime, synthetic text and no credentials. The first cold English request took 41,703 ms. A later run returned these results:

| Language | Input | Output | Time |
|---|---|---|---|
| English | This sentense has a speling mistake. | This sentence has a spelling mistake. | 2,546 ms |
| Dutch | Ik heb een beschadigd toetsenbord en wil beter schriijven. | Ik heb een beschadigd toetsenbord en wil beter schrijven. | 289 ms |

These are two fixtures on this computer, not quality or latency guarantees. Meaning can still change despite numeric guards. Automatic mode remains an explicit user choice with guarded Undo.

The fixed local resource is `llama3.2:3b`. Its upstream weight license is separate from the repository's Apache-2.0 code license. No weights are committed. Other local resources and an in-app installer are future work.

Navigation: [evidence](README.md), [phase 6](../phases/06-selected-text-repair.md), [plans](../README.md).
