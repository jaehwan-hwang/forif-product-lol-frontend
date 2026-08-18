import type { InputHTMLAttributes, ReactNode } from "react";

export function Checkbox({
  children,
  className = "",
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  children: ReactNode;
}) {
  return (
    <label className={`inline-flex cursor-pointer items-center gap-2.5 text-sm text-muted ${className}`}>
      <input {...props} type="checkbox" className="peer sr-only" />
      <span className="grid size-5 shrink-0 place-items-center rounded border border-line bg-bg text-transparent transition-colors peer-checked:border-gold peer-checked:bg-gold peer-checked:text-bg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold peer-disabled:opacity-40">
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5" fill="none">
          <path d="m3 8.5 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  );
}
