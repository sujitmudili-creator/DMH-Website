"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { couponCopy, coupons, type Coupon } from "@/data/checkout";
import { CheckoutSheet, SheetTitle } from "./CheckoutSheet";
import { couponStatus, findCoupon, inr, type Line } from "./pricing";

/**
 * W3.02 Coupons (desktop pop up, 520) / M3.02 (full page on mobile), with the W3.05 invalid-code and
 * W3.06 not-applicable errors and the W20.10 skeleton while coupons load.
 */
export function CouponsSheet({
  open,
  lines,
  applied,
  loading = false,
  onClose,
  onApply,
}: {
  open: boolean;
  lines: Line[];
  applied: string | null;
  loading?: boolean;
  onClose: () => void;
  onApply: (code: string) => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setCode("");
      setError(null);
    }
  }, [open]);

  const submit = () => {
    const c = findCoupon(code);
    if (!c) return setError(couponCopy.invalid);
    if (!couponStatus(c, lines).ok) return setError(couponCopy.notApplicable);
    onApply(c.code);
  };

  return (
    <CheckoutSheet
      open={open}
      onClose={onClose}
      label="Coupons"
      lead={<SheetTitle>Coupons</SheetTitle>}
      width={520}
      padding="md:p-6"
      mobile="page"
    >
      {loading ? (
        <CouponsSkeleton />
      ) : (
        <div className="flex flex-col gap-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex flex-col gap-1.5"
          >
            <div
              className={`flex items-center gap-2 rounded-xl border bg-muted py-2 pr-2 pl-4 ${error ? "border-danger" : "border-transparent"}`}
            >
              <input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                placeholder={couponCopy.placeholder}
                aria-label="Coupon code"
                aria-invalid={!!error || undefined}
                aria-describedby={error ? "coupon-error" : undefined}
                autoCapitalize="characters"
                className="min-w-0 flex-1 bg-transparent text-b16 text-ink outline-none placeholder:text-ink-3"
              />
              <button
                type="submit"
                disabled={!code.trim()}
                className={`state flex h-9 w-[72px] shrink-0 cursor-pointer items-center justify-center rounded-md text-b14 font-semibold disabled:cursor-default ${
                  code.trim() ? "text-link" : "text-ink-3"
                }`}
              >
                Apply
              </button>
            </div>
            {error && (
              <p id="coupon-error" role="alert" className="flex items-center gap-1 text-b12 text-danger">
                <img src="/icons/icon-info-circle-danger-16.svg" alt="" className="size-3.5" />
                {error}
              </p>
            )}
          </form>

          <div className="flex flex-col gap-4">
            <h3 className="font-display text-b16 leading-[1.3] font-semibold">Available coupons</h3>
            {coupons.map((c) => (
              <CouponCard key={c.code} coupon={c} lines={lines} applied={applied === c.code} onApply={() => onApply(c.code)} />
            ))}
          </div>
        </div>
      )}
    </CheckoutSheet>
  );
}

/** Ticket-shaped card: the Figma "Ticket" SVG drawn as a 9-slice so the notches stay on the divider. */
function Ticket({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative flex flex-col gap-4 p-4 ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [border-image:url(/icons/checkout/coupon-ticket.svg)_92_13_13_13_fill_/_92px_13px_13px_13px_stretch] [border-style:solid] [border-width:92px_13px_13px_13px]"
      />
      {children}
    </div>
  );
}

function CouponCard({ coupon, lines, applied, onApply }: { coupon: Coupon; lines: Line[]; applied: boolean; onApply: () => void }) {
  const [more, setMore] = useState(false);
  const status = couponStatus(coupon, lines);
  const locked = status.shortBy > 0;

  return (
    <Ticket>
      <div className="relative flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <img src={`/icons/checkout/discount-40${locked ? "-off" : ""}.svg`} alt="" className="size-10 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className={`font-display text-h20 font-semibold ${locked ? "text-ink-2" : "text-ink"}`}>{coupon.title}</p>
            <p className="text-b14 text-ink-2">
              Use code <span className={`font-semibold ${locked ? "text-ink-2" : "text-ink"}`}>{coupon.code}</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={!status.ok || applied}
          onClick={onApply}
          aria-label={`Apply ${coupon.code}`}
          className={`flex h-9 w-[72px] shrink-0 items-center justify-center rounded-md text-b14 font-semibold ${
            applied
              ? "bg-success-tint text-success"
              : status.ok
                ? "state-dark cursor-pointer bg-brand text-on-dark"
                : "cursor-not-allowed bg-muted text-ink-3"
          }`}
        >
          {applied ? "Applied" : "Apply"}
        </button>
      </div>
      <div aria-hidden className="relative h-px w-full bg-[repeating-linear-gradient(90deg,var(--color-dash)_0_4px,transparent_4px_8px)]" />
      <div className="relative flex flex-col gap-2 text-b14">
        {locked && (
          <p className="flex items-center gap-2 font-medium text-danger">
            <img src="/icons/icon-info-circle-danger-16.svg" alt="" className="size-4" />
            Add {inr(status.shortBy)} more to unlock
          </p>
        )}
        {[...coupon.terms, ...(more ? coupon.more : [])].map((t, i) => (
          <p key={t} className={`flex gap-2 ${status.failsServices && i === coupon.conditionTerm ? "text-danger" : "text-ink-2"}`}>
            <span aria-hidden>•</span>
            <span className="min-w-0 flex-1">{t}</span>
          </p>
        ))}
        <button
          type="button"
          onClick={() => setMore(!more)}
          aria-expanded={more}
          className="state -mx-1 flex cursor-pointer items-center gap-1 self-start rounded-md px-1 font-semibold text-link"
        >
          <img src="/icons/checkout/add-14.svg" alt="" className={`size-3.5 transition-transform ${more ? "rotate-45" : ""}`} />
          {more ? "Read less" : "Read more"}
        </button>
      </div>
    </Ticket>
  );
}

/** W20.10 Coupons skeleton. */
function CouponsSkeleton() {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-6">
      <span className="sr-only">Loading coupons</span>
      <div className="flex h-[52px] items-center gap-6 rounded-xl bg-muted px-4">
        <Skeleton className="h-2.5 w-[167px] rounded-[4px]" />
        <Skeleton className="h-2.5 w-9 rounded-[4px]" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-2.5 w-[135px] rounded-[4px]" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-4 rounded-xl bg-muted p-4">
            <div className="flex items-center gap-3 pl-[46px]">
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-2.5 w-[126px] rounded-[4px]" />
                <Skeleton className="h-2.5 w-[131px] rounded-[4px]" />
              </div>
              <Skeleton className="h-2 w-9 rounded-[4px]" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-2.5 w-[189px] rounded-[4px]" />
              <Skeleton className="h-2.5 w-[230px] rounded-[4px]" />
              <Skeleton className="h-2.5 w-[64px] rounded-[4px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
