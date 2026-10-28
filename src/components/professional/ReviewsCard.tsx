"use client";

import { useMemo, useState } from "react";
import { DashedDivider } from "@/components/booking/BookingParts";
import { Skeleton } from "@/components/ui/Skeleton";
import { reviewFilters, type Professional, type ProfessionalReview, type ReviewFilter } from "@/data/professionals";

const PAGE = 3;

function applyFilter(reviews: ProfessionalReview[], filter: ReviewFilter) {
  switch (filter) {
    case "Most relevant":
      return reviews; // API order is relevance order.
    case "Positive":
      return reviews.filter((r) => r.rating >= 4);
    case "Critical":
      return reviews.filter((r) => r.rating <= 3);
    case "With photos":
      return [];
    default:
      return reviews;
  }
}

function RatingBadge({ rating }: { rating: number }) {
  return (
    <span className="flex shrink-0 items-center gap-0.5 rounded-[6px] bg-rating px-2 py-1 text-b12 font-medium text-on-dark shadow-[inset_0_2px_4px_0_rgb(255_255_255/0.15)]">
      {rating}
      <img src="/icons/booking/star-white-12.svg" alt="" className="size-3" />
      <span className="sr-only"> out of 5 stars</span>
    </span>
  );
}

function ReviewItem({ review }: { review: ProfessionalReview }) {
  return (
    <article className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-b12 font-semibold text-brand-blue">
          {review.name[0]}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="font-display text-b14 leading-5 font-semibold">{review.name}</p>
          <p className="text-b12 text-ink-2">{review.date}</p>
        </div>
        <RatingBadge rating={review.rating} />
      </div>
      <p className="text-b14">{review.text}</p>
    </article>
  );
}

function ReviewSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-accent-soft">
          <Skeleton className="size-2" />
        </span>
        <div className="flex flex-1 flex-col gap-1">
          <Skeleton className="h-2.5 w-14" />
          <Skeleton className="h-2 w-12" />
        </div>
      </div>
      <Skeleton className="h-2.5 w-full" />
      <Skeleton className="h-2.5 w-3/5" />
    </div>
  );
}

/** Reviews card (W19.02): average + per-star bars, filter chips, list with "Show more". */
export function ReviewsCard({ pro }: { pro: Professional }) {
  const [filter, setFilter] = useState<ReviewFilter>("Most relevant");
  const [shown, setShown] = useState(PAGE);
  const [loading, setLoading] = useState(false);

  const list = useMemo(() => applyFilter(pro.reviews, filter), [pro.reviews, filter]);
  const visible = list.slice(0, shown);
  const total = pro.reviewSummary.breakdown.reduce((a, b) => a + b, 0);

  function pick(f: ReviewFilter) {
    setFilter(f);
    setShown(PAGE);
  }

  function more() {
    // Placeholder for the next page request (W20.15 "More reviews" loading).
    setLoading(true);
    setTimeout(() => {
      setShown((s) => s + PAGE);
      setLoading(false);
    }, 700);
  }

  return (
    <section className="flex w-full flex-col gap-4 rounded-lg bg-card p-4 shadow-card" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="font-display text-b16 font-semibold">
        Reviews
      </h2>
      <DashedDivider />
      <div className="flex flex-col gap-8">
        <div className="flex items-start gap-6">
          <div className="flex shrink-0 flex-col justify-center gap-2">
            <div className="flex items-start gap-2">
              <img src="/icons/booking/star-32.svg" alt="" className="size-8" />
              <p className="font-display text-h32 font-medium tracking-[-0.32px]">{pro.reviewSummary.average}</p>
            </div>
            <p className="text-b14 text-ink-2">{pro.reviewSummary.count} reviews</p>
          </div>
          <ul className="flex min-w-0 flex-1 flex-col gap-1.5" aria-label="Ratings by stars">
            {pro.reviewSummary.breakdown.map((count, i) => {
              const stars = 5 - i;
              return (
                <li key={stars} className="flex items-center gap-2.5">
                  <span className="flex w-7 shrink-0 items-center gap-1 text-b12 font-medium">
                    {stars}
                    <img src="/icons/booking/star-12.svg" alt="" className="size-3" />
                    <span className="sr-only"> stars</span>
                  </span>
                  <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-[6px] bg-accent-soft">
                    <span className="block h-full min-w-[3px] rounded-[6px] bg-ink" style={{ width: `${(count / total) * 100}%` }} />
                  </span>
                  <span className="w-9 shrink-0 text-right text-b12 text-ink-2">{count}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <div className="scroller -mx-4 gap-2 px-4 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filter reviews">
            {reviewFilters.map((f) =>
              f === filter ? (
                <span key={f} className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink py-2 pr-2 pl-4 text-b12 leading-[18px] font-semibold text-on-dark">
                  {f}
                  {f !== "All" && (
                    <button
                      type="button"
                      onClick={() => pick("All")}
                      aria-label={`Clear ${f} filter`}
                      className="flex size-[18px] cursor-pointer items-center justify-center rounded-full bg-card"
                    >
                      <img src="/icons/booking/add-14.svg" alt="" className="size-3.5 -rotate-45" />
                    </button>
                  )}
                </span>
              ) : (
                <button
                  key={f}
                  type="button"
                  onClick={() => pick(f)}
                  className="state shrink-0 cursor-pointer rounded-full bg-muted px-4 py-2 text-b12 leading-[18px] font-medium"
                >
                  {f}
                </button>
              ),
            )}
          </div>

          <div className="flex flex-col gap-6" aria-live="polite">
            {visible.length === 0 && <p className="py-4 text-center text-b14 text-ink-2">No {filter.toLowerCase()} reviews yet.</p>}
            {visible.map((r, i) => (
              <div key={r.id} className="flex flex-col gap-6">
                {i > 0 && <div className="h-px bg-hairline" />}
                <ReviewItem review={r} />
              </div>
            ))}
            {loading &&
              [0, 1].map((i) => (
                <div key={i} className="flex flex-col gap-6">
                  <div className="h-px bg-hairline" />
                  <ReviewSkeleton />
                </div>
              ))}
            {!loading && shown < list.length && (
              <button type="button" onClick={more} className="state flex cursor-pointer items-center justify-center gap-1 rounded-lg text-b14 font-semibold text-ink-2">
                Show more
                <img src="/icons/booking/chevron-down-14.svg" alt="" className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
