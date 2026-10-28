"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";

/** Date filter for My bookings: all dates, a preset range, or one day (YYYY-MM-DD). */
export type DateFilterValue = { kind: "all" } | { kind: "range"; days: number } | { kind: "day"; date: string };

const PRESETS = [
  { label: "All dates", value: { kind: "all" } as DateFilterValue },
  { label: "Last 30 days", value: { kind: "range", days: 30 } as DateFilterValue },
  { label: "Last 3 months", value: { kind: "range", days: 90 } as DateFilterValue },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const same = (a: DateFilterValue, b: DateFilterValue) => JSON.stringify(a) === JSON.stringify(b);

/** Days between two YYYY-MM-DD dates (b − a). */
export function daysBetween(a: string, b: string) {
  const t = (s: string) => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10));
  return Math.round((t(b) - t(a)) / 86_400_000);
}

export function matchesFilter(date: string, filter: DateFilterValue, today: string) {
  const day = date.slice(0, 10);
  if (filter.kind === "all") return true;
  if (filter.kind === "day") return day === filter.date;
  return Math.abs(daysBetween(day, today)) <= filter.days;
}

/** true from md (768) up; false on the server and first render. */
export function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

/** W12.04 "Filter by date" panel: presets, month calendar with booking dots, Show bookings. */
function FilterPanel({
  value,
  today,
  bookedDays,
  futureDisabled,
  onApply,
  onClose,
}: {
  value: DateFilterValue;
  today: string;
  bookedDays: Set<string>;
  futureDisabled: boolean;
  onApply: (v: DateFilterValue) => void;
  onClose?: () => void;
}) {
  const [draft, setDraft] = useState<DateFilterValue>(value);
  const start = value.kind === "day" ? value.date : today;
  const [month, setMonth] = useState({ y: +start.slice(0, 4), m: +start.slice(5, 7) - 1 });

  const first = new Date(Date.UTC(month.y, month.m, 1)).getUTCDay();
  const count = new Date(Date.UTC(month.y, month.m + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  const atTodayMonth = month.y === +today.slice(0, 4) && month.m === +today.slice(5, 7) - 1;
  const shift = (d: number) => setMonth(({ y, m }) => ({ y: y + Math.floor((m + d) / 12), m: (m + d + 12) % 12 }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-h20 font-semibold">Filter by date</h2>
        {onClose && (
          <button type="button" aria-label="Close" onClick={onClose} className="state flex size-8 cursor-pointer items-center justify-center rounded-full">
            <img src="/icons/icon-add-22.svg" alt="" className="size-[22px] rotate-45" />
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => {
          const on = same(draft, p.value);
          return (
            <button
              key={p.label}
              type="button"
              aria-pressed={on}
              onClick={() => setDraft(p.value)}
              className={`state cursor-pointer rounded-full border px-3 py-2 text-b14 font-medium ${on ? "border-brand bg-tint text-link" : "border-line bg-card"}`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 text-b16 font-semibold" aria-live="polite">
            {MONTHS[month.m]} {month.y}
          </p>
          <MonthButton label="Previous month" dir={-1} disabled={false} onClick={() => shift(-1)} />
          <MonthButton label="Next month" dir={1} disabled={futureDisabled && atTodayMonth} onClick={() => shift(1)} />
        </div>
        <div className="grid grid-cols-7 gap-x-2 gap-y-1 text-center">
          {WEEKDAYS.map((d) => (
            <span key={d} className="flex h-5 items-center justify-center text-b12 font-medium text-ink-2">
              {d}
            </span>
          ))}
          <span className="col-span-7 h-2" aria-hidden />
          {cells.map((d, i) => {
            if (d === null) return <span key={`e${i}`} />;
            const day = iso(month.y, month.m, d);
            const disabled = futureDisabled && day > today;
            const selected = draft.kind === "day" && draft.date === day;
            const isToday = day === today;
            return (
              <button
                key={day}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                aria-label={`${d} ${MONTHS[month.m]}${isToday ? ", today" : ""}${bookedDays.has(day) ? ", has a booking" : ""}`}
                onClick={() => setDraft({ kind: "day", date: day })}
                className={`state relative mx-auto flex size-11 cursor-pointer items-center justify-center rounded-md text-b14 disabled:cursor-default ${
                  selected
                    ? "border-[1.5px] border-choice-selected bg-tint font-semibold text-link"
                    : isToday
                      ? "border border-field font-medium"
                      : "font-medium"
                } ${disabled ? "text-ink-4" : ""}`}
              >
                {d}
                {bookedDays.has(day) && <span className="absolute bottom-1 size-1 rounded-full bg-brand" />}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-b12 text-ink-2">
          <span className="flex items-center gap-2">
            <span className="size-3.5 rounded-[4px] border border-field" /> Today
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3.5 rounded-[4px] border-[1.5px] border-choice-selected bg-tint" /> Selected
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand" /> Has a booking
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onApply(draft)}
        className="state-dark inline-flex h-[52px] w-full cursor-pointer items-center justify-center rounded-lg bg-brand text-b16 font-semibold text-on-dark"
      >
        Show bookings
      </button>
    </div>
  );
}

/** 36 round month arrow. Figma exports an ink right arrow and a grey (disabled) left arrow; mirrored for the other side. */
function MonthButton({ label, dir, disabled, onClick }: { label: string; dir: 1 | -1; disabled: boolean; onClick: () => void }) {
  const src = disabled ? "/icons/checkout/arrow-left-18.svg" : "/icons/checkout/arrow-right-18.svg";
  const flip = (dir === 1) === disabled; // grey arrow points left, ink arrow points right
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="state flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line disabled:cursor-default"
    >
      <img src={src} alt="" className={`size-[18px] ${flip ? "rotate-180" : ""}`} />
    </button>
  );
}

export function filterLabel(v: DateFilterValue, formatDay: (iso: string) => string) {
  if (v.kind === "all") return "All dates";
  if (v.kind === "day") return formatDay(v.date);
  return PRESETS.find((p) => same(p.value, v))?.label ?? `Last ${v.days} days`;
}

/**
 * "All dates" chip (W12.03) → Filter by date (W12.04: popover on desktop, bottom sheet on mobile) → filtered chip with
 * a clear × (W12.05).
 */
export function DateFilter({
  value,
  onChange,
  today,
  bookedDays,
  futureDisabled,
  formatDay,
}: {
  value: DateFilterValue;
  onChange: (v: DateFilterValue) => void;
  today: string;
  bookedDays: Set<string>;
  futureDisabled: boolean;
  formatDay: (iso: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const desktop = useIsDesktop();
  const ref = useRef<HTMLDivElement>(null);
  const active = value.kind !== "all";

  useEffect(() => {
    if (!open || !desktop) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, desktop]);

  const apply = (v: DateFilterValue) => {
    onChange(v);
    setOpen(false);
  };

  const panel = (
    <FilterPanel
      value={value}
      today={today}
      bookedDays={bookedDays}
      futureDisabled={futureDisabled}
      onApply={apply}
      onClose={desktop ? undefined : () => setOpen(false)}
    />
  );

  return (
    <div ref={ref} className="relative self-start">
      <div className={`flex items-center gap-2 rounded-full border ${active ? "border-brand bg-tint text-link" : "border-line bg-card text-ink"}`}>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`state flex cursor-pointer items-center gap-2 rounded-full py-2 pl-3 text-b14 font-medium ${active ? "-mr-1 pr-1" : "pr-3"}`}
        >
          <img src={active ? "/icons/profile/calendar-16-brand.svg" : "/icons/profile/calendar-16.svg"} alt="" className="size-4" />
          {filterLabel(value, formatDay)}
          {!active && <img src="/icons/profile/arrow-down-16.svg" alt="" className="size-4" />}
        </button>
        {active && (
          // Clear: 16 white circle with the add icon turned 45°, inside a 32 hit area.
          <button
            type="button"
            aria-label="Clear date filter"
            onClick={() => onChange({ kind: "all" })}
            className="-my-1 mr-1 flex size-8 cursor-pointer items-center justify-center rounded-full"
          >
            <span className="state flex size-4 items-center justify-center rounded-full bg-card">
              <img src="/icons/profile/add-12.svg" alt="" className="size-[12.44px] rotate-45" />
            </span>
          </button>
        )}
      </div>
      {open && desktop && (
        <div
          role="dialog"
          aria-label="Filter by date"
          className="absolute left-0 top-[calc(100%+8px)] z-30 w-[393px] rounded-xl border border-line bg-card p-4 shadow-popover"
        >
          {panel}
        </div>
      )}
      {!desktop && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <div className="px-4 pb-8 pt-6">{open && panel}</div>
        </Modal>
      )}
    </div>
  );
}
