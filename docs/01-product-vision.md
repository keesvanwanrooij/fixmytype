# Product vision

FixMyType helps people type on a Windows PC when the keyboard itself is unreliable. Its first job is to reduce accidental duplicate input without becoming another source of lost text. Its second job is optional, local repair for text the person explicitly asks it to improve.

## Foundation decisions

No new material choice is open. The maintainer already chose Windows-only support, a local free core, a calm Electron settings application, Dutch and English UI, deterministic chatter protection, and opt-in undoable local repair. These decisions keep the first product focused on immediate typing relief.

## Product promise

- Protection acts locally and defaults to preserving uncertain input.
- Repair is separate from protection and never requires an account or cloud service.
- A person can see, pause, undo, and configure automation.
- The app supports Dutch and English UI independently from repair language.

## Success measure

A user can type an ordinary message with fewer accidental repeats, immediately pause protection if it feels wrong, and understand what happened without reading technical documentation.

Read [README.md](../README.md), [docs/README.md](README.md), and [planning/README.md](../planning/README.md) for context.
