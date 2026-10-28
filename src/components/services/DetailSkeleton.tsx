"use client";

import { Modal } from "@/components/ui/Modal";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";

/** W20.03 / M20.03 service detail skeleton: the pop up shape over the listing while the service loads. */
export function DetailSkeleton() {
  return (
    <Modal
      open
      onClose={() => {}}
      footer={
        <div className="flex items-center justify-between gap-4" aria-hidden>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex gap-2">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2.5 w-36" />
          </div>
          <span className="flex h-14 flex-1 items-center justify-center rounded-lg bg-muted">
            <Skeleton className="h-2.5 w-16 bg-card" />
          </span>
        </div>
      }
    >
      <SkeletonGroup label="Loading service" className="flex flex-col gap-6 pb-8">
        <div className="relative">
          <Skeleton className="h-60 w-full rounded-none md:h-[300px]" />
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="size-10 rounded-full border-2 border-card" />
            <span className="size-10 rounded-full border-2 border-card" />
          </div>
        </div>
        <div className="flex flex-col gap-2 px-4 md:px-6">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-2.5 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-2.5 w-8" />
            <Skeleton className="h-2.5 w-8" />
            <Skeleton className="h-2.5 w-12" />
          </div>
          <Skeleton className="mt-2 h-2.5 w-full" />
          <Skeleton className="h-2.5 w-11/12" />
        </div>
        <div className="flex flex-col items-center gap-4 px-4 md:px-6">
          <Skeleton className="h-3.5 w-40" />
          <div className="grid w-full grid-cols-2 gap-3">
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-col gap-3 rounded-lg bg-page p-2">
                <Skeleton className="h-28 w-full bg-card/60" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </SkeletonGroup>
    </Modal>
  );
}
