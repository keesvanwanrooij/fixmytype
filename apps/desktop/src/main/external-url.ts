export const supportUrl = "https://github.com/sponsors/keesvanwanrooij";

export const isAllowedExternalUrl = (candidate: string): boolean => {
  try {
    return new URL(candidate).href === supportUrl;
  } catch {
    return false;
  }
};
