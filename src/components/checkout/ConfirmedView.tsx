"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AppBarIconLink } from "@/components/site/MobileAppBar";
import { PageShell } from "@/components/site/PageShell";
import { cancellation, defaultAddress, demoCart, policy } from "@/data/checkout";
import { demoUser } from "@/data/profile";
import { routes } from "@/lib/routes";
import { BillCard, Card, CardTitle, Dashed, ServicesCard, VISIT_ICONS, VisitRow } from "./parts";
import { cartLines, dateKey, dayName, fromKey, inr, makeBill, minutesOf, today } from "./pricing";
import { useLastBooking, type BookingSnapshot } from "./store";

/** Shown when there is no booking in this tab (fresh browser, screenshots): the Figma example. */
function demoBooking(): BookingSnapshot {
  return {
    user: demoUser,
    address: defaultAddress,
    slot: { date: dateKey(today()), time: "5:00 PM" },
    bill: makeBill(cartLines(demoCart), null),
  };
}

/** "Cancel by 4:30 PM today" = slot time minus the free-cancellation window. */
function cancelBy(date: string, time: string) {
  const d = fromKey(date);
  d.setMinutes(minutesOf(time) - cancellation.freeUntilMinutesBefore);
  const h = d.getHours();
  const t = `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
  const day = dayName(dateKey(d));
  return `${t} ${day === "Today" || day === "Tomorrow" ? day.toLowerCase() : `on ${day}`}`;
}

/** W1.19 / M1.18 Booking confirmed. */
export function ConfirmedView() {
  const last = useLastBooking();
  const booking = useMemo(() => last ?? demoBooking(), [last]);
  const { user, address, slot, bill } = booking;

  return (
    <PageShell
      title="Booking confirmed"
      appBar={
        <div className="sticky top-0 z-20 flex h-16 items-center gap-2 bg-card px-4 py-3 shadow-[0_1px_0_var(--color-line)] md:hidden">
          <span className="size-10 shrink-0" />
          <h1 className="min-w-0 flex-1 truncate text-center font-display text-h20 font-semibold">Booking confirmed</h1>
          <AppBarIconLink href={routes.careTeam} icon="/icons/icon-headset.svg" label="Talk to our care team" />
        </div>
      }
    >
      <div className="min-h-[calc(100dvh-64px)] bg-page md:min-h-[calc(100dvh-73px)]">
        <div className="page-narrow pt-6 pb-[180px] md:pt-24 md:pb-24">
          <div className="flex flex-col items-center gap-2 pb-1 text-center">
            <img src="/icons/checkout/booking-success.svg" alt="" className="h-32 w-40" />
            <h2 className="font-display text-h24 font-semibold">Your booking is confirmed</h2>
            <p className="text-b14 text-ink-2">Details sent to {user.phone}</p>
          </div>

          <div className="mt-3 flex flex-col gap-3 md:mt-8 md:flex-row md:items-start md:gap-6">
            <div className="flex flex-col gap-3 md:min-w-0 md:flex-1">
              <Card className="flex flex-col gap-4 p-4">
                <CardTitle>Visit details</CardTitle>
                <Dashed />
                <div className="flex flex-col gap-4">
                  <VisitRow icon={VISIT_ICONS.patient} title={user.name} sub={user.phone} />
                  <VisitRow icon={VISIT_ICONS.time} title={dayName(slot.date)} sub={slot.time} />
                  <VisitRow icon={VISIT_ICONS.address} title={address.label} sub={address.line} />
                </div>
              </Card>
              <ServicesCard lines={bill.lines} />
            </div>

            <div className="flex flex-col gap-3 md:w-[400px] md:shrink-0">
              <BillCard bill={bill} totalLabel="To pay after your visit" raised />
              <details className="group w-full rounded-xl bg-card shadow-card">
                <summary className="state flex cursor-pointer list-none items-center gap-3 rounded-xl p-4 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 flex-1">
                    <span className="block text-b14 font-semibold">Cancellation policy</span>
                    <span className="mt-0.5 block text-b12">
                      Cancel by {cancelBy(slot.date, slot.time)} to avoid a{" "}
                      <span className="font-semibold">{inr(cancellation.fee)} fee</span>
                    </span>
                  </span>
                  <span className="flex w-4 shrink-0 justify-center transition-transform group-open:rotate-180">
                    <img src="/icons/checkout/chevron-down.svg" alt="" className="size-[17.23px] max-w-none" />
                  </span>
                </summary>
                <ul className="flex list-disc flex-col gap-1 px-4 pb-4 pl-8 text-b12 text-ink-2">
                  {policy.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </details>
              <div className="fixed inset-x-0 bottom-0 z-30 flex flex-col gap-3 rounded-t-2xl bg-card px-4 pt-6 pb-[max(16px,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgb(0_0_0/0.06)] md:static md:rounded-none md:bg-transparent md:p-0 md:shadow-none">
                <p className="text-center text-b14 font-medium text-ink-2">
                  Questions about this booking?{" "}
                  <Link href={routes.careTeam} className="font-semibold text-link hover:underline">
                    Talk to our care team
                  </Link>
                </p>
                <Link
                  href={routes.home}
                  className="state-dark flex h-[52px] w-full items-center justify-center rounded-lg bg-brand text-b16 font-semibold text-on-dark"
                >
                  Go back home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
