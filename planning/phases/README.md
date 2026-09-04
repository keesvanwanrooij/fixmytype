# FixMyType phase plans

This directory contains the execution record for FixMyType. Read the [root README](../../README.md) for the public promise, [the documentation hub](../../docs/README.md) for product rules, and [the planning index](../README.md) for phase order.

## Read in this order

1. Open the planning index and find the active phase.
2. Read the active phase file in full, including its traps and stop condition.
3. Read every file named in `Read first` before changing code.
4. Write the stated failing test before implementing behaviour that can fail.
5. Record real command output and Windows evidence in the phase file.

Do not start a later phase because its plan exists. The active phase must meet its acceptance criteria first, unless the maintainer explicitly changes the order.

## Standard phase format

| Section | What it answers |
|---|---|
| Status | Whether work may start, continue, or be treated as complete. |
| Outcome and user value | What is observably true after the phase and why it matters. |
| Read first | The documents and code that set the rules. |
| Scope and non-goals | What belongs here and what belongs elsewhere. |
| Dependencies and handoff | What must exist first and what this phase enables. |
| Decisions | Choices already made, plus the effect of each choice. |
| Work packages | Small ordered units that name files, behaviour, and proof. |
| Tests and acceptance | Commands, assertions, and expected outcomes. |
| Windows checks | Exact manual checks that code review cannot replace. |
| Traps and stop condition | Likely mistakes, evidence that blocks release, and rollback action. |
| Implementation record | Facts discovered while building, commits, and remaining work. |

## Status words

- `Planned`: The scope is written but implementation has not started.
- `In progress`: A commit exists or work has started. Unticked checks remain visible.
- `Blocked`: Work needs a maintainer choice, a Windows machine, or an external result.
- `Complete`: Every required acceptance item has recorded evidence.

Existing complete phases preserve their historical record. New and revised active or planned phases follow this standard in full.

## Work-package rule

A phase starts as one file. Split it into `NN-topic/README.md` plus numbered package files when one of these is true:

- The phase has more than three independently testable changes.
- Different packages touch different trust boundaries, such as the renderer, Electron main process, Rust worker, or Windows hook.
- A new contributor cannot safely complete the phase after reading one screen of instructions.

Package files use [TEMPLATE.md](TEMPLATE.md). They do not receive AI-selection labels or ratings. They state the characteristic failure, required test, files, acceptance evidence, and stop condition instead.

## Evidence rule

Checking a box requires evidence. For automated work, record the command and relevant assertion or result. For visible Windows work, record the Windows version, app version, keyboard layout or assistive setting, exact steps, and result. If a check was not performed, leave it unticked and explain why.

The phase plan is an operational document. Update it in the same commit as a scope or behaviour change. The changelog records only user-visible changes. The roadmap records only completed phase status.
