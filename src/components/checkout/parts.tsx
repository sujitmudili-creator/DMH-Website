import Link from "next/link";
import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { inr, type Bill, type Line } from "./pricing";

/** Card shells used on checkout and booking confirmed. `raised` = Shadow/Card, else a border/card hairline. */
export function Card({
  raised = false,
  className = "",
  children,
}: {
  raised?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`w-full rounded-xl bg-card ${raised ? "shadow-card" : "border border-line"} ${className}`}
    >
      {children}
    </section>
  );
}

/** Dashed divider (border/dash, 4 on 4 off). */
export function Dashed({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-px w-full shrink-0 bg-[repeating-linear-gradient(90deg,var(--color-dash)_0_4px,transparent_4px_8px)] ${className}`}
    />
  );
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`font-display text-b16 leading-[1.3] font-semibold ${className}`}>{children}</h2>;
}

/** Visit details row: round muted icon, two lines, optional action on the right. */
export function VisitRow({
  icon,
  title,
  sub,
  muted = false,
  action,
  className = "",
}: {
  icon: string;
  title: ReactNode;
  sub: ReactNode;
  muted?: boolean;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${muted ? "opacity-50" : ""} ${className}`}>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
        <img src={icon} alt="" className="size-5" />
      </span>
      <div className="min-w-0 flex-1 text-b14 font-medium">
        <p className="text-ink">{title}</p>
        <p className="mt-0.5 text-ink-2">{sub}</p>
      </div>
      {action}
    </div>
  );
}

export function ChangeButton({ href, onClick, label }: { href?: string; onClick?: () => void; label: string }) {
  const cls = "state -m-2 shrink-0 cursor-pointer rounded-md p-2 text-b12 font-semibold text-link";
  return href ? (
    <Link href={href} className={cls} aria-label={label}>
      Change
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls} aria-label={label}>
      Change
    </button>
  );
}

export const VISIT_ICONS = {
  patient: "/icons/icon-profile.svg",
  time: "/icons/checkout/clock-20.svg",
  address: "/icons/checkout/location-20.svg",
};

/** Price + struck-through MRP. */
export function Price({ price, mrp }: { price: number; mrp: number }) {
  return (
    <span className="flex items-center gap-2 whitespace-nowrap">
      <span className="text-b14 font-semibold text-ink">{inr(price)}</span>
      {mrp > price && <s className="text-b12 text-ink-2">{inr(mrp)}</s>}
    </span>
  );
}

export function AddedTag() {
  return (
    <span className="inline-flex h-[19px] w-[52px] items-center justify-center rounded-2xl bg-tint text-b12 font-semibold tracking-[0.04em] text-link uppercase">
      Added
    </span>
  );
}

/** One row of "Your services": 56 thumbnail, name, price, optional Remove. */
export function ServiceRow({ line, onRemove }: { line: Line; onRemove?: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <img src={line.image} alt="" className="size-14 shrink-0 rounded-[10px] object-cover" />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        {line.added && <AddedTag />}
        <p className="text-b14 font-medium text-ink">{line.name}</p>
        <Price price={line.price} mrp={line.mrp} />
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${line.name}`}
          className="state -m-2 shrink-0 cursor-pointer rounded-md p-2 text-b12 font-medium text-danger"
        >
          Remove
        </button>
      )}
    </div>
  );
}

export function ServicesCard({
  lines,
  onRemove,
  className = "",
}: {
  lines: Line[];
  onRemove?: (line: Line) => void;
  className?: string;
}) {
  return (
    <Card className={`flex flex-col gap-4 p-4 ${className}`}>
      <CardTitle>Your services</CardTitle>
      <Dashed />
      <div className="flex flex-col gap-4">
        {lines.map((l) => (
          <ServiceRow key={l.key} line={l} onRemove={onRemove ? () => onRemove(l) : undefined} />
        ))}
      </div>
    </Card>
  );
}

function BillRow({ label, value, tone = "ink", updating }: { label: string; value: string; tone?: "ink" | "success"; updating?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="min-w-0 flex-1 text-ink-2">{label}</span>
      {updating ? (
        <Skeleton className="h-3 w-[30px] rounded-[4px]" />
      ) : (
        <span className={`whitespace-nowrap ${tone === "success" ? "text-success" : "text-ink"}`}>{value}</span>
      )}
    </div>
  );
}

/** Bill summary with the savings wave strip. `updating` shows W20.13 (values become shimmer bars). */
export function BillCard({
  bill,
  totalLabel = "To pay",
  updating = false,
  raised = false,
  className = "",
}: {
  bill: Bill;
  totalLabel?: string;
  updating?: boolean;
  raised?: boolean;
  className?: string;
}) {
  return (
    <section
      aria-busy={updating || undefined}
      className={`flex w-full flex-col gap-4 overflow-hidden rounded-xl border border-line bg-card pt-4 ${raised ? "shadow-card" : ""} ${className}`}
    >
      <CardTitle className="px-4">Bill summary</CardTitle>
      <Dashed />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 px-4 text-b14 font-medium">
          {bill.lines.map((l) => (
            <BillRow key={l.key} label={l.name} value={inr(l.mrp)} updating={updating} />
          ))}
          {bill.discount > 0 && <BillRow label="Discount" value={`${inr(bill.discount)} off`} tone="success" updating={updating} />}
          {bill.coupon && (
            <BillRow label={`Coupon · ${bill.coupon.code}`} value={`${inr(bill.coupon.amount)} off`} tone="success" updating={updating} />
          )}
          <BillRow label="Taxes" value={inr(bill.taxes)} updating={updating} />
        </div>
        <div className="h-px w-full bg-line-2" />
        <div className="flex items-center gap-2 px-4 text-b16 font-semibold">
          <span className="min-w-0 flex-1">{totalLabel}</span>
          {updating ? <Skeleton className="h-3 w-[30px] rounded-[4px]" /> : <span className="whitespace-nowrap">{inr(bill.toPay)}</span>}
        </div>
      </div>
      {bill.savings > 0 && (
        <div>
          <div aria-hidden className="h-2 bg-[url(/icons/checkout/savings-wave.svg)] bg-[length:auto_6px] bg-bottom-left bg-repeat-x" />
          <div className="flex items-center bg-success-tint px-4 pt-3 pb-4 text-b14 text-success">
            <span className="min-w-0 flex-1 font-medium">Your total savings</span>
            {updating ? <span aria-hidden className="h-3 w-[30px] animate-pulse rounded-[4px] bg-success/15" /> : <span className="font-semibold">{inr(bill.savings)}</span>}
          </div>
        </div>
      )}
    </section>
  );
}

/** Collapsible policy card (summary + chevron). Native <details>, so it works without JS. */
export function PolicyCard({ title, summary, details }: { title: string; summary: ReactNode; details: string[] }) {
  return (
    <details className="group w-full rounded-xl bg-card shadow-card">
      <summary className="state flex cursor-pointer list-none items-center gap-3 rounded-xl p-4 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1">
          <span className="block text-b14 font-semibold text-ink">{title}</span>
          <span className="mt-0.5 block text-b12 text-ink-2">{summary}</span>
        </span>
        <span className="flex w-4 shrink-0 justify-center transition-transform group-open:rotate-180">
          <img src="/icons/checkout/chevron-down.svg" alt="" className="size-[17.23px] max-w-none" />
        </span>
      </summary>
      <ul className="flex list-disc flex-col gap-1 px-4 pb-4 pl-8 text-b12 text-ink-2">
        {details.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    </details>
  );
}

/** Round icon tile used by result dialogs (success / danger tint, 64). */
export function IconBadge({ icon, tone }: { icon: string; tone: "success" | "danger" }) {
  return (
    <span className={`flex size-16 shrink-0 items-center justify-center rounded-full ${tone === "success" ? "bg-success-tint" : "bg-danger-tint"}`}>
      <img src={icon} alt="" className="size-8" />
    </span>
  );
}

/** Spinner for buttons while a request runs (W20.11 Confirming). */
export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block size-5 animate-spin rounded-full border-2 border-on-dark/30 border-t-on-dark ${className}`}
    />
  );
}
