export type InterfaceLanguage = "en" | "nl";
export type RepairLanguage = "auto" | InterfaceLanguage;
export type Settings = {
  interfaceLanguage: InterfaceLanguage;
  repairLanguage: RepairLanguage;
  protectionEnabled: boolean;
};

export const createSettings = (): Settings => ({
  interfaceLanguage: "en",
  repairLanguage: "auto",
  protectionEnabled: true
});

export const setInterfaceLanguage = (settings: Settings, interfaceLanguage: InterfaceLanguage): Settings => ({ ...settings, interfaceLanguage });
export const setRepairLanguage = (settings: Settings, repairLanguage: RepairLanguage): Settings => ({ ...settings, repairLanguage });
export const setProtectionEnabled = (settings: Settings, protectionEnabled: boolean): Settings => ({ ...settings, protectionEnabled });
