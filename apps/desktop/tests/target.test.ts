import { describe, expect, it } from "vitest";
import {
  TargetSession,
  editorDescriptor,
  type TargetDescriptor,
} from "../src/shared/target.js";

const owned: TargetDescriptor = {
  targetId: "editor",
  documentId: "draft-1",
  scope: "owned",
  kind: "plain",
};
describe("target leases", () => {
  it("allows only the current owned document and consent epoch", () => {
    const session = new TargetSession();
    expect(session.capture()).toBeUndefined();
    session.select(owned);
    const first = session.capture()!;
    expect(session.allows(first)).toBe(true);
    session.select({ ...owned, documentId: "draft-2" });
    expect(session.allows(first)).toBe(false);
    session.select(owned);
    expect(session.allows(first)).toBe(false);
    const current = session.capture()!;
    session.select(null);
    expect(session.allows(current)).toBe(false);
  });
  it.each([
    "password",
    "read-only",
    "disabled",
    "elevated",
    "unknown",
  ] as const)("denies %s without granting capabilities", (kind) => {
    const session = new TargetSession();
    session.select({ ...owned, kind });
    expect(session.capture()).toBeUndefined();
  });
  it("denies external controls even when they look editable", () => {
    const session = new TargetSession();
    session.select({ ...owned, scope: "external" });
    expect(session.capture()).toBeUndefined();
  });
  it("does not let caller mutation expand a lease", () => {
    const session = new TargetSession();
    const descriptor = { ...owned };
    session.select(descriptor);
    descriptor.kind = "password";
    const lease = session.capture()!;
    expect(session.allows({ ...lease, documentId: "other" })).toBe(false);
    expect(session.allows({ ...lease, epoch: lease.epoch + 1 })).toBe(false);
  });
});
describe("owned editor adapter", () => {
  const plain = {
    tagName: "TEXTAREA",
    type: "textarea",
    readOnly: false,
    disabled: false,
    isConnected: true,
  };
  it("requires the exact mounted editor, without reading its value", () => {
    const field = {
      ...plain,
      get value(): string {
        throw Error("must not read text");
      },
    };
    expect(editorDescriptor(field, field, "draft-1").kind).toBe("plain");
    expect(editorDescriptor({ ...plain }, field, "draft-1").kind).toBe(
      "unknown",
    );
  });
  it.each([
    [{ ...plain, type: "password" }, "password"],
    [{ ...plain, readOnly: true }, "read-only"],
    [{ ...plain, disabled: true }, "disabled"],
    [{ ...plain, isConnected: false }, "unknown"],
  ] as const)("blocks a protected or detached field", (field, expected) => {
    expect(editorDescriptor(field, field, "draft-1").kind).toBe(expected);
  });
});
