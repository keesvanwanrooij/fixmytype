// Exercise the real app in two processes. The parent owns and removes this synthetic profile.
const { app, Tray } = require("electron");
const path = require("node:path");
const assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
app.disableHardwareAcceleration();
app.setPath("userData", process.env.FIXMYTYPE_TEST_PROFILE);
let trayMenu;
const original = Tray.prototype.setContextMenu;
Tray.prototype.setContextMenu = function (menu) {
  trayMenu = menu;
  return original.call(this, menu);
};
const deadline = setTimeout(() => app.exit(1), 30000);
app.on("browser-window-created", (_event, window) => {
  window.webContents.once("did-finish-load", async () => {
    const web = window.webContents,
      run = (source) => web.executeJavaScript(source);
    const wait = async (source) => {
      for (let i = 0; i < 100; i++) {
        if (await run(source)) return;
        await new Promise((r) => setTimeout(r, 30));
      }
      throw Error("Failed: " + source);
    };
    const click = (label) =>
      run(
        `Array.from(document.querySelectorAll('button')).find(b=>b.textContent.includes(${JSON.stringify(label)})).click()`,
      );
    async function tabEveryControl() {
      const count = await run(
        `(()=>{window.testControls=Array.from(document.querySelectorAll('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled)')).filter(e=>e.getClientRects().length>0);window.testControls.forEach((e,i)=>e.dataset.testFocus=String(i));window.testControls[0].focus();return window.testControls.length;})()`,
      );
      assert.ok(count > 10);
      web.focus();
      for (let i = 1; i < count; i++) {
        web.sendInputEvent({ type: "keyDown", keyCode: "Tab" });
        web.sendInputEvent({ type: "keyUp", keyCode: "Tab" });
        await wait(
          `document.activeElement?.dataset.testFocus===${JSON.stringify(String(i))}`,
        );
      }
      assert.equal(
        await run(
          `document.activeElement.textContent.includes('Support FixMyType')`,
        ),
        true,
      );
    }
    try {
      await wait(`Boolean(document.querySelector('#writing-editor'))`);
      if (process.env.FIXMYTYPE_TEST_STAGE === "restart") {
        await wait(`document.documentElement.lang==='nl'`);
        assert.equal(
          await run(
            `JSON.parse(localStorage.getItem('fixmytype:preferences:v2')).preferences.repairLanguage`,
          ),
          "auto",
        );
      } else {
        await tabEveryControl();
        await click("Settings");
        await wait(`Boolean(document.querySelector('.save-row'))`);
        await tabEveryControl();
        // A storage failure must not produce a success message in the same Settings screen.
        await run(
          `window.originalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('synthetic denial');};void 0;`,
        );
        await click("Save preferences");
        await wait(
          `document.querySelector('.save-row [role=status]').textContent.includes('Local storage is unavailable')`,
        );
        await run(`Storage.prototype.setItem=window.originalSetItem;void 0;`);
        await run(
          `(()=>{const e=document.querySelector('.settings-grid select');e.value='nl';e.dispatchEvent(new Event('change',{bubbles:true}));})()`,
        );
        await click("Save preferences");
        await wait(`document.documentElement.lang==='nl'`);
        await tabEveryControl();
        await click("Schrijven");
        await wait(`Boolean(document.querySelector('#writing-editor'))`);
        await tabEveryControl();
      }
      assert.deepEqual(
        trayMenu.items
          .filter((i) => i.type !== "separator")
          .map((i) => i.label),
        [
          "FixMyType openen",
          "Venster verbergen",
          "Bescherming pauzeren",
          "FixMyType afsluiten",
        ],
      );
      window.close();
      assert.equal(window.isDestroyed(), false);
      assert.equal(window.isVisible(), false);
      trayMenu.items[0].click();
      assert.equal(window.isVisible(), true);
      web.session.flushStorageData();
      console.log("PASS phase 2: " + process.env.FIXMYTYPE_TEST_STAGE);
      clearTimeout(deadline);
      trayMenu.items.at(-1).click();
    } catch (error) {
      console.error(error);
      clearTimeout(deadline);
      app.exit(1);
    }
  });
});
void import(pathToFileURL(path.join(__dirname, "../dist/main/main.js")).href);
