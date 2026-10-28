"use client";

import type { ReactNode } from "react";
import { Modal } from "@/components/ui/Modal";

/**
 * Danger confirm pop up (W13.05 "Delete this address?", W14.03 "Log out?"): 64 danger-tint icon, close pill,
 * Heading 24, one line, Cancel + red action. 480 dialog on desktop, bottom sheet on mobile.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  icon,
  iconSize,
  title,
  text,
  confirmLabel,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon: string;
  iconSize: number;
  title: string;
  text: ReactNode;
  confirmLabel: string;
}) {
  return (
    <Modal open={open} onClose={onClose} width={480} className="md:rounded-3xl">
      <div className="flex flex-col gap-6 px-4 pb-8 pt-6 md:p-8">
        <div className="flex items-start justify-between">
          <span className="flex size-16 items-center justify-center rounded-full bg-danger-tint">
            <img src={icon} alt="" style={{ width: iconSize, height: iconSize }} />
          </span>
          <button type="button" onClick={onClose} aria-label="Close" className="state flex size-10 cursor-pointer items-center justify-center rounded-full border border-line bg-card">
            <img src="/icons/icon-add-22.svg" alt="" className="size-[22px] rotate-45" />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-h24 font-semibold">{title}</h2>
          <p className="text-b14 text-ink-2">{text}</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="state flex h-12 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-lg border border-line text-b14 font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="state-dark flex h-12 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-lg bg-danger text-b14 font-semibold text-on-dark"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
