export type InterfaceLanguage = "en" | "nl";
export type RepairLanguage = "auto" | InterfaceLanguage;
export type Settings = { interfaceLanguage: InterfaceLanguage; repairLanguage: RepairLanguage };
export const createSettings = (): Settings => ({ interfaceLanguage: "en", repairLanguage: "auto" });
export const setInterfaceLanguage = (settings: Settings, interfaceLanguage: InterfaceLanguage): Settings => ({ ...settings, interfaceLanguage });
export const setRepairLanguage = (settings: Settings, repairLanguage: RepairLanguage): Settings => ({ ...settings, repairLanguage });
