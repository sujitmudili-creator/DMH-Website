"use client";

import Link from "next/link";
import { checkoutCopy } from "@/data/checkout";
import { routes } from "@/lib/routes";
import { CheckoutSheet } from "./CheckoutSheet";
import { IconBadge } from "./parts";
import { findCoupon, inr } from "./pricing";

export type Dialog = null | "failed" | "slot-taken" | "expired" | { applied: string };

const primary =
  "state-dark flex h-12 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-lg bg-brand text-b16 font-semibold text-on-dark md:h-[52px]";

/**
 * Result pop ups on checkout: W3.03 coupon applied, W3.09 booking failed, M3.09 slot just booked,
 * M3.11 session expired. Desktop dialog 480; mobile bottom sheet.
 */
export function CheckoutDialogs({
  dialog,
  onClose,
  onRetry,
  onPickSlot,
  onLogin,
}: {
  dialog: Dialog;
  onClose: () => void;
  onRetry: () => void;
  onPickSlot: () => void;
  onLogin: () => void;
}) {
  const applied = dialog && typeof dialog === "object" ? findCoupon(dialog.applied) : undefined;

  return (
    <>
      <CheckoutSheet
        open={!!applied}
        onClose={onClose}
        label="Coupon applied"
        lead={<IconBadge icon="/icons/checkout/discount-bold-32.svg" tone="success" />}
        padding="md:px-4 md:pt-4 md:pb-8"
      >
        {applied && (
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-h20 font-semibold md:text-h24">{applied.code} applied</h2>
            <p className="text-b16 font-medium text-success">You save {inr(applied.amount)} on this booking</p>
            <button type="button" onClick={onClose} className={`${primary} w-full flex-none`}>
              Done
            </button>
          </div>
        )}
      </CheckoutSheet>

      <CheckoutSheet
        open={dialog === "failed"}
        onClose={onClose}
        label={checkoutCopy.failedTitle}
        lead={<IconBadge icon="/icons/checkout/close-circle-32.svg" tone="danger" />}
        padding="md:p-8"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h20 font-semibold md:text-h24">{checkoutCopy.failedTitle}</h2>
            <p className="text-b14 text-ink-2">{checkoutCopy.failedBody}</p>
          </div>
          <div className="flex flex-col-reverse gap-3 md:flex-row">
            <Link
              href={routes.careTeam}
              className="state flex h-12 min-w-0 flex-1 items-center justify-center rounded-lg border border-line text-b16 font-semibold text-ink"
            >
              Talk to our care team
            </Link>
            <button type="button" onClick={onRetry} className={primary}>
              Try again
            </button>
          </div>
        </div>
      </CheckoutSheet>

      <ProblemSheet
        open={dialog === "slot-taken"}
        icon="/icons/checkout/calendar-remove-32.svg"
        title={checkoutCopy.slotTakenTitle}
        body={checkoutCopy.slotTakenBody}
        action="Pick another slot"
        onAction={onPickSlot}
        onClose={onClose}
      />
      <ProblemSheet
        open={dialog === "expired"}
        icon="/icons/checkout/lock-32.svg"
        title={checkoutCopy.expiredTitle}
        body={checkoutCopy.expiredBody}
        action="Log in"
        onAction={onLogin}
        onClose={onClose}
      />
    </>
  );
}

function ProblemSheet({
  open,
  icon,
  title,
  body,
  action,
  onAction,
  onClose,
}: {
  open: boolean;
  icon: string;
  title: string;
  body: string;
  action: string;
  onAction: () => void;
  onClose: () => void;
}) {
  return (
    <CheckoutSheet open={open} onClose={onClose} label={title} lead={<IconBadge icon={icon} tone="danger" />} padding="md:p-8">
      <div className="-mt-2 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-h20 font-semibold">{title}</h2>
          <p className="text-b14 text-ink-2">{body}</p>
        </div>
        <button type="button" onClick={onAction} className={`${primary} w-full flex-none`}>
          {action}
        </button>
      </div>
    </CheckoutSheet>
  );
}
