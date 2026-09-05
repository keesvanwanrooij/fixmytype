import { describe, expect, it, vi } from "vitest";
import { replaceShortcuts } from "../src/main/shortcuts.js";
describe("shortcut transaction", () => {
  it("keeps the previous bindings when a new registration fails", () => {
    const active = new Map<string, () => void>();
    const old = { dictate: "Control+Alt+D", repair: "Control+Alt+R" };
    Object.values(old).forEach((key) => active.set(key, () => {}));
    const api = {
      register: vi.fn((key: string, callback: () => void) => {
        if (key === "Control+Alt+X") return false;
        active.set(key, callback);
        return true;
      }),
      unregister: (key: string) => {
        active.delete(key);
      },
    };
    expect(
      replaceShortcuts(
        api,
        old,
        { dictate: "Control+Alt+T", repair: "Control+Alt+X" },
        () => {},
      ),
    ).toBe(false);
    expect([...active.keys()].sort()).toEqual(Object.values(old).sort());
  });
  it("dispatches actions and releases old bindings after a successful change", () => {
    const active = new Map<string, () => void>();
    const action = vi.fn();
    const api = {
      register: (key: string, cb: () => void) => {
        active.set(key, cb);
        return true;
      },
      unregister: (key: string) => {
        active.delete(key);
      },
    };
    expect(
      replaceShortcuts(api, {}, { dictate: "Control+Alt+D" }, action),
    ).toBe(true);
    active.get("Control+Alt+D")!();
    expect(action).toHaveBeenCalledWith("dictate");
  });
});
