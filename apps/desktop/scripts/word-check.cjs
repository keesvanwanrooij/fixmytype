const { app, dialog, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");
const assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const profile = process.env.FIXMYTYPE_TEST_PROFILE;
app.disableHardwareAcceleration();
app.setPath("userData", profile);
const deadline = setTimeout(() => app.exit(1), 90000);
let choose, opened;
dialog.showSaveDialog = () =>
  new Promise((resolve) => {
    choose = resolve;
  });
shell.openPath = async (file) => {
  opened = file;
  return "";
};
const sample = "  Hé & <post> 😀\t€12.50\n\nNext.\n";
app.on("browser-window-created", (_event, window) => {
  window.webContents.once("did-finish-load", async () => {
    const run = (source) => window.webContents.executeJavaScript(source);
    const wait = async (source) => {
      for (let i = 0; i < 200; i++) {
        if (await run(source)) return;
        await new Promise((r) => setTimeout(r, 20));
      }
      throw Error("Word fixture condition failed: " + source);
    };
    const text = (value) =>
      run(
        `(()=>{const e=document.querySelector('#writing-editor');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));})()`,
      );
    const click = (selector) =>
      run(`document.querySelector(${JSON.stringify(selector)}).click()`);
    const save = async () => {
      choose = undefined;
      await click("[data-save-word]");
      for (let i = 0; i < 200 && !choose; i++)
        await new Promise((r) => setTimeout(r, 20));
      assert.equal(
        typeof choose,
        "function",
        "Save must reach the native dialog",
      );
    };
    try {
      window.show();
      await wait("Boolean(document.querySelector('[data-save-word]'))");
      assert.equal(
        await run("document.querySelector('[data-save-word]').disabled"),
        true,
      );
      await text(sample);
      await wait("!document.querySelector('[data-save-word]').disabled");
      await save();
      await wait("document.querySelector('[data-save-word]').disabled");
      choose({ canceled: true });
      await wait(
        "document.querySelector('.operation-status').textContent.includes('cancelled')",
      );
      assert.equal(
        await run("document.querySelector('#writing-editor').value"),
        sample,
      );
      const file = path.join(profile, "post.docx");
      await save();
      await wait("document.querySelector('[data-save-word]').disabled");
      // Later edits remain in the editor, but cannot change the snapshot behind the dialog.
      await text(sample + "Later typing.");
      choose({ canceled: false, filePath: file });
      await wait("Boolean(document.querySelector('[data-open-word]'))");
      await wait(
        "document.querySelector('.word-export').textContent.includes('changed since saving')",
      );
      await click("[data-open-word]");
      await wait(
        "document.querySelector('.operation-status').textContent.includes('default .docx')",
      );
      assert.equal(opened, file);
      const bytes = await fs.readFile(file);
      await save();
      await wait("document.querySelector('[data-save-word]').disabled");
      choose({ canceled: false, filePath: file });
      await wait(
        "document.querySelector('.operation-status').textContent.includes('Saving failed')",
      );
      assert.deepEqual(await fs.readFile(file), bytes);
      assert.equal(
        await run("document.querySelector('#writing-editor').value"),
        sample + "Later typing.",
      );
      assert.equal(
        await run("Boolean(document.querySelector('[data-open-word]'))"),
        false,
      );

      await fs.writeFile(path.join(profile, "expected.txt"), sample, "utf8");
      const result = await promisify(execFile)(
        "powershell.exe",
        [
          "-NoProfile",
          "-NonInteractive",
          "-File",
          path.join(__dirname, "word-roundtrip.ps1"),
        ],
        {
          windowsHide: true,
          timeout: 45000,
          env: process.env,
        },
      );
      process.stdout.write(result.stdout);
      if (process.env.FIXMYTYPE_WORD_SCREENSHOT) {
        window.show();
        window.focus();
        await run(
          "document.querySelector('.word-export').scrollIntoView({block:'center'})",
        );
        await new Promise((r) => setTimeout(r, 800));
        await fs.writeFile(
          process.env.FIXMYTYPE_WORD_SCREENSHOT,
          (await window.capturePage()).toPNG(),
        );
      }
      console.log(
        "PASS Word UI: cancel, snapshot, stale notice, exclusive save and named open",
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
