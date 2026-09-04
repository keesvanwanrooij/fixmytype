# Testing strategy

The build loop starts with a failing behavioural test and ends with a verified commit. A missing module proves scaffolding is absent; a test that fails on the wrong result proves behaviour. Prefer the latter when extending an existing module.

## Layers

Pure TypeScript and Rust tests cover preferences, range transformation, queue ordering, modifier handling and privacy validation. Integration tests cross IPC and local process boundaries with bounded synthetic input. Browser or Electron checks prove the screen is actually rendered and operable.

Native and speech checks use controlled fixtures. Do not record the user's live microphone or screen merely to test setup. A physical capture check needs the user to start it visibly. A synthetic audio fixture can verify transcription without capturing a conversation.

## Required failure cases

A late AI result must not alter a newer edit. Duplicate sentences must not cause the wrong occurrence to change. A queued result after AI Off must never apply. Undo must preserve later typing. Formula, code and password exclusions must survive all modes.

Unknown modifier bits must preserve input. A worker crash must release hooks. A failed shortcut registration must restore the prior set. A failed download must not publish a partial executable. A cancelled microphone request must not leave an active track.

## Commands

Run desktop checks in apps/desktop: npm test, npm run lint and npm run build. Run Rust checks at the root: cargo fmt --check, cargo clippy --workspace --all-targets -- -D warnings, and cargo test --workspace. Add focused integration commands beside the capability that needs them.

## Evidence discipline

Save a concise result under plans/evidence with command, source commit, fixture, assertion and date. Mark physical checks pending until performed. The earlier statement that the app worked did not verify locale navigation or Windows scaling; those checks must be rerun rather than inferred.

Navigation: [Project home](../README.md), [documentation](README.md), [delivery plans](../plans/README.md).
