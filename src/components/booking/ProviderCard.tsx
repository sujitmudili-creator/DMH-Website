"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import { DashedDivider } from "./BookingParts";
import { StarRating } from "./StarRating";
import { useBookingRating } from "./useBookingRating";

export type ProviderInfo = { id: string; name: string; firstName: string; role: string; thumb: string };

function ProfessionalRow({ pro, bookingId }: { pro: ProviderInfo; bookingId: string }) {
  return (
    <Link href={`${routes.professional(pro.id)}?from=${bookingId}`} className="state flex items-center gap-3 rounded-lg px-4">
      <img src={pro.thumb} alt="" width={48} height={48} className="size-12 shrink-0 rounded-full" />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-b14 font-semibold">{pro.name}</span>
        <span className="truncate text-b12 text-ink-2">{pro.role}</span>
      </span>
      <img src="/icons/booking/chevron-right-16.svg" alt="" className="size-4 shrink-0" />
    </Link>
  );
}

/**
 * Provider card (right column on desktop, second card on mobile):
 * assigning (W17.02) · assigned (W17.03) · completed, not rated → stars (W18.02) · rated (W18.07 / W18.11).
 */
export function ProviderCard({
  bookingId,
  pro,
  completed,
  initialRating,
}: {
  bookingId: string;
  pro: ProviderInfo | null;
  completed: boolean;
  initialRating?: number | null;
}) {
  const rating = useBookingRating(bookingId, initialRating);

  if (!pro) {
    return (
      <section className="flex w-full items-center gap-3 rounded-lg bg-card px-4 py-4 shadow-card">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
          <img src="/icons/booking/profile-20.svg" alt="" className="size-5" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-b14 font-semibold">Assigning your professional</span>
          <span className="text-b12 text-ink-2">Details shared before your visit</span>
        </span>
      </section>
    );
  }

  if (completed && rating) {
    return (
      <section className="w-full overflow-hidden rounded-lg bg-muted">
        <div className="rounded-lg bg-card py-4 shadow-card">
          <ProfessionalRow pro={pro} bookingId={bookingId} />
        </div>
        <p className="flex items-center justify-center gap-1 px-4 py-2 text-b12 font-medium text-ink-2">
          <img src="/icons/booking/star-on-20.svg" alt="" className="size-3.5" />
          You rated this provider {rating} star{rating > 1 ? "s" : ""}
        </p>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col gap-4 rounded-lg bg-card py-4 shadow-card">
      <ProfessionalRow pro={pro} bookingId={bookingId} />
      {completed && (
        <>
          <DashedDivider className="mx-4" />
          <div className="flex flex-col items-center gap-3 px-4">
            <p className="text-b14 font-medium">How was your visit with {pro.firstName}?</p>
            <StarRating value={0} size={32} hrefFor={(n) => `${routes.rateVisit(bookingId)}?stars=${n}`} />
            <p className="text-b12 text-ink-2">Tap a star to rate</p>
          </div>
        </>
      )}
    </section>
  );
}
