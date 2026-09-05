# FixMyType desktop

The Electron main process owns local runtime requests, shortcuts and microphone permission. The sandboxed React renderer owns one writing document. The preload exposes named operations, not arbitrary IPC or filesystem access.

## Install and start

From this folder, run:

~~~powershell
npm install
npm run setup:speech
npm start
~~~

Speech setup downloads pinned whisper.cpp b4938 and multilingual base into `.cache/runtime`. Downloads are checksummed. The source build reads that exact directory. Keep it when updating the repository. AI repair uses a running local Ollama instance with `llama3.2:3b`; run `ollama pull llama3.2:3b` if it is missing. No cloud fallback is used.

## What you can use

The Write screen offers non-AI repeated-letter filtering, AI Off/Suggest/Automatic, local dictation and Copy text. AI checks completed sentences after 700 ms without postponing an earlier sentence while you type a later one. Requests are serialized. Changed ranges reject late results. History stores up to 50 entries in memory and supports guarded Undo.

Dictation starts from the button or `Control+Alt+Shift+D`. Stop releases the microphone before transcription. A visible recording banner remains available in Settings and History. Hiding the app cancels recording. The current renderer uses Web Audio PCM capture and converts to 16 kHz mono WAV. Whisper runs with four CPU threads so local AI can use the GPU independently.

## Checks

~~~powershell
npm test
npm run lint
npm run build
npm run test:smoke
npm run test:phase2
~~~

The smoke check starts the real built app with an isolated synthetic profile. Optional integration checks require local Ollama, installed speech resources and ffmpeg. Download the public test fixture first:

~~~powershell
curl.exe -L --fail -o .cache/jfk.wav https://raw.githubusercontent.com/ggml-org/whisper.cpp/b4938/samples/jfk.wav
npm run test:runtime
npm run test:workflow
~~~

The workflow check uses a fake microphone backed by the public JFK fixture, not your physical microphone. It verifies real repair, continued typing, caret retention, dictation, microphone release and Undo. Set `FIXMYTYPE_CAPTURE=1` to request screenshots too. Chromium capture intermittently reports `UnknownVizError` on this host; capture is separate from the behavioral assertions. Test profiles are isolated temporary directories and contain only synthetic content.

## Boundaries

Only the app-owned editor is supported for insertion and correction. External typing hooks, direct selected-field insertion, TTS, spoken commands and companion capture remain planned. Code and spreadsheet profiles block AI prose repair. The simple chatter filter handles matching letter keys, not arbitrary keyboard damage. The editor is capped at 100,000 characters; a repair request is capped at 4,000 characters.

Audio temporary files are removed on normal completion, cancellation and handled errors. A force-killed process can leave files in `.cache/runtime/sessions`; crash recovery remains open. Drafts are not saved on quit. Do not mistake this developer build for a signed installer or a completed external-application compatibility release.

Navigation: [project home](../../README.md), [installation](../../docs/16-installation.md), [documentation](../../docs/README.md), [delivery plans](../../plans/README.md), [latest workflow evidence](../../plans/evidence/2026-09-05-dictation-workflow.md).
