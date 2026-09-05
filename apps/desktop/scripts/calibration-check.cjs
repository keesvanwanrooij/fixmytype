const { app } = require("electron");
const path = require("node:path");
const assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
app.disableHardwareAcceleration();
app.setPath("userData", process.env.FIXMYTYPE_TEST_PROFILE);
const deadline = setTimeout(() => app.exit(1), 45000);
app.on("browser-window-created", (_event, window) => {
  window.webContents.once("did-finish-load", async () => {
    const web = window.webContents,
      run = (source) => web.executeJavaScript(source);
    const wait = async (source) => {
      for (let i = 0; i < 150; i++) {
        if (await run(source)) return;
        await new Promise((r) => setTimeout(r, 20));
      }
      throw Error("Calibration condition failed: " + source);
    };
    const click = (selector) =>
      run(`document.querySelector(${JSON.stringify(selector)}).click()`);
    try {
      await wait(`Boolean(document.querySelector('#writing-editor'))`);
      await run(
        `Array.from(document.querySelectorAll('button')).find(b=>b.textContent.includes('Settings')).click()`,
      );
      await wait(`Boolean(document.querySelector('[data-calibration]'))`);
      assert.ok(
        await run(
          `document.querySelector('[data-calibration-start]').getBoundingClientRect().height>=40`,
        ),
        "Calibration buttons need a readable hit area",
      );
      assert.equal(
        await run(`localStorage.getItem('fixmytype:calibration:v1')`),
        null,
      );
      await click("[data-calibration-start]");
      await wait(`Boolean(document.querySelector('#calibration-capture'))`);
      window.show();
      window.focus();
      web.focus();
      await run(
        `window.deliveredKeys=0;document.addEventListener('keydown',()=>window.deliveredKeys++);void 0;`,
      );
      // Real Chromium input, with a deterministic synthetic event clock. No physical keyboard.
      await run(
        `window.calibrationClock=1000;Object.defineProperty(KeyboardEvent.prototype,'timeStamp',{configurable:true,get(){return window.calibrationClock;}});void 0;`,
      );
      let clock = 1000;
      const press = async (at, keyCode = "A", modifiers = []) => {
        const delivered = await run(`window.deliveredKeys`);
        await run(`window.calibrationClock=${at};void 0;`);
        web.sendInputEvent({ type: "keyDown", keyCode, modifiers });
        web.sendInputEvent({ type: "keyUp", keyCode, modifiers });
        await wait(`window.deliveredKeys>${delivered}`);
      };
      for (let i = 0; i < 20; i++) {
        await run(`document.querySelector('#calibration-capture').focus()`);
        await press(clock);
        await press(clock + (i < 10 ? 12 : 40));
        await wait(
          `Boolean(document.querySelector('[data-calibration-pair]'))`,
        );
        await click(
          i < 10 ? '[data-label="accidental"]' : '[data-label="deliberate"]',
        );
        await wait(
          `document.querySelector('[data-calibration-count]').textContent.includes('${i + 1}/60')`,
        );
        clock += 1000;
      }
      await click("[data-calibration-review]");
      await wait(
        `Boolean(document.querySelector('[data-calibration-accept]'))`,
      );
      assert.equal(
        await run(`localStorage.getItem('fixmytype:calibration:v1')`),
        null,
        "Review cannot persist consent",
      );
      await run(
        `window.originalCalibrationSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='fixmytype:calibration:v1')throw Error('synthetic denial');return window.originalCalibrationSetItem.call(this,key,value);};void 0;`,
      );
      await click("[data-calibration-accept]");
      await wait(
        `document.querySelector('[data-calibration]').textContent.includes('Nothing new was saved')`,
      );
      assert.equal(
        await run(`localStorage.getItem('fixmytype:calibration:v1')`),
        null,
      );
      await run(
        `Storage.prototype.setItem=window.originalCalibrationSetItem;void 0;`,
      );
      await click("[data-calibration-accept]");
      await wait(`Boolean(localStorage.getItem('fixmytype:calibration:v1'))`);
      const stored = await run(
        `JSON.parse(localStorage.getItem('fixmytype:calibration:v1'))`,
      );
      assert.deepEqual(stored.values.KeyA, {
        level: 2,
        accidentalCount: 10,
        deliberateCount: 10,
      });
      assert.ok(!JSON.stringify(stored).includes("interval"));
      await run(
        `Array.from(document.querySelectorAll('nav button')).find(b=>b.textContent.includes('Write')).click()`,
      );
      await wait(`Boolean(document.querySelector('#writing-editor'))`);
      await run(
        `window.filteredDowns=[];window.filteredUps=[];document.addEventListener('keydown',e=>window.filteredDowns.push(e.defaultPrevented));document.addEventListener('keyup',e=>window.filteredUps.push(e.defaultPrevented));document.querySelector('#writing-editor').focus();void 0;`,
      );
      await press(100000);
      await press(100012);
      assert.equal(
        await run(`window.filteredDowns.at(-1)`),
        true,
        "Accepted KeyA level 2 must filter a 12ms repeat",
      );
      await press(101000, "B");
      await press(101012, "B");
      assert.equal(
        await run(`window.filteredDowns.at(-1)`),
        false,
        "An uncalibrated key keeps general level 1",
      );
      await press(102000, "A", ["shift"]);
      await press(102012, "A", ["shift"]);
      assert.equal(
        await run(`window.filteredDowns.at(-1)`),
        false,
        "Shift preserves input",
      );
      await click(".inline-check input");
      await run(`document.querySelector('#writing-editor').focus();void 0;`);
      await press(103000);
      await press(103012);
      assert.equal(
        await run(`window.filteredDowns.at(-1)`),
        false,
        "Pause must immediately preserve input",
      );
      assert.equal(
        await run(`window.filteredUps.some(Boolean)`),
        false,
        "Key-up events are never suppressed",
      );
      await run(
        `Array.from(document.querySelectorAll('nav button')).find(b=>b.textContent.includes('Settings')).click()`,
      );
      await wait(`Boolean(document.querySelector('[data-calibration-start]'))`);
      await click("[data-calibration-start]");
      await click("[data-calibration-cancel]");
      assert.deepEqual(
        await run(
          `JSON.parse(localStorage.getItem('fixmytype:calibration:v1'))`,
        ),
        stored,
      );
      await run(
        `(()=>{const el=document.querySelector('.settings-grid select');el.value='nl';el.dispatchEvent(new Event('change',{bubbles:true}));})()`,
      );
      await run(`document.querySelector('.save-row button').click()`);
      await wait(`document.documentElement.lang==='nl'`);
      await wait(
        `document.querySelector('[data-calibration]').textContent.includes('Toetskalibratie')`,
      );
      if (process.env.FIXMYTYPE_CAPTURE === "1") {
        await click("[data-calibration-start]");
        await run(
          `document.querySelector('[data-calibration]').scrollIntoView({block:'start'});void 0;`,
        );
        window.show();
        window.focus();
        await new Promise((r) => setTimeout(r, 1000));
        require("node:fs").writeFileSync(
          path.join(__dirname, "../.cache/calibration.png"),
          (await window.capturePage()).toPNG(),
        );
        await click("[data-calibration-cancel]");
      }
      await click('[data-calibration-remove="KeyA"]');
      assert.deepEqual(
        await run(
          `JSON.parse(localStorage.getItem('fixmytype:calibration:v1')).values`,
        ),
        {},
      );
      console.log(
        "PASS real calibration: labelled pairs, Rust proposal, explicit acceptance, aggregate-only storage, cancel, NL and removal",
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
