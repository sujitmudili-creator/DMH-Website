import { PageShell } from "@/components/site/PageShell";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { routes } from "@/lib/routes";
import { Card, Dashed } from "./parts";

const bar = "h-2.5 rounded-[4px]";

/** W20.05 / M20.05 Checkout skeleton: same cards as checkout, content as shimmer bars. */
export function CheckoutSkeleton() {
  return (
    <PageShell title="Checkout" backHref={routes.home}>
      <div className="min-h-[calc(100dvh-64px)] bg-page md:min-h-0 md:bg-card">
        <div className="page-narrow pt-6 pb-12 md:pt-8">
          <div className="mb-6 hidden items-center gap-3 md:flex">
            <span className="flex size-10 items-center justify-center rounded-full border border-line">
              <img src="/icons/icon-back.svg" alt="" className="size-5" />
            </span>
            <h1 className="font-display text-h24 font-semibold">Checkout</h1>
          </div>
          <SkeletonGroup label="Loading checkout" className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
            <div className="contents md:flex md:min-w-0 md:flex-1 md:flex-col md:gap-4">
              <Card raised className="order-2 flex flex-col gap-4 p-4 md:order-none">
                <Skeleton className={`${bar} w-[88px]`} />
                <Dashed />
                {[112, 40, 60].map((w, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton round className="size-11" />
                    <div className="flex flex-1 flex-col gap-1.5">
                      <Skeleton className={`${bar} w-[84px]`} />
                      <Skeleton className={bar} style={{ width: w * 1.4 }} />
                    </div>
                    <Skeleton className={`${bar} w-9 max-md:hidden`} />
                  </div>
                ))}
              </Card>
              <Card className="order-3 flex flex-col items-center gap-4 p-4 md:order-none">
                <Skeleton className={`${bar} w-[152px]`} />
                <div className="grid w-full grid-cols-2 gap-3">
                  {[0, 1].map((i) => (
                    <div key={i} className="flex flex-col gap-3 rounded-lg bg-page p-2 pb-3">
                      <Skeleton className="h-28 w-full" />
                      <Skeleton className={`${bar} w-28`} />
                      <Skeleton className={`${bar} w-20`} />
                      <Dashed />
                      <div className="flex items-center justify-between">
                        <Skeleton className={`${bar} w-10`} />
                        <span className="flex h-[39px] w-1/2 items-center justify-center rounded-md border border-line bg-card">
                          <Skeleton className={`${bar} w-10`} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card raised className="order-6 flex items-center gap-3 p-4 md:order-none">
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className={`${bar} w-[215px]`} />
                  <Skeleton className={`${bar} w-[320px] max-w-full`} />
                </div>
                <img src="/icons/checkout/chevron-down.svg" alt="" className="size-4 opacity-30" />
              </Card>
            </div>
            <div className="contents md:flex md:w-[420px] md:shrink-0 md:flex-col md:gap-4">
              <Card className="order-1 flex flex-col gap-4 p-4 md:order-none">
                <Skeleton className={`${bar} w-[101px]`} />
                <Dashed />
                {[0, 1].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="size-14 rounded-[10px]" />
                    <div className="flex flex-1 flex-col gap-1.5">
                      {i === 1 && <Skeleton className={`${bar} w-[52px]`} />}
                      <Skeleton className={`${bar} w-[150px]`} />
                      <Skeleton className={`${bar} w-[60px]`} />
                    </div>
                    <Skeleton className={`${bar} w-9`} />
                  </div>
                ))}
              </Card>
              <Card className="order-4 flex items-center gap-3 p-4 md:order-none">
                <img src="/icons/checkout/discount-32.svg" alt="" className="size-8 opacity-20 grayscale" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className={`${bar} w-[84px]`} />
                  <Skeleton className={`${bar} w-[120px]`} />
                </div>
                <Skeleton round className="size-5" />
              </Card>
              <Card className="order-5 flex flex-col gap-4 overflow-hidden pt-4 md:order-none">
                <Skeleton className={`${bar} mx-4 w-[98px]`} />
                <Dashed />
                <div className="flex flex-col gap-2 px-4">
                  {[[174, 40], [174, 26], [56, 56], [36, 26]].map(([a, b], i) => (
                    <div key={i} className="flex gap-2">
                      <Skeleton className={bar} style={{ width: a }} />
                      <Skeleton className={bar} style={{ width: b }} />
                    </div>
                  ))}
                </div>
                <div className="h-px bg-line-2" />
                <div className="flex gap-2 px-4">
                  <Skeleton className={`${bar} w-12`} />
                  <Skeleton className={`${bar} w-12`} />
                </div>
                <div>
                  <div aria-hidden className="h-2 bg-[url(/icons/checkout/savings-wave.svg)] bg-[length:auto_6px] bg-bottom-left bg-repeat-x" />
                  <div className="flex items-center justify-between bg-success-tint px-4 py-4">
                    <span className="h-2.5 w-[126px] rounded-[4px] bg-success/10" />
                    <span className="h-2.5 w-7 rounded-[4px] bg-success/10" />
                  </div>
                </div>
              </Card>
              <div className="hidden flex-col items-center gap-3 md:flex">
                <span className="flex h-[52px] w-full items-center justify-center rounded-lg bg-muted">
                  <Skeleton className={`${bar} w-[120px]`} />
                </span>
                <Skeleton className="h-1.5 w-[310px] rounded-[4px]" />
              </div>
            </div>
          </SkeletonGroup>
        </div>
      </div>
    </PageShell>
  );
}
