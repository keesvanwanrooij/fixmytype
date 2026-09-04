import type { InterfaceLanguage } from "./settings.js";

export type Copy = {
  about: string;
  aboutBody: string;
  appLanguage: string;
  appName: string;
  automatic: string;
  general: string;
  language: string;
  languageBody: string;
  localSettings: string;
  protection: string;
  protectionBody: string;
  protectionOff: string;
  protectionOn: string;
  repairLanguage: string;
  savedDataInvalid: string;
  savedDataUnavailable: string;
  settings: string;
  support: string;
};

const english: Copy = {
  about: "About",
  aboutBody: "FixMyType keeps these preferences on this Windows profile. It does not store typed text.",
  appLanguage: "App language",
  appName: "FixMyType",
  automatic: "Automatic",
  general: "General",
  language: "Language",
  languageBody: "Choose the language for this app. Repair language stays separate.",
  localSettings: "Local settings",
  protection: "Protection preference",
  protectionBody: "Keyboard protection will follow this preference when it becomes available in a later phase.",
  protectionOff: "Paused",
  protectionOn: "Enabled",
  repairLanguage: "Repair language",
  savedDataInvalid: "Saved settings could not be read. Safe defaults are in use. The saved data was not changed.",
  savedDataUnavailable: "Settings could not be saved on this Windows profile. Your current choices remain open in this window.",
  settings: "Settings",
  support: "Support FixMyType"
};

const dutch: Copy = {
  about: "Over FixMyType",
  aboutBody: "FixMyType bewaart deze voorkeuren in dit Windows-profiel. De app bewaart geen getypte tekst.",
  appLanguage: "Taal van de app",
  appName: "FixMyType",
  automatic: "Automatisch",
  general: "Algemeen",
  language: "Taal",
  languageBody: "Kies de taal van deze app. De hersteltaal blijft apart.",
  localSettings: "Lokale instellingen",
  protection: "Beschermingsvoorkeur",
  protectionBody: "Toetsenbordbescherming volgt deze voorkeur wanneer deze in een latere fase beschikbaar is.",
  protectionOff: "Gepauzeerd",
  protectionOn: "Ingeschakeld",
  repairLanguage: "Hersteltaal",
  savedDataInvalid: "Opgeslagen instellingen konden niet worden gelezen. Veilige standaardinstellingen zijn actief. De opgeslagen gegevens zijn niet gewijzigd.",
  savedDataUnavailable: "Instellingen konden niet in dit Windows-profiel worden bewaard. Je huidige keuzes blijven in dit venster open.",
  settings: "Instellingen",
  support: "Support FixMyType"
};

export const copyFor = (language: InterfaceLanguage): Copy => language === "nl" ? dutch : english;
