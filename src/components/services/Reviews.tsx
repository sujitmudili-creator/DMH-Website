"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { RatingSummary, Review } from "@/data/services";

const FILTERS = ["Most relevant", "All", "Positive", "Critical", "With photos"] as const;
type Filter = (typeof FILTERS)[number];

const PAGE = 3;

function apply(filter: Filter, list: Review[]) {
  switch (filter) {
    case "Positive":
      return list.filter((r) => r.rating >= 4);
    case "Critical":
      return list.filter((r) => r.rating <= 3);
    case "With photos":
      return list.filter((r) => r.photos);
    case "Most relevant":
      return [...list].sort((a, b) => b.rating - a.rating);
    default:
      return list;
  }
}

/** Rating summary + filter chips + reviews with "Show more" (W1.06 "Reviews", W7.02, W20.15). */
export function Reviews({ summary, reviews }: { summary: RatingSummary; reviews: Review[] }) {
  const [filter, setFilter] = useState<Filter>("Most relevant");
  const [shown, setShown] = useState(PAGE);
  const [loading, setLoading] = useState(false);
  const total = summary.stars.reduce((n, s) => n + s.count, 0);
  const list = apply(filter, reviews);
  const visible = list.slice(0, shown);

  const more = () => {
    // Placeholder for the API call: shows the "More reviews" skeleton (W20.15) briefly.
    setLoading(true);
    setTimeout(() => {
      setShown((n) => n + PAGE);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-6">
        <div className="flex flex-col justify-center gap-1">
          <p className="flex items-center gap-2">
            <img src="/icons/services/star-32.svg" alt="" className="size-8" />
            <span className="font-display text-h32 font-semibold">{summary.average}</span>
          </p>
          <p className="text-b14 whitespace-nowrap text-ink-2">{summary.count} reviews</p>
        </div>
        <ul className="flex min-w-0 flex-1 flex-col gap-2" aria-label="Reviews by stars">
          {summary.stars.map((s) => (
            <li key={s.star} className="flex items-center gap-3">
              <span className="flex w-7 items-center gap-1 text-b12 font-medium">
                {s.star}
                <img src="/icons/services/star.svg" alt="stars" className="size-3" />
              </span>
              <span className="h-1.5 min-w-0 flex-1 rounded-sm bg-tint">
                <span className="block h-1.5 min-w-[3px] rounded-sm bg-inverse" style={{ width: `${(s.count / total) * 100}%` }} />
              </span>
              <span className="w-9 text-right text-b12 text-ink-2">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-6">
        <div role="group" aria-label="Filter reviews" className="scroller -mx-4 gap-2 px-4 md:mx-0 md:px-0">
          {FILTERS.map((f) => {
            const on = f === filter;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setFilter(on ? "All" : f);
                  setShown(PAGE);
                }}
                className={`flex h-[34px] shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-b12 whitespace-nowrap ${
                  on ? "state-dark bg-inverse pr-2 font-semibold text-on-dark" : "state bg-muted font-medium text-ink"
                }`}
              >
                {f}
                {on && (
                  <span className="flex size-[18px] items-center justify-center rounded-full bg-card" aria-hidden>
                    <img src="/icons/booking/add-14.svg" alt="" className="size-3.5 rotate-45" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <ul className="flex flex-col gap-6">
          {visible.length === 0 && <li className="text-b14 text-ink-2">No reviews here yet.</li>}
          {visible.map((r, i) => (
            <li key={r.name + r.date} className={`flex flex-col gap-2 ${i > 0 ? "border-t border-tint pt-6" : ""}`}>
              <div className="flex items-center gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-tint text-b12 font-semibold text-link" aria-hidden>
                  {r.name[0]}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="font-display text-b16 font-semibold">{r.name}</p>
                  <p className="text-b12 text-ink-2">{r.date}</p>
                </div>
                <span
                  className="flex h-[26px] w-[38px] items-center justify-center gap-0.5 rounded-sm bg-rating text-b12 font-medium text-on-dark shadow-[inset_0_2px_4px_0_rgb(255_255_255/0.15)]"
                  aria-label={`${r.rating} stars`}
                >
                  {r.rating}
                  <img src="/icons/booking/star-white-12.svg" alt="" className="size-3" />
                </span>
              </div>
              <p className="text-b14">{r.text}</p>
            </li>
          ))}
          {loading &&
            [0, 1].map((i) => (
              <li key={i} className="flex flex-col gap-2 border-t border-tint pt-6" aria-hidden>
                <div className="flex items-center gap-2">
                  <Skeleton round className="size-8" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2.5 w-16" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </li>
            ))}
        </ul>

        {shown < list.length && !loading && (
          <button type="button" onClick={more} className="state flex cursor-pointer items-center justify-center gap-2 self-center rounded-lg px-3 py-1 text-b14 font-semibold text-ink-2">
            Show more
            <img src="/icons/icon-arrow-down-18.svg" alt="" className="size-[18px]" />
          </button>
        )}
      </div>
    </div>
  );
}
