"use client";

import { useMemo, useState } from "react";
import { bookings as allBookings, formatBookingDay, type Booking, type BookingStatus } from "@/data/bookings";
import { today } from "@/data/profile";
import { routes } from "@/lib/routes";
import { BookingCard } from "./BookingCard";
import { DateFilter, filterLabel, matchesFilter, type DateFilterValue } from "./DateFilter";
import { EmptyState } from "./EmptyState";

const TABS: { id: BookingStatus; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "cancelled", label: "Cancelled" },
];

const ALL: DateFilterValue = { kind: "all" };
const NONE: Booking[] = [];

/**
 * My bookings (W12.02 Upcoming, W12.03 Past, W12.06 Cancelled, W12.04/W12.07 Filter by date, W12.05/W12.08 Filtered,
 * W12.09 Empty). Tab and filter are UI state; the tab is mirrored to ?tab= so links and refreshes keep it.
 */
export function BookingsView({ initialTab, empty = false }: { initialTab: BookingStatus; empty?: boolean }) {
  const list = empty ? NONE : allBookings;
  const [tab, setTab] = useState<BookingStatus>(initialTab);
  // One filter per tab, as in the Figma (Past and Cancelled each have their own).
  const [filters, setFilters] = useState<Record<BookingStatus, DateFilterValue>>({ upcoming: ALL, past: ALL, cancelled: ALL });
  const filter = filters[tab];

  const inTab = useMemo(
    () =>
      list
        .filter((b) => b.status === tab)
        .sort((a, b) => (tab === "upcoming" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date))),
    [list, tab],
  );
  const shown = inTab.filter((b) => matchesFilter(b.date, filter, today));
  const bookedDays = useMemo(() => new Set(inTab.map((b) => b.date.slice(0, 10))), [inTab]);

  const selectTab = (id: BookingStatus) => {
    setTab(id);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", id);
      window.history.replaceState(null, "", url);
    } catch {}
  };

  if (list.length === 0) {
    return (
      <EmptyState
        icon="/icons/checkout/calendar-bold-48.svg"
        title="No visits yet"
        text="Your upcoming and past visits will appear here"
        action={{ label: "Book a service", href: routes.home }}
        className="pt-16 md:pt-20"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label="Bookings" className="flex gap-1 rounded-full bg-muted p-1">
        {TABS.map((t) => {
          const on = t.id === tab;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={on}
              onClick={() => selectTab(t.id)}
              className={`state flex h-[45px] min-w-0 flex-1 cursor-pointer items-center justify-center rounded-full text-b14 ${
                on ? "bg-card font-semibold text-ink" : "font-medium text-ink-2"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab !== "upcoming" && inTab.length > 0 && (
        <DateFilter
          key={tab}
          value={filter}
          onChange={(v) => setFilters((f) => ({ ...f, [tab]: v }))}
          today={today}
          bookedDays={bookedDays}
          futureDisabled={tab === "past"}
          formatDay={formatBookingDay}
        />
      )}

      <div role="tabpanel" className="flex flex-col gap-4">
        {shown.map((b) => (
          <BookingCard key={b.id} booking={b} />
        ))}
        {inTab.length === 0 && (
          <EmptyState
            icon="/icons/checkout/calendar-bold-48.svg"
            title={`No ${tab} visits`}
            text={tab === "upcoming" ? "Book a visit and it will show here" : "Nothing to show here yet"}
            action={tab === "upcoming" ? { label: "Book a service", href: routes.home } : undefined}
            className="pt-12"
          />
        )}
        {inTab.length > 0 && shown.length === 0 && (
          <EmptyState
            icon="/icons/checkout/calendar-bold-48.svg"
            title={`No ${tab} visits for ${filterLabel(filter, formatBookingDay)}`}
            text="Try another date"
            onAction={{ label: "Show all dates", onClick: () => setFilters((f) => ({ ...f, [tab]: ALL })) }}
            className="pt-12"
          />
        )}
      </div>
    </div>
  );
}
