"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

/** 40px round close (Figma "Close": border/card hairline, vuesax add icon turned 45°). */
export function CloseButton({ onClick, label = "Close", className = "" }: { onClick: () => void; label?: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`state flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-card ${className}`}
    >
      <img src="/icons/icon-add-26.svg" alt="" width={26} height={26} className="size-[26px] -rotate-45" />
    </button>
  );
}

/**
 * The log in / onboarding / location pop up as a page: scrim with blur over the page behind, centred card on
 * desktop (480 wide by default, radius 24) and a bottom sheet on mobile with the close button floating
 * 16px above it (M1.08, M5.02). Escape and a scrim click close it.
 *
 * `title` / `subtitle` form the header; `bare` drops the built-in header and padding (map dialog).
 */
export function AuthDialog({
  title,
  subtitle,
  onClose,
  closeLabel = "Close",
  width = 480,
  footer,
  bare = false,
  mobileFull = false,
  tight = false,
  className = "",
  children,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  closeLabel?: string;
  width?: number;
  footer?: ReactNode;
  bare?: boolean;
  /** Full-screen page on mobile instead of a bottom sheet (M1.12 map). */
  mobileFull?: boolean;
  /** 16px top padding and a 40px header (W1.11, W1.12, W5.02) instead of 24px. */
  tight?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    // Inner layers (map search) mark their Escape with preventDefault so the page stays open.
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !e.defaultPrevented && closeRef.current();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Move focus into the dialog unless something inside already has it (e.g. autoFocus input).
    if (ref.current && !ref.current.contains(document.activeElement)) ref.current.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex justify-center md:items-center ${mobileFull ? "items-stretch" : "items-end"}`}>
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[6px]" onClick={onClose} aria-hidden />
      <div
        className={`relative flex w-full flex-col md:w-[var(--dialog-w)] md:max-w-[calc(100vw-48px)] ${mobileFull ? "h-full md:h-auto" : ""}`}
        style={{ ["--dialog-w" as string]: `${width}px` }}
      >
        {!mobileFull && (
          <div className="flex justify-end px-4 pb-4 md:hidden">
            <CloseButton onClick={onClose} label={closeLabel} />
          </div>
        )}
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title && !bare ? titleId : undefined}
          aria-label={bare && typeof title === "string" ? title : undefined}
          tabIndex={-1}
          className={`flex min-h-0 flex-col overflow-hidden bg-card outline-none md:max-h-[calc(100dvh-48px)] md:rounded-2xl ${
            mobileFull ? "h-full md:h-auto" : "max-h-[calc(100dvh-72px)] rounded-t-2xl"
          } ${bare ? "" : `gap-6 px-4 ${tight ? "pt-4" : "pt-6"} pb-[max(24px,env(safe-area-inset-bottom))] md:pb-6`} ${className}`}
        >
          {!bare && (title || subtitle) && (
            <div className="flex items-center gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                {title && (
                  <h1 id={titleId} className="font-display text-h20 font-semibold md:text-h24">
                    {title}
                  </h1>
                )}
                {subtitle && <div className="text-b14 text-ink-2">{subtitle}</div>}
              </div>
              <div className="hidden md:block">
                <CloseButton onClick={onClose} label={closeLabel} />
              </div>
            </div>
          )}
          {bare ? children : <div className="-mx-4 flex min-h-0 flex-1 flex-col overflow-y-auto px-4">{children}</div>}
          {footer}
        </div>
      </div>
    </div>
  );
}
