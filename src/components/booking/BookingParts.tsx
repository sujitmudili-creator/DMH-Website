import Link from "next/link";
import type { ReactNode } from "react";
import { CropImg } from "@/components/ui/CropImg";
import { formatBookingDay, formatBookingTime, formatRupees, type Booking, type BookingItem } from "@/data/bookings";

/** Card shell used by every block on Booking details / Professional (surface/card, Shadow/Card). */
export function Card({
  className = "",
  radius = "xl",
  children,
}: {
  className?: string;
  radius?: "lg" | "xl";
  children: ReactNode;
}) {
  return (
    <section className={`w-full bg-card shadow-card ${radius === "lg" ? "rounded-lg" : "rounded-xl"} ${className}`}>{children}</section>
  );
}

/** Card title: Heading 16 SemiBold (Instrument Sans). */
export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`font-display text-b16 leading-[1.3] font-semibold ${className}`}>{children}</h2>;
}

/** "Dashed divider": 1px, 4px dashes with 4px gaps in border/dash. */
export function DashedDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-px shrink-0 bg-[repeating-linear-gradient(90deg,var(--color-dash)_0_4px,transparent_4px_8px)] ${className}`}
    />
  );
}

/** Desktop page heading: round back button + Web/Heading 24. Mobile uses the app bar instead. */
export function BackHeading({ href, title }: { href: string; title: string }) {
  return (
    <div className="hidden items-center gap-3 md:flex">
      <Link href={href} aria-label="Back" className="state flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-card">
        <img src="/icons/icon-back.svg" alt="" className="size-5" />
      </Link>
      <h1 className="font-display text-h24 font-semibold">{title}</h1>
    </div>
  );
}

/** "DMH-24816" → "DMH 24816" as printed on the status card. */
export const displayBookingId = (id: string) => id.replace("-", " ");

const statusCards = {
  upcoming: {
    title: "Booking confirmed",
    gradient: "from-status-confirmed",
    image: <img src="/img/booking/status-confirmed.png" alt="" className="h-[51px] w-[53px] shrink-0 object-contain" />,
  },
  past: {
    title: "Booking completed",
    gradient: "from-status-completed",
    image: (
      <CropImg
        src="/img/booking/status-completed.png"
        crop={{ left: "-7.93%", top: "-6.86%", width: "112.08%", height: "109.8%" }}
        className="h-[51px] w-[53px] shrink-0"
      />
    ),
  },
  cancelled: {
    title: "Booking cancelled",
    gradient: "from-status-cancelled",
    image: (
      <CropImg
        src="/img/booking/status-cancelled.png"
        crop={{ left: "-15.1%", top: "-6.67%", width: "123.23%", height: "113.33%" }}
        className="h-[52px] w-[49px] shrink-0"
      />
    ),
  },
} as const;

/** Status card: 3D calendar + "Booking confirmed / completed / cancelled" on a tinted gradient. */
export function StatusCard({ booking }: { booking: Booking }) {
  const s = statusCards[booking.status];
  return (
    <section className={`w-full overflow-hidden rounded-lg bg-linear-to-b ${s.gradient} to-card p-4 shadow-card`}>
      <div className="flex items-center gap-3">
        {s.image}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="font-display text-h18 leading-[1.5] font-semibold">{s.title}</p>
          <p className="text-b12 text-ink-2">
            {formatBookingDay(booking.date)} · {formatBookingTime(booking.date)} · ID {displayBookingId(booking.id)}
          </p>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
        <img src={icon} alt="" className="size-5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col text-b14 font-medium">
        <p>{title}</p>
        <p className="text-ink-2">{sub}</p>
      </div>
    </div>
  );
}

/** "Booking details" card: patient, slot, address. */
export function BookingInfoCard({ booking }: { booking: Booking }) {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <CardTitle>Booking details</CardTitle>
      <DashedDivider />
      <div className="flex flex-col gap-4">
        {booking.patient && <InfoRow icon="/icons/booking/profile-20.svg" title={booking.patient.name} sub={booking.patient.gender} />}
        <InfoRow icon="/icons/booking/clock-20.svg" title={formatBookingDay(booking.date)} sub={formatBookingTime(booking.date)} />
        <InfoRow icon="/icons/booking/location-20.svg" title={booking.address.label} sub={booking.address.line} />
      </div>
    </Card>
  );
}

function BillRow({ label, value, valueClass = "text-ink" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center gap-2">
      <p className="min-w-0 flex-1 text-ink-2">{label}</p>
      <p className={`shrink-0 whitespace-nowrap ${valueClass}`}>{value}</p>
    </div>
  );
}

/** Bill summary (upcoming, "To pay after visit") or Invoice (completed, "Paid"), with the savings strip. */
export function BillCard({ booking }: { booking: Booking }) {
  const items = booking.items ?? [];
  const discount = items.reduce((sum, i) => sum + (i.mrp - i.price), 0);
  const taxes = booking.taxes ?? 0;
  const total = items.reduce((sum, i) => sum + i.mrp, 0) - discount + taxes;
  const paid = booking.status === "past";
  return (
    <Card className="flex flex-col gap-4 overflow-hidden pt-4">
      <CardTitle className="px-4">{paid ? "Invoice" : "Bill summary"}</CardTitle>
      <DashedDivider className="mx-4" />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 px-4 text-b14 font-medium">
          {items.map((i) => (
            <BillRow key={i.name} label={i.name} value={formatRupees(i.mrp)} />
          ))}
          {discount > 0 && <BillRow label="Discount" value={`${formatRupees(discount)} off`} valueClass="text-success" />}
          <BillRow label="Taxes" value={formatRupees(taxes)} />
        </div>
        <div className="h-px bg-line-2" />
        <div className={`flex items-center gap-2 px-4 text-b16 font-semibold ${discount > 0 ? "" : "pb-4"}`}>
          <p className="min-w-0 flex-1">{paid ? "Paid" : "To pay after visit"}</p>
          <p className="shrink-0">{formatRupees(total)}</p>
        </div>
      </div>
      {discount > 0 && (
        <div className="flex flex-col">
          <div className="relative h-2 overflow-hidden" aria-hidden>
            <img src="/icons/booking/savings-wave.svg" alt="" className="absolute bottom-0 left-0 h-1.5 w-[552px] max-w-none" />
          </div>
          <div className="flex items-center bg-success-tint px-4 pt-3 pb-4 text-b14 text-success">
            <p className="min-w-0 flex-1 font-medium">Your total savings</p>
            <p className="shrink-0 font-semibold">{formatRupees(discount)}</p>
          </div>
        </div>
      )}
    </Card>
  );
}

/** Cancelled within the late window (W17.07): the fee that was charged. */
export function CancellationFeeCard({ fee, minutes }: { fee: number; minutes: number }) {
  return (
    <Card className="flex flex-col gap-4 overflow-hidden py-4">
      <CardTitle className="px-4">Cancellation fee</CardTitle>
      <DashedDivider className="mx-4" />
      <div className="flex flex-col gap-3">
        <div className="px-4 text-b14 font-medium">
          <BillRow label={`Cancelled within ${minutes} min of the visit`} value={formatRupees(fee)} />
        </div>
        <div className="h-px bg-line-2" />
        <div className="flex items-center gap-2 px-4 text-b16 font-semibold">
          <p className="min-w-0 flex-1">Charged</p>
          <p className="shrink-0">{formatRupees(fee)}</p>
        </div>
      </div>
    </Card>
  );
}

function ServiceRow({ item }: { item: BookingItem }) {
  return (
    <div className="flex items-center gap-3">
      <img src={item.image} alt="" className="size-14 shrink-0 rounded-[10px] object-cover" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-b14 font-medium">{item.name}</p>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <p className="text-b14 font-semibold">{formatRupees(item.price)}</p>
          <p className="text-b12 text-ink-2 line-through">{formatRupees(item.mrp)}</p>
        </div>
      </div>
    </div>
  );
}

/** "Your services" card. */
export function ServicesCard({ items }: { items: BookingItem[] }) {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <CardTitle>Your services</CardTitle>
      <DashedDivider />
      <div className="flex flex-col gap-4">
        {items.map((i) => (
          <ServiceRow key={i.name} item={i} />
        ))}
      </div>
    </Card>
  );
}
