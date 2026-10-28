import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SlowNetworkToast } from "@/components/ui/NetworkToasts";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";

function CarouselHead({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className={`h-3 md:h-4 ${title}`} />
      <div className="hidden gap-2 md:flex">
        <Skeleton tone="block" round className="size-10" />
        <Skeleton tone="block" round className="size-10" />
      </div>
    </div>
  );
}

/** Same scroller as the loaded carousels; the last card bleeds off the edge. */
function CardRow({ count, card, children }: { count: number; card: string; children?: React.ReactNode }) {
  return (
    <div className="flex gap-2 overflow-hidden md:gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`relative flex shrink-0 flex-col justify-end gap-2 rounded-xl bg-muted p-2 md:p-4 ${card}`}>
          {children ?? (
            <>
              <Skeleton className="h-2 w-[90%]" />
              <Skeleton className="h-2 w-3/5" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/** W20.01 / M20.01 Home skeleton: hero tiles and promo, partners, how we work, three carousels, talk to us. */
export function HomeSkeleton() {
  return (
    <>
      <div className="hidden md:block">
        <SiteHeader />
      </div>
      <SkeletonGroup label="Loading home" className="flex flex-col gap-10 pb-10 md:gap-20 md:pb-20">
        {/* Mobile hero: grey block with location, search and promo bars. */}
        <div className="flex flex-col gap-4 rounded-b-2xl bg-muted px-4 pt-4 pb-3 md:hidden">
          <div className="flex items-center justify-between">
            <Skeleton tone="block" className="h-[35px] w-[61px] bg-card" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="size-6" />
            </div>
          </div>
          <div className="flex h-12 items-center rounded-lg bg-card px-4">
            <Skeleton className="h-2.5 w-[210px]" />
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-4 w-[130px]" />
          </div>
          <span className="flex h-8 w-24 items-center justify-center rounded-full bg-card">
            <Skeleton className="h-2 w-12" />
          </span>
          <Skeleton tone="block" className="mx-auto h-1.5 w-[18px] bg-card" />
        </div>

        <div className="page flex flex-col gap-10 md:gap-16 md:pt-14">
          <div className="flex flex-col-reverse gap-8 rounded-lg bg-tint-2 lg:flex-row">
            <div className="flex flex-1 flex-col gap-6 md:gap-10">
              <div className="flex flex-col gap-6">
                <Skeleton className="hidden h-4 w-[336px] md:block" />
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="relative h-[88px] overflow-hidden rounded-xl bg-tile md:h-[124px]">
                      <Skeleton className="absolute top-2 left-2 h-2 w-10 md:top-4 md:left-4 md:w-[86px]" />
                      <span className="absolute right-0 bottom-0 size-12 rounded-tl-lg bg-muted md:size-[80px]" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between md:px-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Skeleton tone="block" round className="size-5 md:size-7" />
                      <Skeleton className="h-2.5 w-9" />
                    </div>
                    <Skeleton className="h-2 w-20" />
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden min-h-[388px] flex-1 overflow-hidden rounded-2xl bg-muted p-12 md:block">
              <div className="flex w-[340px] flex-col gap-2.5">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-1/2" />
                <Skeleton className="h-3 w-[280px]" />
                <Skeleton className="h-3 w-[250px]" />
              </div>
              <span className="mt-6 flex h-8 w-[100px] items-center justify-center rounded-full bg-card">
                <Skeleton className="h-2 w-12" />
              </span>
              <Skeleton tone="block" className="absolute bottom-4 left-1/2 h-1.5 w-[18px] -translate-x-1/2 bg-card" />
            </div>
          </div>

          {/* Partners */}
          <div className="relative pt-3">
            <div className="flex items-center justify-between gap-4 rounded-lg border border-line px-4 py-4 md:px-[120px] md:py-6">
              {["w-[60px] md:w-[108px]", "w-[60px] md:w-[108px]", "w-[34px] md:w-[68px]", "w-[54px] md:w-[92px]"].map((w, i) => (
                <Skeleton key={i} tone="block" className={`h-8 md:h-[52px] ${w}`} />
              ))}
            </div>
            <span className="absolute top-0 left-1/2 -translate-x-1/2 bg-card px-4">
              <Skeleton className="h-2.5 w-[160px] md:h-3 md:w-[256px]" />
            </span>
          </div>
        </div>

        {/* How we work */}
        <section className="md:page">
          <div className="bg-muted pt-[220px] md:flex md:gap-3 md:rounded-3xl md:bg-tint md:p-3">
            <div className="relative z-10 mx-4 -mt-3 flex flex-col gap-6 rounded-2xl bg-card pt-4 pb-6 md:m-0 md:w-[520px] md:shrink-0 md:pt-6 md:pb-9">
              <Skeleton className="mx-auto h-3 w-[230px] md:w-[130px]" />
              <div className="h-px bg-line-2" />
              <div className="flex flex-col gap-6 px-4 md:px-6">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col gap-6">
                    {i > 0 && <div className="h-px bg-line-2" />}
                    <div className="flex items-center gap-4">
                      <Skeleton tone="block" round className="size-16 md:size-24" />
                      <div className="flex flex-1 flex-col gap-2">
                        <Skeleton className="h-2.5 w-[90%]" />
                        <Skeleton className="h-2 w-full" />
                        <Skeleton className="h-2 w-3/5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden flex-1 rounded-2xl bg-muted md:block" />
          </div>
        </section>

        <section className="page flex flex-col gap-4 md:gap-6">
          <CarouselHead title="w-[214px] md:w-[248px]" />
          <CardRow count={6} card="h-[255px] w-[206px] md:h-[332px] md:w-[279px]" />
        </section>
        <section className="page flex flex-col gap-4 md:gap-6">
          <CarouselHead title="w-[168px] md:w-[192px]" />
          <CardRow count={6} card="h-[100px] w-[113px] md:h-[220px] md:w-[233px]">
            <Skeleton className="mx-auto h-2 w-12" />
          </CardRow>
        </section>
        <section className="page flex flex-col gap-4 md:gap-6">
          <CarouselHead title="w-[240px] md:w-[286px]" />
          <CardRow count={6} card="h-[184px] w-[124px] md:h-[360px] md:w-[252px]">
            <span className="absolute inset-0 m-auto flex size-10 items-center justify-center rounded-full bg-card">
              <Skeleton tone="block" round className="size-3" />
            </span>
          </CardRow>
        </section>

        {/* Talk to us */}
        <section className="page">
          <div className="flex items-center justify-between gap-4 md:h-[370px] md:rounded-2xl md:bg-tint md:p-12">
            <div className="flex flex-col gap-3 md:w-[724px] md:gap-6">
              <div className="hidden items-center gap-3 md:flex">
                <div className="flex">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} tone="block" round className={`size-10 border-2 border-card ${i ? "-ml-3" : ""}`} />
                  ))}
                </div>
                <Skeleton className="h-2.5 w-[190px]" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[130px] md:h-5 md:w-[460px]" />
                <Skeleton className="h-4 w-[90px] md:h-3 md:w-[430px]" />
              </div>
              <Skeleton className="h-2.5 w-[160px] md:hidden" />
              <div className="hidden gap-3 md:flex">
                {["w-[220px]", "w-[250px]", "w-[210px]"].map((w) => (
                  <span key={w} className={`flex h-9 items-center gap-2 rounded-full bg-card px-4 ${w}`}>
                    <Skeleton className="h-2 flex-1" />
                    <Skeleton tone="block" round className="size-3" />
                  </span>
                ))}
              </div>
              <Skeleton tone="block" className="hidden h-12 w-[196px] rounded-lg md:block" />
            </div>
            <img src="/icons/talk-illustration.svg" alt="" className="w-[150px] shrink-0 opacity-20 grayscale md:w-[288px]" />
          </div>
        </section>
      </SkeletonGroup>
      <SiteFooter />
      <SlowNetworkToast />
    </>
  );
}
