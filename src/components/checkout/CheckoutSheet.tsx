"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AppBarIconLink } from "@/components/site/MobileAppBar";
import { routes } from "@/lib/routes";

/** Round 40 close button: the vuesax "add" icon turned 45° (Figma "Close"). */
export function CloseButton({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className={`state flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-card ${className}`}
    >
      <img src="/icons/icon-add-26.svg" alt="" className="size-[26px] -rotate-45" />
    </button>
  );
}

/**
 * Checkout pop ups. Desktop: centred dialog (`width`, radius 24). Mobile:
 * - `mobile="sheet"`: bottom sheet with the close button floating above it (M1.15, M3.09);
 * - `mobile="page"`: full screen with an app bar (M3.02 Coupons).
 * `lead` sits left of the close button on desktop (a title or an icon badge).
 */
export function CheckoutSheet({
  open,
  onClose,
  label,
  lead,
  width = 480,
  padding = "md:px-4 md:pt-4 md:pb-6",
  mobile = "sheet",
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** Accessible name; also the mobile app bar title in page mode. */
  label: string;
  lead?: ReactNode;
  width?: number;
  padding?: string;
  mobile?: "sheet" | "page";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  const page = mobile === "page";

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === ref.current && onClose()}
      style={{ ["--sheet-w" as string]: `${width}px` }}
      className={`fixed m-0 max-h-none max-w-none overflow-visible bg-transparent p-0 text-ink backdrop:bg-ink/40 backdrop:backdrop-blur-[2px] open:flex md:inset-0 md:m-auto md:h-fit md:w-[var(--sheet-w)] md:max-w-[calc(100vw-32px)] ${
        page ? "inset-0 h-dvh w-full" : "inset-x-0 top-auto bottom-0 w-full"
      }`}
    >
      {!page && <CloseButton onClick={onClose} className="absolute -top-14 right-4 md:hidden" />}
      <div
        className={`flex w-full flex-col overflow-hidden bg-card md:max-h-[85dvh] md:rounded-2xl ${
          page ? "h-full" : "max-h-[85dvh] rounded-t-2xl"
        }`}
      >
        {page && (
          <div className="flex h-16 shrink-0 items-center gap-2 bg-card px-4 py-3 shadow-[0_1px_0_var(--color-line)] md:hidden">
            <button
              type="button"
              onClick={onClose}
              aria-label="Back"
              className="state flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line"
            >
              <img src="/icons/icon-back.svg" alt="" className="size-5" />
            </button>
            <h2 className="min-w-0 flex-1 truncate font-display text-h20 font-semibold">{label}</h2>
            <AppBarIconLink href={routes.careTeam} icon="/icons/icon-headset.svg" label="Talk to our care team" />
          </div>
        )}
        <div className={`flex min-h-0 flex-1 flex-col overflow-y-auto ${page ? "px-4 pt-6 pb-8" : "px-4 pt-6 pb-4"} ${padding}`}>
          {lead !== undefined && (
            <div className={`mb-6 flex items-center gap-2 ${page ? "max-md:hidden" : ""}`}>
              <div className="min-w-0 flex-1">{lead}</div>
              <CloseButton onClick={onClose} className="max-md:hidden" />
            </div>
          )}
          {children}
        </div>
      </div>
    </dialog>
  );
}

/** h24 title used as a sheet lead (h20-ish on mobile per M1.15). */
export function SheetTitle({ children }: { children: ReactNode }) {
  return <h2 className="font-display text-h20 font-semibold md:text-h24">{children}</h2>;
}
