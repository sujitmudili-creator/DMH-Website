import { PageShell } from "@/components/site/PageShell";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { SlowNetworkToast } from "@/components/ui/NetworkToasts";
import { routes } from "@/lib/routes";
import { BackHeading, Card, DashedDivider } from "./BookingParts";

function Row({ a, b }: { a: string; b: string }) {
  return (
    <div className="flex items-center gap-3">
      <Skeleton tone="block" round className="size-11" />
      <div className="flex flex-col gap-1">
        <Skeleton className={`h-2.5 ${a}`} />
        <Skeleton className={`h-2.5 ${b}`} />
      </div>
    </div>
  );
}

function BarPair({ a, b }: { a: string; b: string }) {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className={`h-2 ${a}`} />
      <Skeleton className={`h-2 ${b}`} />
    </div>
  );
}

/** W20.07 / M20.07 Booking details skeleton: same cards and columns as the loaded page. */
export function BookingDetailsSkeleton({ title = "Booking details" }: { title?: string }) {
  return (
    <PageShell title={title} backHref={routes.bookings}>
      <SkeletonGroup label="Loading booking" className="min-h-[calc(100dvh-64px)] bg-tint-page md:min-h-[calc(100dvh-73px)]">
        <div className="page-narrow flex flex-col gap-6 pt-6 pb-40 md:pt-8 md:pb-12">
          <BackHeading href={routes.bookings} title={title} />
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-6">
            <div className="flex flex-col gap-3 max-md:contents md:min-w-0 md:flex-1 md:gap-2">
              {/* Status */}
              <Card radius="lg" className="order-1 flex items-center gap-3 p-4">
                <Skeleton tone="block" className="size-[51px]" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-2 w-[220px]" />
                </div>
              </Card>
              {/* Booking details */}
              <Card className="order-4 flex flex-col gap-4 p-4">
                <Skeleton className="h-2.5 w-[120px]" />
                <DashedDivider />
                <div className="flex flex-col gap-4">
                  <Row a="w-[85px]" b="w-[27px]" />
                  <Row a="w-[77px]" b="w-[49px]" />
                  <Row a="w-[27px]" b="w-[155px]" />
                </div>
              </Card>
              {/* Bill */}
              <Card className="order-5 flex flex-col gap-4 overflow-hidden pt-4">
                <Skeleton className="mx-4 h-2.5 w-24" />
                <DashedDivider className="mx-4" />
                <div className="flex flex-col gap-2.5 px-4">
                  <BarPair a="w-[150px]" b="w-[42px]" />
                  <BarPair a="w-[176px]" b="w-[28px]" />
                  <BarPair a="w-[58px]" b="w-[56px]" />
                  <BarPair a="w-[36px]" b="w-[26px]" />
                </div>
                <div className="h-px bg-line-2" />
                <div className="px-4 pb-1">
                  <BarPair a="w-[146px]" b="w-[50px]" />
                </div>
                <div className="flex flex-col">
                  <div className="relative h-2 overflow-hidden" aria-hidden>
                    <img src="/icons/booking/savings-wave.svg" alt="" className="absolute bottom-0 left-0 h-1.5 w-[552px] max-w-none" />
                  </div>
                  <div className="bg-success-tint px-4 pt-3 pb-4">
                    <Skeleton className="h-2 w-[156px] opacity-60" />
                  </div>
                </div>
              </Card>
              {/* Policy */}
              <Card className="order-6 flex items-center gap-3 p-4">
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-2.5 w-[130px]" />
                  <Skeleton className="h-2 w-[296px] max-w-full" />
                </div>
                <img src="/icons/booking/chevron-down-16.svg" alt="" className="size-[17.23px] opacity-20" />
              </Card>
            </div>

            <div className="flex flex-col gap-4 max-md:contents md:w-[400px] md:shrink-0">
              <div className="flex flex-col gap-2 max-md:contents">
                <Card radius="lg" className="order-2 flex items-center gap-3 p-4">
                  <Skeleton tone="block" round className="size-12" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Skeleton className="h-2.5 w-[86px]" />
                    <Skeleton className="h-2 w-[134px]" />
                  </div>
                  <img src="/icons/booking/chevron-right-16.svg" alt="" className="size-4 opacity-20" />
                </Card>
                <Card className="order-3 flex flex-col gap-4 p-4">
                  <Skeleton className="h-2.5 w-[100px]" />
                  <DashedDivider />
                  {[0, 1].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton tone="block" className="size-14 rounded-[10px]" />
                      <div className="flex flex-col gap-1.5">
                        <Skeleton className={`h-2.5 ${i ? "w-[176px]" : "w-[148px]"}`} />
                        <BarPair a="w-7" b="w-9" />
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
              <div className="hidden flex-col items-center gap-3 md:flex">
                <Skeleton className="h-2 w-[204px]" />
                <Skeleton tone="block" className="flex h-[67px] w-full items-center justify-center rounded-lg" />
              </div>
            </div>
          </div>
        </div>
        {/* Mobile bottom bar */}
        <div className="fixed inset-x-0 bottom-0 flex flex-col items-center gap-4 bg-card px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom))] shadow-bar md:hidden">
          <Skeleton className="h-2.5 w-[204px]" />
          <Skeleton tone="block" className="h-13 w-full rounded-lg" />
        </div>
      </SkeletonGroup>
      <SlowNetworkToast />
    </PageShell>
  );
}
