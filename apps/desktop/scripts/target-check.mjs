import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import electron from "electron";
const profile = await mkdtemp(path.join(os.tmpdir(), "fixmytype-targets-"));
try {
  await new Promise((resolve, reject) => {
    const child = spawn(
      electron,
      [
        path.join(
          import.meta.dirname,
          process.argv[2] === "calibration"
            ? "calibration-check.cjs"
            : "target-check.cjs",
        ),
      ],
      {
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, FIXMYTYPE_TEST_PROFILE: profile },
      },
    );
    let diagnostics = "";
    child.stdout.pipe(process.stdout);
    child.stderr.on("data", (chunk) => {
      diagnostics += chunk.toString();
      process.stderr.write(chunk);
    });
    child.once("error", reject);
    child.once("exit", (code) =>
      code === 0 && !diagnostics.includes("Error sending from webFrameMain")
        ? resolve()
        : reject(Error(`Target fixture failed: ${code}`)),
    );
  });
} finally {
  await rm(profile, { recursive: true, force: true });
}
