"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Pop up: centred dialog on desktop (default 560 wide), bottom sheet on mobile.
 * Closing returns to the same place and scroll position (READ FIRST note), so it never navigates.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 560,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      style={{ ["--modal-w" as string]: `${width}px` }}
      className={`fixed inset-x-0 bottom-0 top-auto m-0 max-h-[90dvh] w-full max-w-none overflow-hidden rounded-t-2xl bg-card p-0 text-ink backdrop:bg-ink/40 backdrop:backdrop-blur-sm open:flex open:flex-col md:inset-0 md:m-auto md:max-h-[85dvh] md:w-[var(--modal-w)] md:rounded-2xl ${className}`}
    >
      {title !== undefined && (
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-4 md:px-6">
          <h2 className="font-display text-h20 font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="state flex size-10 cursor-pointer items-center justify-center rounded-full border border-line">
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto outline-none">{children}</div>
      {footer && <div className="border-t border-line px-4 py-4 md:px-6">{footer}</div>}
    </dialog>
  );
}
