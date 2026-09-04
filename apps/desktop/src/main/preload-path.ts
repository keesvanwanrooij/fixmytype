import path from "node:path";

export const preloadFileName = "preload.cjs";

export const resolvePreloadPath = (mainDirectory: string): string => (
  path.join(mainDirectory, "..", "preload", preloadFileName)
);
