const { app, ipcMain } = require("electron");
const path = require("node:path");
const assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
app.disableHardwareAcceleration();
app.setPath("userData", process.env.FIXMYTYPE_TEST_PROFILE);
const deadline = setTimeout(() => app.exit(1), 30000);
app.on("browser-window-created", (_event, window) => {
  window.webContents.once("did-finish-load", async () => {
    const run = (source) => window.webContents.executeJavaScript(source);
    const wait = async (source) => {
      for (let i = 0; i < 200; i++) {
        if (await run(source)) return;
        await new Promise((r) => setTimeout(r, 20));
      }
      throw Error("Repair condition failed: " + source);
    };
    const click = (label) =>
      run(
        `Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()===${JSON.stringify(label)} || (b.closest('nav') && b.textContent.endsWith(${JSON.stringify(label)}))).click()`,
      );
    let finish, fail, latestIntent;
    const begin = async (label = "Repair text / selection") => {
      finish = undefined;
      await wait(
        "!document.querySelector('.toolbar .primary-button').disabled",
      );
      await click(label);
      for (let i = 0; i < 200 && !finish; i++)
        await new Promise((r) => setTimeout(r, 20));
      assert.equal(typeof finish, "function");
    };
    try {
      await wait("Boolean(document.querySelector('#writing-editor'))");
      window.hide();
      assert.equal(
        await run(
          "window.fixMyType.repair('Synthetic hidden request',{}).then(()=>false,e=>String(e).includes('WINDOW_NOT_VISIBLE'))",
        ),
        true,
      );
      window.show();
      ipcMain.removeHandler("workspace:job");
      ipcMain.handle(
        "workspace:job",
        (_event, job) =>
          new Promise((resolve, reject) => {
            latestIntent = job.intent;
            finish = resolve;
            fail = reject;
          }),
      );
      await run(
        "(()=>{const e=document.querySelector('#writing-editor');e.focus();Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,'Thiss is my post');e.dispatchEvent(new Event('input',{bubbles:true}));})()",
      );
      await click("Automatic");
      await begin();
      await click("Off");
      finish("This is my post");
      await wait("!document.body.textContent.includes('Repairing…')");
      assert.equal(
        await run("document.querySelector('#writing-editor').value"),
        "Thiss is my post",
      );
      assert.equal(
        await run("document.querySelectorAll('.change-card').length"),
        0,
      );

      await click("Suggest");
      await begin();
      finish("This is my post");
      await wait(
        "document.querySelector('.change-card .badge')?.textContent==='Suggestion'",
      );
      await click("Ignore");
      await wait(
        "document.querySelector('.change-card .badge').textContent==='Ignored'",
      );
      assert.equal(
        await run("document.querySelector('#writing-editor').value"),
        "Thiss is my post",
      );

      await begin();
      fail(Error("SYNTHETIC_RUNTIME_DISCONNECT"));
      await wait(
        "document.querySelector('.operation-status').textContent.includes('Repair failed')",
      );
      assert.equal(
        await run("document.querySelector('#writing-editor').value"),
        "Thiss is my post",
      );

      await begin();
      await click("Settings");
      await wait("Boolean(document.querySelector('.settings-grid'))");
      await run(
        "(()=>{const e=Array.from(document.querySelectorAll('label')).find(l=>l.textContent.includes('Your vocabulary')).querySelector('textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,'FixMyType');e.dispatchEvent(new Event('input',{bubbles:true}));})()",
      );
      await click("Save preferences");
      await wait(
        "document.querySelector('.save-row').textContent.includes('Preferences saved.')",
      );
      await click("Write");
      finish("Old vocabulary must not apply");
      await wait("!document.body.textContent.includes('Repairing…')");
      assert.equal(
        await run("document.querySelectorAll('.change-card').length"),
        1,
      );
      assert.equal(
        await run("document.querySelector('#writing-editor').value"),
        "Thiss is my post",
      );
      console.log(
        "PASS repair UI: hidden-window denial, mode Off, Ignore, runtime failure and vocabulary cancellation preserve text",
      );
      await click("Automatic");
      await begin("Rewrite text / selection");
      assert.equal(latestIntent, "rewrite");
      await run(
        "(()=>{const e=document.querySelector('#writing-editor');e.focus();Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,e.value+' Later text.');e.dispatchEvent(new Event('input',{bubbles:true}));})()",
      );
      finish("Here is my post");
      await wait(
        "document.querySelector('.change-card .badge')?.textContent==='Suggestion'",
      );
      assert.equal(
        await run("document.querySelector('#writing-editor').value"),
        "Thiss is my post Later text.",
      );
      await click("Accept");
      await wait(
        "document.querySelector('#writing-editor').value==='Here is my post Later text.'",
      );
      await click("Undo");
      await wait(
        "document.querySelector('#writing-editor').value==='Thiss is my post Later text.'",
      );
      await click("Off");
      assert.equal(
        await run("document.querySelector('[data-rewrite]').disabled"),
        true,
      );
      console.log(
        "PASS rewrite UI: explicit intent, proposal in Automatic, Accept and Undo preserve later typing",
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
