export type TargetDescriptor = {
  targetId: string;
  documentId: string;
  scope: "owned" | "external";
  kind:
    "plain" | "password" | "read-only" | "disabled" | "elevated" | "unknown";
};
export type TargetLease = Readonly<
  TargetDescriptor & {
    epoch: number;
    capabilities: Readonly<{ readSelection: boolean; replaceRange: boolean }>;
  }
>;

// A lease permits work on one owned document, never a foreground-window guess.
export class TargetSession {
  private epoch = 0;
  private current: TargetLease | undefined;
  select(target: TargetDescriptor | null): void {
    this.epoch++;
    const allowed =
      target?.scope === "owned" &&
      target.kind === "plain" &&
      Boolean(target.targetId && target.documentId);
    this.current = target
      ? Object.freeze({
          ...target,
          epoch: this.epoch,
          capabilities: Object.freeze({
            readSelection: allowed,
            replaceRange: allowed,
          }),
        })
      : undefined;
  }
  capture(): TargetLease | undefined {
    return this.current?.capabilities.replaceRange ? this.current : undefined;
  }
  allows(lease: TargetLease | undefined): boolean {
    const current = this.capture();
    return Boolean(
      current &&
      lease &&
      current.epoch === lease.epoch &&
      current.targetId === lease.targetId &&
      current.documentId === lease.documentId &&
      lease.scope === "owned" &&
      lease.kind === "plain" &&
      lease.capabilities.replaceRange,
    );
  }
}

type EditorField = {
  tagName: string;
  type: string;
  readOnly: boolean;
  disabled: boolean;
  isConnected: boolean;
};
// Inspect attributes only. Never access text while determining capabilities.
export function editorDescriptor(
  field: EditorField | null,
  expected: EditorField | null,
  documentId: string,
): TargetDescriptor {
  const kind =
    !field || field !== expected || !field.isConnected
      ? "unknown"
      : field.type === "password"
        ? "password"
        : field.readOnly
          ? "read-only"
          : field.disabled
            ? "disabled"
            : field.tagName === "TEXTAREA"
              ? "plain"
              : "unknown";
  return { targetId: "writing-editor", documentId, scope: "owned", kind };
}
