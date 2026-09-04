# Revision tracking and Undo

Older-sentence repair is a transaction problem. A response may arrive after the user writes several more sentences, changes a selection, edits the original sentence or switches documents. The app must identify the passage it owns rather than searching for matching text and guessing.

## State

A document has a stable ID and increasing revision. A captured range has an operation ID, start, end, original text and validity flag. User edits and applied repairs are transactions with a replaced interval and inserted text. Every transaction transforms still-valid ranges.

Appending after a range leaves it unchanged. Editing before a range shifts both coordinates by the length difference. Editing inside or replacing any part of a captured range invalidates it. Insertion at its end belongs to later typing; insertion inside belongs to the captured sentence and invalidates it.

## Apply

Check document identity, range validity, exact original bytes and operation state. Reject out-of-bounds offsets and split UTF-16 surrogate pairs. Apply once and record the committed replacement range as the Undo target. Rebase all other pending ranges with the same transaction.

If a response is late or cancelled, discard it. A revision mismatch alone is not a failure: later typing may be harmless. The tracked range, not a global freeze, decides whether application is safe.

## Undo

Undo validates the actual replacement at its current tracked range. It restores the original passage and retains later typing. If the replacement itself has been edited, return a conflict rather than overwriting the new text. Store bounded operation history and invalidate it on document replacement.

## External controls

The internal editor can make these guarantees in one owned transaction. An external adapter must demonstrate equivalent compare-and-replace semantics. Reading a UI Automation text range does not supply a universal safe write operation. Where that guarantee is missing, present a proposal for deliberate transfer.

## Required evidence

Test delayed response after three appended sentences, a prior edit shifting offsets, overlap invalidation, repeated identical sentences, two results out of order, duplicate apply, mode cancellation, document switch, Unicode boundaries and Undo after newer edits.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
