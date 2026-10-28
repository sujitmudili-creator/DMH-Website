"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { CloseButton } from "./AuthDialog";

/**
 * Map error pop up (W5.05 / M5.05 Area not served, W5.06 / M5.06 Location access off): status/danger-tint
 * icon disc, title, text, two buttons. Desktop: 480 dialog, padding 32, close top right, buttons side by side.
 * Mobile: bottom sheet with the close floating above it and the buttons stacked, primary first.
 * Sits above the map pop up; Escape closes only this layer.
 */
export function LocationErrorModal({
  open,
  onClose,
  icon,
  title,
  text,
  secondary,
  primary,
}: {
  open: boolean;
  onClose: () => void;
  icon: string;
  title: string;
  text: string;
  secondary: ReactNode;
  primary: ReactNode;
}) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      closeRef.current();
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      prev?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[6px]" onClick={onClose} aria-hidden />
      <div className="relative flex w-full flex-col md:w-[480px]">
        <div className="flex justify-end px-4 pb-4 md:hidden">
          <CloseButton onClick={onClose} />
        </div>
        <div
          ref={ref}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="flex flex-col gap-6 rounded-t-2xl bg-card px-4 pt-6 pb-[max(24px,env(safe-area-inset-bottom))] outline-none md:rounded-2xl md:p-8"
        >
          <div className="flex items-start justify-between">
            <span className="flex size-16 items-center justify-center rounded-full bg-danger-tint">
              <img src={icon} alt="" width={32} height={32} className="size-8" />
            </span>
            <div className="hidden md:block">
              <CloseButton onClick={onClose} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 id={titleId} className="font-display text-h20 font-semibold md:text-h24">
              {title}
            </h2>
            <p className="text-b14 text-ink-2">{text}</p>
          </div>
          <div className="flex flex-col-reverse gap-3 md:flex-row">
            {secondary}
            {primary}
          </div>
        </div>
      </div>
    </div>
  );
}
