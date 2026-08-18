"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export interface SelectOption {
  value: string;
  label: string;
  keywords?: string;
  prefix?: ReactNode;
  disabled?: boolean;
}

export function Select({
  value,
  options,
  onChange,
  placeholder = "선택해 주세요",
  ariaLabel,
  searchable = false,
  searchPlaceholder = "검색",
  disabled = false,
  placement = "bottom",
  className = "",
}: {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  placement?: "top" | "bottom";
  className?: string;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const selected = options.find((option) => option.value === value);
  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ko");
    if (!normalized) return options;
    return options.filter((option) =>
      `${option.label} ${option.keywords ?? ""}`
        .toLocaleLowerCase("ko")
        .includes(normalized),
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (searchable) window.requestAnimationFrame(() => searchRef.current?.focus());
  }, [open, searchable]);

  function select(option: SelectOption) {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
    setQuery("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      setQuery("");
      return;
    }
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      return;
    }
    if (!open || filteredOptions.length === 0) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) =>
        (current + direction + filteredOptions.length) % filteredOptions.length,
      );
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const option = filteredOptions[activeIndex];
      if (option) select(option);
    }
  }

  return (
    <div
      ref={rootRef}
      className={`relative min-w-0 ${className}`}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={id}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => {
          if (open) {
            setOpen(false);
            setQuery("");
            return;
          }
          const selectedIndex = options.findIndex((option) => option.value === value);
          setActiveIndex(Math.max(0, selectedIndex));
          setOpen(true);
        }}
        className={`flex h-10 w-full min-w-0 items-center justify-between gap-3 rounded-md border bg-bg px-3 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
          open ? "border-gold" : "border-line hover:border-dim"
        }`}
      >
        <span className={`flex min-w-0 items-center gap-2 truncate ${selected ? "text-text" : "text-dim"}`}>
          {selected?.prefix}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </span>
        <span
          aria-hidden="true"
          className={`shrink-0 text-xs text-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          className={`absolute left-0 z-50 w-full min-w-52 rounded-lg border border-line bg-surface p-1.5 shadow-2xl ${
            placement === "top" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]"
          }`}
        >
          {searchable && (
            <label className="mb-1.5 flex h-9 items-center gap-2 rounded-md border border-line bg-bg px-3">
              <span aria-hidden="true" className="text-muted">⌕</span>
              <span className="sr-only">{searchPlaceholder}</span>
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                placeholder={searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-dim"
              />
            </label>
          )}
          <ul id={id} role="listbox" aria-label={ariaLabel} className="custom-scrollbar max-h-64 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  disabled={option.disabled}
                  onPointerMove={() => setActiveIndex(index)}
                  onClick={() => select(option)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors disabled:opacity-35 ${
                    option.value === value
                      ? "bg-gold/15 text-gold"
                      : index === activeIndex
                        ? "bg-raised text-text"
                        : "text-muted hover:bg-raised hover:text-text"
                  }`}
                >
                  {option.prefix}
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {option.value === value && <span aria-hidden="true">✓</span>}
                </button>
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-muted">검색 결과가 없습니다.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
