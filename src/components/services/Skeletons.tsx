import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";

/** Card placeholder used by the listing and search skeletons (W20.02, W20.04). */
export function CardSkeleton() {
  return (
    <div className="flex gap-4 rounded-lg border border-line p-4">
      <div className="flex flex-1 flex-col gap-3">
        <Skeleton className="h-3.5 w-3/5" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-3" round />
          <Skeleton className="h-2.5 w-24" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-2.5 w-8" />
          <Skeleton className="h-2.5 w-8" />
        </div>
        <img src="/icons/services/dashed-divider.svg" alt="" className="h-px w-full" />
        <Skeleton className="h-2.5 w-4/5" />
        <Skeleton className="h-2.5 w-3/4" />
        <Skeleton className="mt-1 h-3 w-20" />
      </div>
      <div className="relative h-[148px] w-[124px] shrink-0">
        <Skeleton className="size-[124px]" />
        <span className="absolute top-[103.5px] left-[17px] flex h-[42px] w-[90px] items-center justify-center rounded-md border border-line bg-card">
          <Skeleton className="h-2.5 w-8" />
        </span>
      </div>
    </div>
  );
}

/** W20.02 / M20.02 Nurse at home skeleton. */
export function ListingSkeleton() {
  return (
    <SkeletonGroup label="Loading services" className="flex flex-col gap-8 pt-2 pb-16 md:page md:flex-row md:gap-6 md:pt-8">
      <div className="hidden w-[320px] shrink-0 flex-col gap-6 md:flex">
        <div className="flex flex-col gap-4 rounded-lg border border-line p-4">
          <div className="flex items-center gap-3">
            <Skeleton round className="size-10" />
            <Skeleton className="h-5 flex-1" />
          </div>
          <Skeleton className="h-3 w-28" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`flex h-16 items-center gap-3 rounded-md px-2 ${i === 0 ? "bg-tint" : ""}`}>
              <Skeleton className="size-12" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
        <div className="flex h-[207px] flex-col gap-4 rounded-xl bg-tint p-6">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-11 w-48" />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <Skeleton className="mx-4 h-[177px] rounded-2xl md:mx-0 md:h-[260px]" />
        <div className="grid grid-cols-3 gap-2 px-4 md:hidden">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-[101px] w-full" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 px-4 md:px-0">
          <Skeleton className="h-4 w-44" />
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </SkeletonGroup>
  );
}

/** W20.04 / M20.04 search results skeleton. */
export function SearchSkeleton() {
  return (
    <SkeletonGroup label="Loading results" className="page-narrow flex flex-col gap-6 pt-6 pb-16 md:pt-8">
      <div className="flex items-center gap-3">
        <Skeleton round className="size-10" />
        <Skeleton className="h-6 flex-1 md:w-60 md:flex-none" />
      </div>
      <Skeleton className="h-4 w-24" />
      <div className="grid gap-4 md:grid-cols-2">
        <CardSkeleton />
      </div>
      <Skeleton className="h-4 w-36" />
      <div className="grid gap-4 md:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </SkeletonGroup>
  );
}
