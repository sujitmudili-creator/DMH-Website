import { BackHeading, DashedDivider } from "@/components/booking/BookingParts";
import { PageShell } from "@/components/site/PageShell";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { SlowNetworkToast } from "@/components/ui/NetworkToasts";
import { routes } from "@/lib/routes";

function ReviewRow({ name }: { name: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-accent-soft">
          <Skeleton className="size-2" />
        </span>
        <div className="flex flex-1 flex-col gap-1">
          <Skeleton className={`h-2.5 ${name}`} />
          <Skeleton className="h-2 w-12" />
        </div>
        <span className="flex items-center gap-0.5 rounded-[6px] bg-muted px-2 py-1">
          <Skeleton className="size-2" />
          <span className="size-3 rounded-[6px] bg-muted" />
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-3/5" />
      </div>
    </div>
  );
}

/** W20.08 / M20.08 Professional profile skeleton. */
export function ProfessionalSkeleton() {
  return (
    <PageShell title="Professional" backHref={routes.bookings}>
      <SkeletonGroup label="Loading profile" className="page-narrow flex flex-col gap-6 pt-6 pb-12 md:pt-8">
        <BackHeading href={routes.bookings} title="Professional" />
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="flex flex-col gap-2 md:w-[420px] md:shrink-0 md:gap-4">
            <div className="flex flex-col items-center gap-6 md:rounded-lg md:bg-card md:px-4 md:py-6 md:shadow-card">
              <div className="flex flex-col items-center gap-3">
                <Skeleton tone="block" round className="size-24" />
                <div className="flex flex-col items-center gap-1">
                  <Skeleton className="h-3.5 w-[120px]" />
                  <span className="flex items-center gap-1 rounded-[32px] border border-verified bg-card px-2 py-1">
                    <img src="/icons/booking/skeleton-verify-16.svg" alt="" className="size-4" />
                    <Skeleton className="h-2 w-20" />
                  </span>
                </div>
              </div>
              <div className="flex w-full px-4">
                {["w-[60px]", "w-[30px]", "w-[30px]"].map((w, i) => (
                  <div key={i} className="flex flex-1 items-stretch">
                    {i > 0 && <span aria-hidden className="w-px bg-line-2" />}
                    <div className="flex flex-1 flex-col items-center gap-1 py-1">
                      <Skeleton className={`h-3.5 ${w}`} />
                      <Skeleton className="h-2 w-[66px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-4 rounded-lg bg-card p-4 shadow-card md:mt-0">
              <Skeleton className="h-[11px] w-10" />
              <DashedDivider />
              <div className="flex flex-col gap-3">
                {[
                  ["w-[83px]", "w-[161px]"],
                  ["w-[63px]", "w-[70px]"],
                  ["w-[63px]", "w-[91px]"],
                ].map(([a, b]) => (
                  <div key={a + b} className="flex items-center justify-between py-1">
                    <Skeleton className={`h-2.5 ${a}`} />
                    <Skeleton className={`h-2.5 ${b}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="-mt-6 flex min-w-0 flex-1 flex-col gap-2 md:mt-0 md:gap-4">
            <div className="flex flex-col gap-4 rounded-lg bg-card p-4 shadow-card">
              <Skeleton className="h-[11px] w-14" />
              <DashedDivider />
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <img src="/icons/booking/skeleton-star-32.svg" alt="" className="size-8" />
                      <Skeleton className="h-3.5 w-11" />
                    </div>
                    <Skeleton className="h-2.5 w-[77px]" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    {["w-[51%]", "w-[5%]", "w-[2%]", "w-[1%]", "w-[1%]"].map((w, i) => (
                      <div key={i} className="flex h-[18px] items-center gap-2.5">
                        <span className="flex w-7 items-center gap-1">
                          <Skeleton className="size-2" />
                          <img src="/icons/booking/skeleton-star-12.svg" alt="" className="size-3" />
                        </span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-[6px] bg-accent-soft">
                          <span className={`block h-full min-w-[3px] rounded-[6px] bg-muted ${w}`} />
                        </span>
                        <Skeleton className="h-2 w-6" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-2 overflow-hidden">
                    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-muted py-2 pr-2 pl-4">
                      <Skeleton className="h-2 w-[78px]" />
                      <span className="flex size-[18px] items-center justify-center rounded-full bg-card">
                        <img src="/icons/booking/skeleton-add-14.svg" alt="" className="size-3.5 -rotate-45" />
                      </span>
                    </span>
                    {["w-[15px]", "w-[46px]", "w-[41px]", "w-[66px]"].map((w) => (
                      <span key={w} className="flex h-[34px] shrink-0 items-center rounded-full bg-muted px-4">
                        <Skeleton className={`h-2 ${w}`} />
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-6">
                    <ReviewRow name="w-[49px]" />
                    <div className="h-px bg-hairline" />
                    <ReviewRow name="w-14" />
                    <div className="h-px bg-hairline" />
                    <ReviewRow name="w-[50px]" />
                    <div className="flex items-center justify-center gap-1">
                      <Skeleton className="h-2.5 w-[63px]" />
                      <span className="h-3.5 w-[13px] rounded-[6.5px] bg-muted" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:pt-4">
              <Skeleton className="h-2.5 w-full" />
              <Skeleton className="h-2.5 w-3/5" />
            </div>
          </div>
        </div>
      </SkeletonGroup>
      <SlowNetworkToast />
    </PageShell>
  );
}
