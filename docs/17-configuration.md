# Configuration

## Current Settings screen

The desktop app stores a small Settings record in the current Windows profile. It contains the interface language, repair language, and protection preference. It never contains typed text, clipboard content, repair content, diagnostics, or an account identifier.

Choose English or Nederlands for the app interface. Choose Automatic, English, or Nederlands for repair language. These choices are separate. Changing the app language does not change repair language.

The protection switch and tray action save a preference for the future keyboard-protection service. They do not filter keystrokes yet. Text repair remains unavailable until its planned phases add visible review and Undo.

If a saved Settings record is malformed, FixMyType uses safe runtime defaults and explains this in the Settings screen. It does not overwrite the malformed record automatically. If browser storage is unavailable, current choices remain available until you close the window.

## Planned Settings

Later phases will add supported-app exclusions, sensitivity, shortcuts, local-model availability, and an Undo history. Each setting will state whether it is ready to use or planned.

See [README.md](../README.md), [docs hub](README.md), and [roadmap](../planning/README.md).
