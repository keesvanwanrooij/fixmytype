import type { InterfaceLanguage } from "../shared/settings.js";
export const trayCopy = (language: InterfaceLanguage) =>
  language === "nl"
    ? {
        open: "FixMyType openen",
        hide: "Venster verbergen",
        quit: "FixMyType afsluiten",
        tooltip: "FixMyType schrijfplek",
      }
    : {
        open: "Open FixMyType",
        hide: "Hide window",
        quit: "Quit FixMyType",
        tooltip: "FixMyType workspace",
      };
