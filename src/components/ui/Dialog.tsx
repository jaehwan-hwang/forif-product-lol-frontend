"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

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
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      const initialTarget =
        dialog?.querySelector<HTMLElement>("[autofocus]") ??
        dialog?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ??
        dialog;
      initialTarget?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused?.isConnected) {
        window.requestAnimationFrame(() => previouslyFocused.focus());
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (pending) return;
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.getAttribute("aria-hidden") !== "true");
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey && currentIndex <= 0) {
        event.preventDefault();
        focusable.at(-1)?.focus();
      } else if (!event.shiftKey && currentIndex === focusable.length - 1) {
        event.preventDefault();
        focusable[0]?.focus();
      } else if (currentIndex === -1) {
        event.preventDefault();
        (event.shiftKey ? focusable.at(-1) : focusable[0])?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open, pending]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={() => !pending && onClose()}>
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className="w-full max-w-md rounded-xl border border-line bg-surface p-6 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="text-xl font-semibold">{title}</h2>
        {description && <p id={descriptionId} className="mt-3 text-base leading-relaxed text-muted">{description}</p>}
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
          if (event.key === "Enter" && value.trim() && !pending) {
            event.preventDefault();
            onConfirm();
          }
        }}
      />
    </Dialog>
  );
}
