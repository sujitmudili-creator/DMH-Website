import type { ReactNode } from "react";
import { CareTeamTrigger } from "@/components/care-team/CareTeamDialog";
import { PageShell } from "@/components/site/PageShell";
import Link from "next/link";
import { lateCancellation } from "@/data/booking-details";
import { formatBookingDay, formatBookingTime, formatRupees, type Booking } from "@/data/bookings";
import { getProfessional } from "@/data/professionals";
import { routes } from "@/lib/routes";
import { BackHeading, BillCard, BookingInfoCard, CancellationFeeCard, ServicesCard, StatusCard } from "./BookingParts";
import { CancellationPolicy } from "./CancellationPolicy";
import { ProviderCard, type ProviderInfo } from "./ProviderCard";

/** "2026-10-28T17:00" minus `minutes` → "4:30 PM, Wed 28 Oct". */
function cancelByLabel(iso: string, minutes: number) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const [h, min] = iso.slice(11, 16).split(":").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d, h, min) - minutes * 60_000).toISOString().slice(0, 16);
  return `${formatBookingTime(t)}, ${formatBookingDay(t).replace(",", "")}`;
}

function providerFor(booking: Booking): ProviderInfo | null {
  const b = booking.professional;
  if (!b) return null;
  const p = getProfessional(b.id);
  return { id: b.id, name: b.name, role: b.role, firstName: p?.firstName ?? b.name.split(" ")[0], thumb: p?.thumb ?? b.photo };
}

/** Brand button, full width; height set per placement (Figma: 67 desktop upcoming, 44 desktop, 52 mobile). */
const primary = "state-dark flex w-full items-center justify-center rounded-lg bg-brand text-b16 font-semibold text-on-dark";

function HelpAction() {
  return (
    <CareTeamTrigger aria-label="Talk to our care team" className="state flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-card">
      <img src="/icons/icon-headset.svg" alt="" className="size-5" />
    </CareTeamTrigger>
  );
}

/**
 * Booking details, one page for every status (W17.02–W17.07, W18.02, W18.07, W18.11):
 * upcoming (assigning / assigned) · cancelled (in time / late fee) · completed (not rated / rated).
 * Desktop: details column (536) + summary column (400). Mobile: one column in Figma order + sticky bottom bar.
 * `overlay` renders on top (the rate pop up on /rate).
 */
export function BookingDetails({ booking, overlay }: { booking: Booking; overlay?: ReactNode }) {
  const upcoming = booking.status === "upcoming";
  const completed = booking.status === "past";
  const cancelled = booking.status === "cancelled";
  const pro = providerFor(booking);
  const fee = formatRupees(lateCancellation.fee);

  const careLink = (
    <CareTeamTrigger className="state rounded-sm text-link">Call our care team</CareTeamTrigger>
  );

  return (
    <PageShell title="Booking details" backHref={routes.bookings} appBarActions={<HelpAction />}>
      <div className="min-h-[calc(100dvh-64px)] bg-tint-page md:min-h-[calc(100dvh-73px)]">
        <div className="page-narrow flex flex-col gap-6 pt-6 pb-40 md:pt-8 md:pb-12">
          <BackHeading href={routes.bookings} title="Booking details" />

          <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-6">
            {/* Details column. On mobile the columns dissolve and `order` restores the Figma sequence. */}
            <div className="flex flex-col gap-3 max-md:contents md:min-w-0 md:flex-1 md:gap-2">
              <div className="order-1">
                <StatusCard booking={booking} />
              </div>
              <div className="order-4">
                <BookingInfoCard booking={booking} />
              </div>
              {!cancelled && (
                <div className="order-5">
                  <BillCard booking={booking} />
                </div>
              )}
              {cancelled && (booking.cancellationFee ?? 0) > 0 && (
                <div className="order-5">
                  <CancellationFeeCard fee={booking.cancellationFee ?? 0} minutes={lateCancellation.minutes} />
                </div>
              )}
              {upcoming && (
                <div className="order-6">
                  <CancellationPolicy cancelBy={cancelByLabel(booking.date, lateCancellation.minutes)} fee={fee} minutes={lateCancellation.minutes} />
                </div>
              )}
            </div>

            {/* Summary column. */}
            <div className="flex flex-col gap-4 max-md:contents md:w-[400px] md:shrink-0">
              <div className="flex flex-col gap-2 max-md:contents">
                {/* A cancelled booking that never got a professional has no provider to show. */}
                {!(cancelled && !pro) && (
                  <div className="order-2">
                    <ProviderCard bookingId={booking.id} pro={pro} completed={completed} initialRating={booking.rating} />
                  </div>
                )}
                {booking.items && booking.items.length > 0 && (
                  <div className="order-3">
                    <ServicesCard items={booking.items} />
                  </div>
                )}
              </div>

              {/* Desktop actions. */}
              <div className="hidden md:block">
                {upcoming ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-center text-b14 font-medium">Need to reschedule or cancel?</p>
                    <CareTeamTrigger className={`${primary} h-[67px]`}>
                      Call care team
                    </CareTeamTrigger>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link href={routes.checkout} className={`${primary} h-11`}>
                      Book again
                    </Link>
                    <p className="text-center text-b14 font-medium">Questions about this visit? {careLink}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile bottom bar. */}
        <div className="fixed inset-x-0 bottom-0 z-10 flex flex-col gap-4 bg-card pt-4 pb-[max(16px,env(safe-area-inset-bottom))] shadow-bar md:hidden">
          {upcoming ? (
            <>
              <p className="px-4 text-center text-b14 font-medium">Need to reschedule or cancel?</p>
              <div className="px-4">
                <CareTeamTrigger className={`${primary} h-13`}>
                  Call care team
                </CareTeamTrigger>
              </div>
            </>
          ) : (
            <>
              <p className="px-4 text-b14 font-medium">Questions about this visit? {careLink}</p>
              <div className="px-4">
                <Link href={routes.checkout} className={`${primary} h-13`}>
                  Book again
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      {overlay}
    </PageShell>
  );
}
