const { app, ipcMain } = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");
const assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
app.disableHardwareAcceleration();
app.setPath("userData", process.env.FIXMYTYPE_TEST_PROFILE);
app.commandLine.appendSwitch("use-fake-device-for-media-stream");
app.commandLine.appendSwitch(
  "use-file-for-fake-audio-capture",
  path.resolve(__dirname, "../.cache/jfk.wav"),
);
const deadline = setTimeout(() => app.exit(1), 45000);
app.on("browser-window-created", (_event, window) => {
  window.webContents.once("did-finish-load", async () => {
    const run = (source) => window.webContents.executeJavaScript(source);
    const wait = async (source) => {
      for (let i = 0; i < 300; i++) {
        if (await run(source)) return;
        await new Promise((r) => setTimeout(r, 20));
      }
      throw Error("Dictation condition failed: " + source + "\n" + await run("document.body.innerText"));
    };
    const click = (label) =>
      run(
        `Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()===${JSON.stringify(label)} || (b.closest('nav') && b.textContent.endsWith(${JSON.stringify(label)}))).click()`,
      );
    const text = (value, start = value.length, end = start) =>
      run(
        `(()=>{const e=document.querySelector('#writing-editor');e.focus();Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));e.setSelectionRange(${start},${end});})()`,
      );
    let finish;
    const record = async () => {
      finish = undefined;
      await click("Dictate");
      await wait(
        "document.querySelector('.operation-status').textContent.includes('Microphone is recording')",
      );
      assert.equal(
        await run(
          "document.querySelector('[data-spoken-formatting]').disabled",
        ),
        true,
      );
      await new Promise((r) => setTimeout(r, 1600));
      await click("Stop recording");
      for (let i = 0; i < 300 && !finish; i++)
        await new Promise((r) => setTimeout(r, 20));
      assert.equal(
        typeof finish,
        "function",
        "Real capture must reach transcription",
      );
      assert.equal(
        await run(
          "document.querySelector('[data-spoken-formatting]').disabled",
        ),
        true,
      );
    };
    try {
      window.show();
      await wait("Boolean(document.querySelector('[data-spoken-formatting]'))");
      await wait(
        "document.body.textContent.includes('Local dictation is available')",
      );
      ipcMain.removeHandler("workspace:job");
      ipcMain.handle("workspace:job", (_event, value) => {
        assert.equal(value.kind, "speech");
        assert.ok(value.audio instanceof Uint8Array && value.audio.length > 44);
        return new Promise((resolve) => {
          finish = resolve;
        });
      });
      assert.equal(
        await run("document.querySelector('[data-spoken-formatting]').checked"),
        false,
      );
      await text("");
      await record();
      finish("Hallo opdracht komma wereld");
      await wait(
        "document.querySelector('#writing-editor').value==='Hallo opdracht komma wereld'",
      );
      await click("Undo");
      await wait("document.querySelector('#writing-editor').value===''");
      await run("document.querySelector('[data-spoken-formatting]').click()");
      await text("[replace] Later.", 0, 9);
      await record();
      await text("[replace] Later. More.");
      finish(
        "Hallo opdracht komma wereld opdracht uitroepteken. Opdracht nieuwe alinea. Mijn bericht.",
      );
      const expected = "Hallo, wereld!\n\nMijn bericht. Later. More.";
      await wait(
        `document.querySelector('#writing-editor').value===${JSON.stringify(expected)}`,
      );
      assert.ok(
        await run(
          "document.querySelector('.change-card .original-text').textContent.includes('opdracht komma')",
        ),
      );
      await click("Undo");
      await wait(
        "document.querySelector('#writing-editor').value==='[replace] Later. More.'",
      );
      await text("");
      await record();
      finish("Opdracht nieuwe alinea.");
      await wait(
        `document.querySelector('#writing-editor').value===${JSON.stringify("\n\n")}`,
      );

      await click("Settings");
      await wait("Boolean(document.querySelector('.settings-grid'))");
      await run(
        "(()=>{const e=document.querySelector('.settings-grid select');Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(e,'nl');e.dispatchEvent(new Event('change',{bubbles:true}));})()",
      );
      await click("Save preferences");
      await wait(
        "document.querySelector('.save-row').textContent.includes('Voorkeuren opgeslagen')",
      );
      await click("Schrijven");
      await wait(
        "document.querySelector('[data-save-word]').textContent==='Word-document opslaan'",
      );
      assert.ok(
        await run(
          "document.querySelector('.dictation-options').textContent.includes('opdracht nieuwe alinea')",
        ),
      );
      if (process.env.FIXMYTYPE_DICTATION_SCREENSHOT) {
        await text("Hallo, wereld!\n\nDit is mijn eerste bericht.");
        await run(
          "document.querySelector('.dictation-options').scrollIntoView({block:'start'})",
        );
        window.focus();
        await new Promise((r) => setTimeout(r, 800));
        await fs.writeFile(
          process.env.FIXMYTYPE_DICTATION_SCREENSHOT,
          (await window.capturePage()).toPNG(),
        );
      }
      console.log(
        "PASS dictation UI: literal default, opt-in formatting, later typing, raw transcript, Undo, paragraph-only insertion and NL controls",
      );
      clearTimeout(deadline);
      app.quit();
    } catch (error) {
      console.error(error);
      app.exit(1);
    }
  });
});
void import(pathToFileURL(path.join(__dirname, "../dist/main/main.js")).href);
