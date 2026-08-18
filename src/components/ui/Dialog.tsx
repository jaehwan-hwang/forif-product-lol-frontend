"use client";

import { useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";

export function Dialog({
  open,
  title,
  description,
  children,
  confirmLabel = "확인",
  cancelLabel = "취소",
  danger = false,
  pending = false,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  pending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) onClose();
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [onClose, open, pending]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={() => !pending && onClose()}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-dialog-title"
        className="w-full max-w-md rounded-xl border border-line bg-surface p-6 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="custom-dialog-title" className="text-xl font-semibold">{title}</h2>
        {description && <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>}
        {children && <div className="mt-5">{children}</div>}
        <div className="mt-6 flex justify-end gap-2 border-t border-line-soft pt-4">
          <Button type="button" size="sm" disabled={pending} onClick={onClose}>{cancelLabel}</Button>
          <Button
            type="button"
            size="sm"
            variant={danger ? "danger" : "primary"}
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? "처리 중…" : confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}

export function TextPromptDialog({
  open,
  title,
  description,
  value,
  onValueChange,
  maxLength,
  confirmLabel = "저장",
  pending = false,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description?: string;
  value: string;
  onValueChange: (value: string) => void;
  maxLength?: number;
  confirmLabel?: string;
  pending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={open}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      pending={pending}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <Input
        autoFocus
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        maxLength={maxLength}
        onKeyDown={(event) => {
          if (event.key === "Enter" && value.trim()) onConfirm();
        }}
      />
    </Dialog>
  );
}
