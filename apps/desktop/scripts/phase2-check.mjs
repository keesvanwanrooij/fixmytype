import { mkdtemp, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";
import electron from "electron";
const profile = await mkdtemp(path.join(os.tmpdir(), "fixmytype-phase2-"));
try {
  for (const stage of ["write", "restart"])
    await new Promise((resolve, reject) => {
      const child = spawn(
        electron,
        [path.join(import.meta.dirname, "phase2-check.cjs")],
        {
          windowsHide: true,
          stdio: "inherit",
          env: {
            ...process.env,
            FIXMYTYPE_TEST_PROFILE: profile,
            FIXMYTYPE_TEST_STAGE: stage,
          },
        },
      );
      child.once("error", reject);
      child.once("exit", (code) =>
        code === 0
          ? resolve()
          : reject(Error(`Phase 2 ${stage} failed: ${code}`)),
      );
    });
} finally {
  await rm(profile, { recursive: true, force: true, maxRetries: 3 });
}
