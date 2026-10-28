import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { BackHeading, DashedDivider } from "@/components/booking/BookingParts";
import type { Professional } from "@/data/professionals";
import { ReviewsCard } from "./ReviewsCard";
import { ShareButton } from "./ShareButton";

/** Three stats split by vertical hairlines: experience · rating · home visits. */
function Stats({ pro }: { pro: Professional }) {
  const items = [
    { value: pro.stats.experience, label: "Experience" },
    { value: pro.stats.rating, label: pro.stats.ratingCount },
    { value: pro.stats.visits, label: "Home visits" },
  ];
  return (
    <dl className="flex w-full items-stretch px-4">
      {items.map((s, i) => (
        <div key={s.label} className="flex flex-1 items-stretch">
          {i > 0 && <span aria-hidden className="w-px shrink-0 bg-line-2" />}
          <div className="flex flex-1 flex-col-reverse items-center gap-1 text-center">
            <dt className="text-b12 leading-[1.3] text-ink-2">{s.label}</dt>
            <dd className="font-display text-h20 leading-normal font-medium">{s.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

function Hero({ pro }: { pro: Professional }) {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <img src={pro.photo} alt="" width={96} height={96} className="size-24 rounded-full" />
        <div className="flex flex-col items-center gap-1">
          <h2 className="font-display text-h20 leading-normal font-semibold">{pro.name}</h2>
          <p className="flex items-center gap-1 rounded-[32px] border border-verified bg-verified px-2 py-1 text-b12 leading-normal font-medium text-brand">
            <img src="/icons/booking/verify-16.svg" alt="" className="size-4" />
            {pro.badge}
          </p>
        </div>
      </div>
      <Stats pro={pro} />
    </div>
  );
}

function AboutCard({ pro }: { pro: Professional }) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-lg bg-card p-4 shadow-card">
      <h2 className="font-display text-b16 leading-normal font-semibold">About</h2>
      <DashedDivider />
      <dl className="flex flex-col gap-3 text-b14 leading-normal">
        {pro.about.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <dt className="text-ink-2">{row.label}</dt>
            <dd className="text-right font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/**
 * Professional profile (W19.02 / M19.02). Desktop: profile + about (420) beside reviews.
 * Mobile: hero on a soft blue gradient under a transparent app bar, then about and reviews cards.
 */
export function ProfessionalProfile({ pro, backHref }: { pro: Professional; backHref: string }) {
  const appBar = (
    <div className="sticky top-0 z-20 flex h-16 items-center gap-2 px-4 py-3 md:hidden">
      <Link href={backHref} aria-label="Back" className="state flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-card">
        <img src="/icons/icon-back.svg" alt="" className="size-5" />
      </Link>
      <h1 className="min-w-0 flex-1 truncate font-display text-h20 font-semibold">Professional</h1>
      <ShareButton title={`${pro.name} · Dr. Morepen Home`} />
    </div>
  );

  return (
    <PageShell title="Professional" backHref={backHref} appBar={appBar}>
      {/* Mobile gradient sits behind the app bar too (negative margin pulls it up). */}
      <div className="-mt-16 bg-[linear-gradient(180deg,var(--color-pro-hero)_180px,var(--color-card)_380px)] pt-16 md:mt-0 md:bg-none md:pt-0">
        <div className="page-narrow flex flex-col gap-6 pt-6 pb-10 md:pt-8 md:pb-12">
          <BackHeading href={backHref} title="Professional" />
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div className="flex flex-col gap-2 md:w-[420px] md:shrink-0 md:gap-4">
              <div className="md:rounded-lg md:bg-card md:px-4 md:py-6 md:shadow-card">
                <Hero pro={pro} />
              </div>
              <div className="mt-6 md:mt-0">
                <AboutCard pro={pro} />
              </div>
            </div>
            <div className="-mt-6 flex min-w-0 flex-1 flex-col gap-2 md:mt-0 md:gap-4">
              <ReviewsCard pro={pro} />
              <p className="text-center text-b14 text-ink-2 md:pt-4">
                <span className="font-semibold text-ink">Want {pro.firstName} again?</span> When you book your next service, choose{" "}
                {pro.pronoun} under <span className="font-semibold text-ink">Your previous provider</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
