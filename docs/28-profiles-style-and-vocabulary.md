# Profiles, style and vocabulary

Application profiles describe editing intent: general prose, browser prompt, code and spreadsheet. A profile is not evidence that an external application supports native range replacement. Target capability remains a separate decision.

## Protected text

Code profiles preserve code blocks and commands. Spreadsheet profiles protect formulas, cell references, numeric literals and tickers. A profile cannot weaken password, elevated target or secure-desktop exclusions. Test protection rules with mixed prose and protected spans.

## Style card

The user edits a short local style card and can approve example passages. Repair receives only the approved card and relevant text. Ignore or Undo may propose a preference for review; it must not silently train from everything the user types.

Start with prompt guidance rather than fine-tuning. This lets the user inspect and delete preferences, works with existing local runtimes and avoids collecting a training corpus by default. Fine-tuning would need its own resource, dataset and deletion plan.

## Vocabulary

Store bounded terms with optional preferred spelling and language. Reject empty, duplicate or oversized entries. Apply terms consistently in dictation hints and repair constraints. A vocabulary entry is data, not an instruction to invoke tools.

## Configuration

Support levels 1 through 5 independently for deterministic sensitivity and repair intensity. The AI mode is independent. Local storage migrations retain the original interface and repair language. Malformed personalization must not erase valid basic preferences.

## Evidence

Test vocabulary normalization, bounds, profile fallback, formula guards and style-card deletion. UI checks demonstrate editing and removing a term in Dutch and English.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
