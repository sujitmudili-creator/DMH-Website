import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";

/** Booking card skeleton (W20.06 / M20.06). */
function BookingCardSkeleton({ titleW, proW }: { titleW: number; proW: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line p-4">
      <div className="flex justify-between pb-4">
        <Skeleton className="h-2 w-[126px]" />
        <Skeleton className="h-2 w-[54px]" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-2.5" style={{ width: titleW }} />
        <Skeleton className="h-2 w-[60px]" />
      </div>
      {[proW, 127].map((w, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-8" round />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-2.5" style={{ width: i ? 28 : Math.round(w * 0.63) }} />
            <Skeleton className="h-2" style={{ width: w }} />
          </div>
        </div>
      ))}
      <img src="/icons/profile/divider-dashed.svg" alt="" className="h-px w-full" />
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-2.5 w-12" />
          <Skeleton className="h-2 w-[106px]" />
        </div>
        <span className="flex h-[47px] w-[107px] items-center justify-center rounded-md border border-line">
          <Skeleton className="h-2 w-14" />
        </span>
      </div>
    </div>
  );
}

export function BookingsSkeleton() {
  return (
    <SkeletonGroup label="Loading your bookings" className="flex flex-col gap-4">
      <div className="flex h-[53px] gap-1 rounded-full bg-muted p-1">
        <span className="flex flex-1 items-center justify-center rounded-full bg-card">
          <Skeleton className="h-2 w-14" />
        </span>
        <span className="flex flex-1 items-center justify-center">
          <Skeleton className="h-2 w-7 bg-none! bg-line!" />
        </span>
        <span className="flex flex-1 items-center justify-center">
          <Skeleton className="h-2 w-16 bg-none! bg-line!" />
        </span>
      </div>
      <BookingCardSkeleton titleW={168} proW={133} />
      <BookingCardSkeleton titleW={136} proW={189} />
    </SkeletonGroup>
  );
}

/** Saved addresses skeleton (W20.09 / M20.09). */
export function AddressesSkeleton() {
  return (
    <SkeletonGroup label="Loading your addresses" className="flex flex-col gap-6">
      <div className="flex items-center gap-2 rounded-lg border border-line p-4">
        <Skeleton className="size-[22px]" round />
        <Skeleton className="h-2 w-[105px]" />
        <Skeleton className="ml-auto size-[18px]" round />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-2.5 w-40" />
        {[357, 217].map((w) => (
          <div key={w} className="flex items-start gap-4 rounded-lg border border-line p-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-tint">
              <Skeleton className="size-[22px]" round />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton className="h-2 w-8" />
              <Skeleton className="h-2 max-w-full" style={{ width: w }} />
              <Skeleton className="h-2 w-[203px] max-w-full" />
              <Skeleton className="mt-2 h-2 w-[126px]" />
            </div>
            <span className="size-9 shrink-0 rounded-full border border-line" />
          </div>
        ))}
      </div>
    </SkeletonGroup>
  );
}
