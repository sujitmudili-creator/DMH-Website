"use client";

import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { delays, slotGroups, slotRules } from "@/data/checkout";
import { CheckoutSheet, SheetTitle } from "./CheckoutSheet";
import { addDays, dateKey, fromKey, slotGone, today, type Slot } from "./pricing";

const primaryBtn =
  "state-dark flex h-[52px] w-full cursor-pointer items-center justify-center rounded-lg bg-brand text-b16 font-semibold text-on-dark disabled:cursor-not-allowed disabled:opacity-50";

/**
 * W1.16 Pick a slot + W1.17 Pick a date, one pop up with two views.
 * Closing the date view goes back to the slot view; "Confirm slot" returns the chosen slot.
 */
export function SlotPicker({
  open,
  initial,
  onClose,
  onConfirm,
}: {
  open: boolean;
  initial: Slot | null;
  onClose: () => void;
  onConfirm: (slot: Slot) => void;
}) {
  const [view, setView] = useState<"slot" | "date">("slot");
  const [date, setDate] = useState(() => initial?.date ?? dateKey(today()));
  const [time, setTime] = useState<string | null>(initial?.time ?? null);
  const [loading, setLoading] = useState(false);

  // Fresh state each time it opens.
  useEffect(() => {
    if (!open) return;
    setView("slot");
    setDate(initial?.date ?? dateKey(today()));
    setTime(initial?.time ?? null);
  }, [open, initial]);

  const pickDate = (key: string) => {
    if (key === date) return;
    setDate(key);
    setTime(null);
    setLoading(true); // W20.14 Slots loading
    window.setTimeout(() => setLoading(false), delays.slots);
  };

  const close = () => (view === "date" ? setView("slot") : onClose());

  return (
    <CheckoutSheet
      open={open}
      onClose={close}
      label={view === "slot" ? "Pick a slot" : "Pick a date"}
      lead={<SheetTitle>{view === "slot" ? "Pick a slot" : "Pick a date"}</SheetTitle>}
    >
      {view === "slot" ? (
        <SlotView
          date={date}
          time={time}
          loading={loading}
          onDate={pickDate}
          onTime={setTime}
          onMoreDates={() => setView("date")}
          onConfirm={() => time && onConfirm({ date, time })}
        />
      ) : (
        <DateView
          selected={date}
          onConfirm={(key) => {
            pickDate(key);
            setView("slot");
          }}
        />
      )}
    </CheckoutSheet>
  );
}

function SlotView({
  date,
  time,
  loading,
  onDate,
  onTime,
  onMoreDates,
  onConfirm,
}: {
  date: string;
  time: string | null;
  loading: boolean;
  onDate: (key: string) => void;
  onTime: (t: string) => void;
  onMoreDates: () => void;
  onConfirm: () => void;
}) {
  // Today + next 3 days; a date picked from the calendar takes the last chip.
  const days = useMemo(() => {
    const keys = [0, 1, 2, 3].map((n) => dateKey(addDays(today(), n)));
    if (!keys.includes(date)) keys[3] = date;
    return keys;
  }, [date]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:px-4">
        <div className="flex h-[68px] gap-2" role="radiogroup" aria-label="Date">
          {days.map((key, i) => {
            const d = fromKey(key);
            const on = key === date;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onDate(key)}
                className={`state flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-lg border py-3 ${
                  on ? "border-choice bg-tint" : "border-line"
                }`}
              >
                <span className="text-b12 text-ink-2">
                  {i === 0 && key === dateKey(today()) ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" })}
                </span>
                <span className={`font-display text-b16 leading-[1.3] font-semibold ${on ? "text-brand" : "text-ink"}`}>{d.getDate()}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={onMoreDates}
            aria-label="More dates"
            className="state flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-lg border border-line bg-tint"
          >
            <img src="/icons/checkout/calendar-bold-24.svg" alt="" className="size-6" />
          </button>
        </div>

        <div className="flex flex-col gap-4" aria-busy={loading || undefined}>
          {slotGroups.map((g) => (
            <div key={g.label} className="flex flex-col gap-2">
              <p className="text-b12 font-medium text-ink-2">{g.label}</p>
              <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label={`${g.label} times`}>
                {g.times.map((t) =>
                  loading ? (
                    <span key={t} className="flex h-[47px] items-center justify-center rounded-[10px] bg-muted/70">
                      <Skeleton className="h-2.5 w-10 rounded-[4px]" />
                    </span>
                  ) : (
                    <TimeChip key={t} time={t} gone={slotGone(date, t)} on={time === t} onPick={() => onTime(t)} />
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card pt-3 md:px-4">
        <button type="button" disabled={!time || loading} onClick={onConfirm} className={primaryBtn}>
          Confirm slot
        </button>
      </div>
    </div>
  );
}

function TimeChip({ time, gone, on, onPick }: { time: string; gone: boolean; on: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      disabled={gone}
      onClick={onPick}
      className={`flex h-[47px] min-w-0 items-center justify-center rounded-[10px] border text-b14 whitespace-nowrap ${
        gone
          ? "cursor-not-allowed border-line text-ink-3 opacity-55"
          : on
            ? "state cursor-pointer border-link bg-tint font-semibold text-link"
            : "state cursor-pointer border-line font-medium text-ink"
      } ${gone ? "font-medium" : ""}`}
    >
      {time}
    </button>
  );
}

function DateView({ selected, onConfirm }: { selected: string; onConfirm: (key: string) => void }) {
  const first = today();
  const last = addDays(first, slotRules.daysAhead);
  const [month, setMonth] = useState(() => {
    const d = fromKey(selected);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [pick, setPick] = useState(selected);

  const cells = useMemo(() => {
    const lead = month.getDay();
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array(lead).fill(null), ...Array.from({ length: count }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  }, [month]);

  const canPrev = month > new Date(first.getFullYear(), first.getMonth(), 1);
  const canNext = new Date(month.getFullYear(), month.getMonth() + 1, 1) <= last;
  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  const todayKey = dateKey(first);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 text-b16 font-semibold">
            {month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </p>
          <MonthButton dir="prev" disabled={!canPrev} onClick={() => shift(-1)} />
          <MonthButton dir="next" disabled={!canNext} onClick={() => shift(1)} />
        </div>
        <div className="grid grid-cols-7 text-center text-b12 font-medium text-ink-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <span key={d} className="flex h-5 items-center justify-center">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1" role="grid" aria-label="Dates">
          {cells.map((d, i) => {
            if (!d) return <span key={`e${i}`} />;
            const key = dateKey(d);
            const off = d < first || d > last;
            const on = key === pick;
            const isToday = key === todayKey;
            return (
              <span key={key} className="flex justify-center">
                <button
                  type="button"
                  disabled={off}
                  aria-pressed={on}
                  aria-label={d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                  onClick={() => setPick(key)}
                  className={`flex size-11 items-center justify-center rounded-lg text-b14 ${
                    off
                      ? "cursor-default font-medium text-ink-3"
                      : on
                        ? "state cursor-pointer border-[1.5px] border-choice bg-tint font-semibold text-brand"
                        : isToday
                          ? "state cursor-pointer border border-field font-semibold text-link"
                          : "state cursor-pointer font-medium text-ink"
                  }`}
                >
                  {d.getDate()}
                </button>
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-4 text-b12 text-ink-2">
          <span className="flex items-center gap-2">
            <span className="size-3.5 rounded-[4px] border border-field" />
            Today
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3.5 rounded-[4px] border-[1.5px] border-choice bg-tint" />
            Selected
          </span>
        </div>
      </div>
      <button type="button" onClick={() => onConfirm(pick)} className={primaryBtn}>
        Confirm date
      </button>
    </div>
  );
}

function MonthButton({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous month" : "Next month"}
      className="state flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line disabled:cursor-default disabled:opacity-40"
    >
      <img src={`/icons/checkout/arrow-${dir === "prev" ? "left" : "right"}-18.svg`} alt="" className="size-[18px]" />
    </button>
  );
}
