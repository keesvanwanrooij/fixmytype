// Real Electron, preload, microphone pipeline and local engines. No physical microphone.
const { app } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { pathToFileURL } = require("node:url");
const assert = require("node:assert/strict");
app.disableHardwareAcceleration();
app.commandLine.appendSwitch("use-fake-device-for-media-stream");
app.commandLine.appendSwitch(
  "use-file-for-fake-audio-capture",
  path.resolve(__dirname, "../.cache/jfk.wav"),
);
(async () => {
  app.setPath(
    "userData",
    await fs.mkdtemp(path.join(os.tmpdir(), "fixmytype-workflow-")),
  );
  const timeout = setTimeout(() => {
    console.error("Workflow timed out");
    app.exit(1);
  }, 150000);
  app.on("browser-window-created", (_event, window) => {
    window.webContents.once("did-finish-load", async () => {
      const web = window.webContents,
        run = (source) => web.executeJavaScript(source);
      const wait = async (source, ms = 10000) => {
        const end = Date.now() + ms;
        while (Date.now() < end) {
          if (await run(source)) return;
          await new Promise((r) => setTimeout(r, 50));
        }
        throw Error(
          "Condition failed: " +
            source +
            "\n" +
            (await run("document.body.innerText")),
        );
      };
      const click = (label) =>
        run(
          `Array.from(document.querySelectorAll('button')).find(b=>b.textContent===${JSON.stringify(label)}).click()`,
        );
      const write = async (value) => {
        await run(
          `(()=>{const el=document.querySelector('#writing-editor');el.focus();el.setSelectionRange(el.value.length,el.value.length);})()`,
        );
        web.insertText(value);
        await wait(
          `document.querySelector('#writing-editor').value.endsWith(${JSON.stringify(value)})`,
        );
      };
      try {
        await wait(`Boolean(document.querySelector('#writing-editor'))`);
        assert.deepEqual(await run("window.fixMyType.status()"), {
          ai: true,
          speech: true,
          worker: true,
        });
        await click("Suggest");
        await write("This sentense has a speling mistake.");
        await wait(
          `document.querySelector('.change-card .badge')?.textContent==='Suggestion'`,
          50000,
        );
        assert.equal(
          await run(`document.querySelector('#writing-editor').value`),
          "This sentense has a speling mistake.",
        );
        await click("Accept");
        await wait(
          `document.querySelector('#writing-editor').value==='This sentence has a spelling mistake.'`,
        );
        await click("Undo");
        await wait(
          `document.querySelector('#writing-editor').value==='This sentense has a speling mistake.'`,
        );
        await click("Automatic");
        await write(" Another sentense has a speling mistake.");
        let startedWhileTyping = false;
        for (let i = 0; i < 20; i++) {
          await write(" more");
          startedWhileTyping ||= await run(
            `document.querySelector('.operation-status').textContent==='Repairing…' || document.querySelector('#writing-editor').value.includes('Another sentence has a spelling mistake.')`,
          );
          await new Promise((r) => setTimeout(r, 100));
        }
        assert.equal(
          startedWhileTyping,
          true,
          "A finished sentence must be processed even when later typing never pauses",
        );
        await write(" My later draft must stay");
        await wait(
          `document.querySelector('#writing-editor').value.includes('Another sentence has a spelling mistake.')`,
          50000,
        );
        assert.ok(
          (
            await run(`document.querySelector('#writing-editor').value`)
          ).endsWith(" My later draft must stay"),
        );
        assert.ok(
          (
            await run(`document.querySelector('#writing-editor').value`)
          ).startsWith("This sentense has a speling mistake."),
          "Undo must not be automatically corrected again",
        );
        assert.equal(
          await run(
            `document.querySelector('#writing-editor').selectionStart === document.querySelector('#writing-editor').value.length`,
          ),
          true,
        );
        await click("Off");
        await write("\n");
        const before = await run(
          `document.querySelector('#writing-editor').value`,
        );
        // Observe only our fake stream so Stop must demonstrably release its tracks.
        await run(
          `(()=>{const original=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=async c=>{const s=await original(c);window.testStream=s;return s;};})()`,
        );
        await click("Dictate");
        await wait(
          `document.querySelector('.operation-status').textContent.includes('Microphone is recording')`,
        );
        await new Promise((r) => setTimeout(r, 14000));
        await click("Stop recording");
        await wait(
          `window.testStream.getTracks().every(t=>t.readyState==='ended')`,
        );
        await wait(
          `document.querySelector('.history-list .change-card h2')?.textContent==='Speech'`,
          30000,
        );
        const after = await run(
          `document.querySelector('#writing-editor').value`,
        );
        assert.ok(after.startsWith(before));
        assert.match(
          after.toLowerCase(),
          /ask not what your country can do for you/,
        );
        await click("Undo");
        await wait(
          `document.querySelector('#writing-editor').value===${JSON.stringify(before)}`,
        );
        await click("Dictate");
        await wait(
          `document.querySelector('.operation-status').textContent.includes('Microphone is recording')`,
        );
        await click("Cancel");
        await wait(
          `window.testStream.getTracks().every(t=>t.readyState==='ended')`,
        );
        assert.equal(
          await run(`document.querySelector('#writing-editor').value`),
          before,
        );
        const denied = await run(
          `navigator.mediaDevices.getUserMedia({audio:true,video:false}).then(s=>{s.getTracks().forEach(t=>t.stop());return false;},()=>true)`,
        );
        assert.equal(
          denied,
          true,
          "The app must deny capture without a new explicit recording session",
        );
        if (process.env.FIXMYTYPE_CAPTURE === "1")
          await fs.writeFile(
            path.join(__dirname, "../.cache/usable-workspace.png"),
            (await web.capturePage()).toPNG(),
          );
        console.log(
          "PASS: real local suggestions, Accept, Undo, automatic old-sentence repair while typing, caret retention, fake-device microphone capture, local Whisper, track cleanup and dictation Undo.",
        );
        clearTimeout(timeout);
        app.quit();
      } catch (error) {
        console.error(error);
        clearTimeout(timeout);
        app.exit(1);
      }
    });
  });
  await import(
    pathToFileURL(path.join(__dirname, "../dist/main/main.js")).href
  );
})();
