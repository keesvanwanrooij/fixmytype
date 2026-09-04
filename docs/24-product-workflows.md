# Approved workflows and ten additions

The maintainer approved every proposal below on 2026-09-05 and authorized implementation with tests, cleanup and GitHub commits. This document preserves that decision so contributors do not repeatedly ask the same product questions.

| Idea | User outcome | Owning phases | Proof |
|---|---|---|---|
| 1. Personal keyboard profile | You can calibrate problem keys and choose levels 1 to 5 | 3, 5 | Intentional doubles survive; accepted calibration persists |
| 2. Application profiles | Prompts, prose, code and spreadsheets have appropriate rules | 2, 4, 5 | Formula and code fixtures remain literal |
| 3. Older-sentence repair | You continue typing while earlier text is repaired | 6, 7 | Delayed responses preserve newer edits and duplicate sentences |
| 4. Local style memory | Your tone is guided by an editable approved style card | 2, 6 | Removal changes the next request and never changes mode |
| 5. Spoken editing commands | You can dictate punctuation and deliberate edit commands | 8 | Literal dictation cannot accidentally become a command |
| 6. Shared vocabulary | Names, tickers and technical terms retain their spelling | 2, 6, 8 | NL/EN vocabulary is bounded and respected |
| 7. Local history and Undo | You can inspect and reverse individual committed changes | 7, 8 | Undo preserves later text; clear removes retained entries |
| 8. Chosen-window companion | You can listen to selected screen changes and prepare replies | 9 | Capture requires a live consent session and stops on revoke |
| 9. Companion control and shortcuts | You can operate from a small visual control or keyboard | 2, 9 | Every action is reachable without animation or mouse |
| 10. Resource priorities | Dictation stays responsive while background work waits | 8, 10 | Synthetic overlapping jobs follow bounded priorities |

## Everyday paths

In a browser prompt, the user types rapidly, receives a repair suggestion and chooses whether to accept it. In Automatic mode, only a supported target with range ownership can apply the result while typing continues.

In Word, the user dictates a social post and listens to it before using it. In Excel, only explicit prose content is eligible; formula cells and numerical analysis remain protected. In code tools, code and commands stay literal unless a separate explicit text selection is repaired.

The companion can describe a chosen window and prepare an answer. Preparing an answer does not submit it. These actions must remain distinct in UI, tests and process permissions.

## First-user boundary

Implementation is done when each supported path has build evidence and a repeatable test. Compatibility gaps remain visible. An idea can have completed packages while its external integration remains pending.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
