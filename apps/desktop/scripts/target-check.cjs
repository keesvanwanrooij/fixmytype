const { app, ipcMain } = require("electron");
const path = require("node:path");
const assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
app.disableHardwareAcceleration();
app.setPath("userData", process.env.FIXMYTYPE_TEST_PROFILE);
const deadline = setTimeout(() => app.exit(1), 30000);
let workerPid;
const childProcess = require("node:child_process");
const originalSpawn = childProcess.spawn;
childProcess.spawn = function (executable, ...args) {
  const child = originalSpawn.call(this, executable, ...args);
  if (executable.endsWith("fixmytype-input-worker.exe")) workerPid = child.pid;
  return child;
};
require("node:module").syncBuiltinESMExports();
app.on("will-quit", (event) => {
  event.preventDefault();
  setTimeout(() => {
    try {
      assert.ok(workerPid, "The real app must have started its native child");
      assert.throws(
        () => process.kill(workerPid, 0),
        "Quit must release the native child",
      );
      console.log("PASS real Electron quit: native child exited");
      app.exit(0);
    } catch (error) {
      console.error(error);
      app.exit(1);
    }
  }, 750);
});
app.on("browser-window-created", (_event, window) => {
  const web = window.webContents;
  web.once("did-finish-load", async () => {
    const run = (source) => web.executeJavaScript(source);
    const wait = async (source) => {
      for (let i = 0; i < 200; i++) {
        if (await run(source)) return;
        await new Promise((r) => setTimeout(r, 25));
      }
      throw Error("Target fixture timed out: " + source);
    };
    let finish,
      requested = false;
    try {
      await wait(`Boolean(document.querySelector('#writing-editor'))`);
      // Only this synthetic test app's job handler is replaced. No inference or microphone needed.
      ipcMain.removeHandler("workspace:job");
      ipcMain.handle("workspace:job", () => {
        requested = true;
        return new Promise((r) => (finish = r));
      });
      await run(
        `(()=>{const controls=Array.from(document.querySelectorAll('button'));controls.find(b=>b.textContent.trim()==='Automatic').click();})()`,
      );
      await run(
        `(()=>{const el=document.querySelector('#writing-editor');el.focus();Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(el,'Thiss needs repair');el.dispatchEvent(new Event('input',{bubbles:true}));})()`,
      );
      await wait(
        `!document.querySelector('.toolbar .primary-button').disabled`,
      );
      await run(`document.querySelector('.toolbar .primary-button').click()`);
      for (let i = 0; !requested && i < 100; i++)
        await new Promise((r) => setTimeout(r, 20));
      assert.ok(requested, "The controlled repair must be waiting");
      await run(
        `(()=>{const field=document.createElement('input');field.type='password';field.id='protected-fixture';field.value='synthetic password';document.querySelector('main').append(field);field.focus();})()`,
      );
      await run(`document.querySelector('#writing-editor').focus();void 0;`);
      finish("This needs repair");
      await wait(`document.body.textContent.includes('This needs repair')`);
      assert.equal(
        await run(`document.querySelector('#writing-editor').value`),
        "Thiss needs repair",
      );
      assert.equal(
        await run(`document.querySelector('#protected-fixture').value`),
        "synthetic password",
      );
      // A read-only editor also refuses mutation even when its original lease remains current.
      await run(
        `document.querySelector('#protected-fixture').remove();document.querySelector('#writing-editor').focus();void 0;`,
      );
      requested = false;
      await wait(
        `!document.querySelector('.toolbar .primary-button').disabled`,
      );
      await run(`document.querySelector('.toolbar .primary-button').click()`);
      for (let i = 0; !requested && i < 100; i++)
        await new Promise((r) => setTimeout(r, 20));
      assert.ok(requested);
      await run(
        `document.querySelector('#writing-editor').readOnly=true;void 0;`,
      );
      finish("This needs repair again");
      await wait(
        `document.body.textContent.includes('This needs repair again')`,
      );
      assert.equal(
        await run(`document.querySelector('#writing-editor').value`),
        "Thiss needs repair",
      );
      await run(
        `document.querySelector('#writing-editor').readOnly=false;void 0;`,
      );
      // Normal app-owned mutation remains usable after denial.
      requested = false;
      await wait(
        `!document.querySelector('.toolbar .primary-button').disabled`,
      );
      await run(`document.querySelector('.toolbar .primary-button').click()`);
      for (let i = 0; !requested && i < 100; i++)
        await new Promise((r) => setTimeout(r, 20));
      assert.ok(requested);
      finish("This needs repair");
      await wait(
        `document.querySelector('#writing-editor').value==='This needs repair'`,
      );
      console.log(
        "PASS real Electron: focus-change draft, password untouched, read-only denied, normal editor applies",
      );
      const previousPid = workerPid;
      web.forcefullyCrashRenderer();
      let stopped = false;
      for (let i = 0; i < 100; i++) {
        try {
          process.kill(previousPid, 0);
        } catch {
          stopped = true;
          break;
        }
        await new Promise((r) => setTimeout(r, 20));
      }
      assert.ok(stopped, "Renderer failure must release its worker");
      const reloaded = new Promise((resolve) =>
        web.once("did-finish-load", resolve),
      );
      web.reload();
      await reloaded;
      await wait(`Boolean(document.querySelector('#writing-editor'))`);
      assert.equal((await run(`window.fixMyType.status()`)).worker, true);
      assert.notEqual(workerPid, previousPid);
      console.log(
        "PASS renderer crash: child stopped, reload created a fresh idle worker",
      );
      clearTimeout(deadline);
      app.quit();
    } catch (error) {
      console.error(error);
      clearTimeout(deadline);
      app.exit(1);
    }
  });
});
void import(pathToFileURL(path.join(__dirname, "../dist/main/main.js")).href);
