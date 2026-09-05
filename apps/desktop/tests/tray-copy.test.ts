import { expect, it } from "vitest";
import { trayCopy } from "../src/main/tray-copy.js";
it("keeps every tray action in the selected interface language", () => {
  expect(trayCopy("nl")).toEqual({
    open: "FixMyType openen",
    hide: "Venster verbergen",
    quit: "FixMyType afsluiten",
    tooltip: "FixMyType schrijfplek",
  });
  expect(trayCopy("en")).toEqual({
    open: "Open FixMyType",
    hide: "Hide window",
    quit: "Quit FixMyType",
    tooltip: "FixMyType workspace",
  });
});
