// Run the real main process and preload against an isolated synthetic profile.
const { app } = require("electron");
app.disableHardwareAcceleration();
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { pathToFileURL } = require("node:url");
const assert = require("node:assert/strict");
(async () => {
  const profile = await fs.mkdtemp(path.join(os.tmpdir(), "fixmytype-smoke-"));
  app.setPath("userData", profile);
  const timeout = setTimeout(() => {
    console.error("Electron smoke timed out");
    app.exit(1);
  }, 20000);
  const errors = [];
  app.on("browser-window-created", (_event, window) => {
    window.webContents.on("console-message", (_event, details) => {
      if (details.level === "error") errors.push(details.message);
    });
    window.webContents.once("did-finish-load", async () => {
      try {
        const web = window.webContents;
        const evaluate = (source) => web.executeJavaScript(source);
        const waitFor = async (source) => {
          for (let i = 0; i < 60; i++) {
            if (await evaluate(source)) return;
            await new Promise((r) => setTimeout(r, 50));
          }
          throw Error("Condition failed: " + source);
        };
        await waitFor('Boolean(document.querySelector("#writing-editor"))');
        assert.equal(
          await evaluate("typeof window.fixMyType.syncPreferences"),
          "function",
        );
        await evaluate('document.querySelector("#writing-editor").focus()');
        web.insertText("My synthetic test draft. Keep my words.");
        await waitFor(
          'document.querySelector("#writing-editor").value.includes("synthetic")',
        );
        await new Promise((r) => setTimeout(r, 150));
        await fs.mkdir(path.join(__dirname, "../.cache"), { recursive: true });
        if (process.env.FIXMYTYPE_CAPTURE === "1")
          await fs.writeFile(
            path.join(__dirname, "../.cache/workspace.png"),
            (await web.capturePage()).toPNG(),
          );
        await evaluate(
          'Array.from(document.querySelectorAll("nav button")).find(b=>b.textContent.includes("Settings")).click()',
        );
        await waitFor(
          'Boolean(document.querySelector(".settings-grid select"))',
        );
        await evaluate(
          '(()=>{const el=document.querySelector(".settings-grid select");el.value="nl";el.dispatchEvent(new Event("change",{bubbles:true}));})()',
        );
        await evaluate('document.querySelector(".primary-button").click()');
        await waitFor('document.documentElement.lang === "nl"');
        assert.equal(
          await evaluate(
            'JSON.parse(localStorage.getItem("fixmytype:preferences:v2")).preferences.repairLanguage',
          ),
          "auto",
        );
        await evaluate(
          'Array.from(document.querySelectorAll("nav button")).find(b=>b.textContent.includes("Schrijven")).click()',
        );
        await waitFor('Boolean(document.querySelector("#writing-editor"))');
        assert.equal(
          await evaluate('document.querySelector("#writing-editor").value'),
          "My synthetic test draft. Keep my words.",
        );
        await evaluate(
          'Array.from(document.querySelectorAll(".segmented button")).find(b=>b.textContent==="Voorstellen").click()',
        );
        await waitFor(
          'JSON.parse(localStorage.getItem("fixmytype:preferences:v2")).preferences.aiMode === "suggest"',
        );
        await evaluate('document.querySelector("#writing-editor").focus()');
        web.focus();
        web.sendInputEvent({ type: "keyDown", keyCode: "Tab" });
        web.sendInputEvent({ type: "keyUp", keyCode: "Tab" });
        await waitFor(
          'document.activeElement === document.querySelector(".support-footer button")',
        );
        window.setSize(740, 600);
        await new Promise((r) => setTimeout(r, 100));
        assert.equal(
          await evaluate(
            "document.documentElement.scrollWidth <= window.innerWidth",
          ),
          true,
        );
        if (process.env.FIXMYTYPE_CAPTURE === "1")
          await fs.writeFile(
            path.join(__dirname, "../.cache/workspace-compact.png"),
            (await web.capturePage()).toPNG(),
          );
        assert.deepEqual(errors, []);
        console.log(
          "PASS: real preload, editor, NL persistence, separate repair language, retained draft, AI mode, keyboard focus, compact layout, no renderer errors.",
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
