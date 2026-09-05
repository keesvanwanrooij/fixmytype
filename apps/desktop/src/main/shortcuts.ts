type ShortcutApi = {
  register: (key: string, callback: () => void) => boolean;
  unregister: (key: string) => void;
};
export function replaceShortcuts(
  api: ShortcutApi,
  previous: Record<string, string>,
  next: Record<string, string>,
  dispatch: (action: string) => void,
): boolean {
  for (const key of Object.values(previous)) api.unregister(key);
  const registered: string[] = [];
  try {
    for (const [action, key] of Object.entries(next)) {
      if (!api.register(key, () => dispatch(action)))
        throw new Error("Shortcut unavailable");
      registered.push(key);
    }
    return true;
  } catch {
    for (const key of registered) api.unregister(key);
    for (const [action, key] of Object.entries(previous))
      api.register(key, () => dispatch(action));
    return false;
  }
}
