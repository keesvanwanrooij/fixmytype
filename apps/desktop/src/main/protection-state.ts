import type { InterfaceLanguage } from "../shared/settings.js";

const labels = {
  en: { pause: "Pause protection", resume: "Resume protection" },
  nl: { pause: "Bescherming pauzeren", resume: "Bescherming hervatten" }
} as const;

export const nextProtectionEnabled = (current: boolean): boolean => !current;

export const protectionActionLabel = (enabled: boolean, language: InterfaceLanguage = "en"): string => (
  enabled ? labels[language].pause : labels[language].resume
);
