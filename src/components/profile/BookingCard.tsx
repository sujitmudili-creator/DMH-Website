"use client";

import Link from "next/link";
import { useBookingRating } from "@/components/booking/useBookingRating";
import { formatBookingSlot, formatRupees, type Booking } from "@/data/bookings";
import { routes } from "@/lib/routes";

const headerTone: Record<Booking["status"], string> = {
  upcoming: "bg-info-tint text-link",
  past: "bg-success-tint text-success",
  cancelled: "bg-danger-fill text-danger",
};

/** Row with a 32px round leading visual and two lines of text (professional, address). */
function DetailRow({ lead, title, sub }: { lead: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      {lead}
      <div className="flex min-w-0 flex-col">
        <p className="truncate text-b14 font-semibold">{title}</p>
        <p className="truncate text-b12 text-ink-2">{sub}</p>
      </div>
    </div>
  );
}

function Stars({ id, name }: { id: string; name: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-tint p-3">
      <p className="text-b12 font-semibold">How was {name}?</p>
      <div className="relative z-10 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <Link key={n} href={`${routes.rateVisit(id)}?stars=${n}`} aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`} className="group">
            <img src="/icons/icon-star-off.svg" alt="" className="size-5 group-hover:hidden" />
            <img src="/icons/icon-star-on.svg" alt="" className="hidden size-5 opacity-60 group-hover:block" />
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * My bookings card (W12.02 Upcoming, W12.03 Past, W12.06 Cancelled). The whole card opens Booking details;
 * the button (Get help / Book again) and the stars are separate links layered above it.
 */
export function BookingCard({ booking }: { booking: Booking }) {
  const b = booking;
  const action =
    b.status === "upcoming" ? { label: "Get help", href: routes.help } : { label: "Book again", href: routes.checkout };
  // Ratings given in this browser (rate pop up, W18.03) show straight away.
  const rating = useBookingRating(b.id, b.rating);
  const rated = b.status === "past" && rating !== null;
  const firstName = b.professional?.name.split(" ")[0] ?? "your visit";

  const card = (
    <article className="relative flex flex-col overflow-hidden rounded-lg border border-line bg-linear-to-l from-tint-2 to-card">
      <Link
        href={routes.booking(b.id)}
        aria-label={`${b.service}, ${formatBookingSlot(b.date)}, ${b.statusLabel}`}
        className="absolute inset-0 z-0 rounded-lg"
      >
        {/* State layer: `state` sets position: relative, so it lives on a child of the absolute link. */}
        <span className="state block size-full rounded-lg" />
      </Link>
      <div className={`pointer-events-none flex items-center justify-between gap-3 px-4 py-3 text-b12 font-semibold ${headerTone[b.status]}`}>
        <p className="text-ink">{formatBookingSlot(b.date)}</p>
        <p>{b.statusLabel}</p>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="pointer-events-none flex flex-col gap-1">
          <h2 className="text-b16 font-semibold">{b.service}</h2>
          <p className="text-b12 text-ink-2">
            {b.serviceCount} {b.serviceCount === 1 ? "service" : "services"}
          </p>
        </div>
        <div className="pointer-events-none flex flex-col gap-3">
          {b.professional ? (
            <DetailRow
              lead={<img src={b.professional.photo} alt="" width={32} height={32} className="size-8 shrink-0 rounded-full" />}
              title={b.professional.name}
              sub={b.professional.role}
            />
          ) : (
            b.status === "upcoming" && (
              <DetailRow
                lead={
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <img src="/icons/profile/user-14.svg" alt="" className="size-3.5" />
                  </span>
                }
                title="Assigning your professional"
                sub="Details shared before your visit"
              />
            )
          )}
          <DetailRow
            lead={
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted">
                <img src="/icons/profile/location-16.svg" alt="" className="size-4" />
              </span>
            }
            title={b.address.label}
            sub={b.address.line}
          />
        </div>
        {b.status === "past" && !rated && <Stars id={b.id} name={firstName} />}
        <img src="/icons/profile/divider-dashed.svg" alt="" className="pointer-events-none h-px w-full" />
        <div className="flex items-center gap-3">
          <div className="pointer-events-none flex min-w-0 flex-1 flex-col">
            <p className="text-b16 font-semibold">{formatRupees(b.price)}</p>
            <p className="text-b12 text-ink-2">{b.priceNote}</p>
          </div>
          <Link
            href={action.href}
            className="state relative z-10 flex h-[47px] shrink-0 items-center justify-center rounded-md border border-line bg-card px-6 text-b14 font-semibold text-link"
          >
            {action.label}
          </Link>
        </div>
      </div>
    </article>
  );

  if (!rated) return card;
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-muted">
      {card}
      <p className="flex items-center justify-center gap-1 px-4 py-2 text-b12 font-medium text-ink-2">
        <img src="/icons/icon-star-on.svg" alt="" className="size-3.5" />
        You rated the service {rating} {rating === 1 ? "star" : "stars"}
      </p>
    </div>
  );
}
