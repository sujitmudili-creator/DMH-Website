import Link from "next/link";
import { MobileHeroHeader } from "@/components/site/SiteHeader";
import { PartnerLogos } from "@/components/site/PartnerLogos";
import { CropImg } from "@/components/ui/CropImg";
import { serviceTiles, stats } from "@/data/home";
import { routes } from "@/lib/routes";

const headline = (
  <>
    Medical professional at your door in <span className="text-accent">60 minutes</span>
  </>
);

function Dots() {
  return (
    <div className="flex gap-1" aria-hidden>
      <span className="h-1.5 w-[18px] rounded-[3px] bg-card" />
      <span className="size-1.5 rounded-[3px] bg-dot" />
      <span className="size-1.5 rounded-[3px] bg-dot" />
      <span className="size-1.5 rounded-[3px] bg-dot" />
    </div>
  );
}

/** Mobile: header + banner on the blue gradient with rounded bottom (M1.01 "Hero"). */
function MobileHero() {
  return (
    <div className="relative overflow-hidden rounded-b-2xl pt-3 md:hidden" style={{ backgroundImage: "var(--gradient-hero)" }}>
      <MobileHeroHeader />
      <div className="relative h-[177px] overflow-hidden bg-gradient-to-b from-transparent from-[72%] to-black/10 to-[92%]">
        <img src="/icons/decor-ring-300.svg" alt="" className="absolute top-[25px] left-[calc(100%-246px)] size-[300px] max-w-none" />
        <img src="/icons/decor-ring-220.svg" alt="" className="absolute top-[65px] left-[calc(100%-206px)] size-[220px] max-w-none" />
        <CropImg
          src="/img/hero-photo.png"
          alt="A doctor visiting an older woman at home"
          className="absolute -top-2 right-0 size-[239px]"
          crop={{ left: "0.14%", top: "5.41%", width: "134.16%", height: "89.44%" }}
        />
        <div className="absolute top-6 left-4 flex w-[211px] flex-col gap-2">
          <h1 className="font-display text-h20 font-semibold text-on-dark">{headline}</h1>
          <Link href={routes.category("nurse")} className="state self-start rounded-full bg-card px-4 py-2 text-b12 font-semibold text-link">
            Book a visit
          </Link>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <Dots />
        </div>
      </div>
    </div>
  );
}

/** Desktop banner card (W1.01 "Banner"). */
function DesktopBanner() {
  return (
    <div
      className="relative hidden min-h-[400px] flex-1 overflow-hidden rounded-2xl md:block lg:min-h-0"
      style={{ backgroundImage: "var(--gradient-hero)" }}
    >
      <img src="/icons/decor-ring-480.svg" alt="" className="absolute top-[35px] left-[131px] size-[480px] max-w-none" />
      <img src="/icons/decor-ring-352.svg" alt="" className="absolute top-[99px] left-[195px] size-[352px] max-w-none" />
      <CropImg
        src="/img/hero-photo.png"
        alt="A doctor visiting an older woman at home"
        className="absolute top-[127px] left-[200px] h-[301px] w-[422px]"
        crop={{ left: "2.53%", top: "0.12%", width: "106.87%", height: "100%" }}
      />
      <div className="absolute top-12 left-12 flex w-[340px] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-h32 font-semibold text-on-dark">{headline}</h1>
          <p className="w-[280px] text-b16 text-on-dark">Nurses, doctors and lab tests at home, booked in a few taps.</p>
        </div>
        <Link href={routes.category("nurse")} className="state self-start rounded-full bg-card px-4 py-2 text-b12 font-semibold text-link">
          Book a visit
        </Link>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <Dots />
      </div>
    </div>
  );
}

function ServiceTile({ tile }: { tile: (typeof serviceTiles)[number] }) {
  const icon = (
    <CropImg
      src="/img/service-icons-3d.png"
      crop={tile.crop}
      className="absolute -right-[7px] -bottom-1 size-16 md:-right-1 md:-bottom-[5px] md:size-[88px]"
    />
  );
  const inner = (
    <>
      {/* Blurred copy + frosted layer + sharp copy = the soft glow behind each 3D icon. */}
      {icon}
      <div className="absolute inset-0 bg-tile backdrop-blur-[19px]" />
      {icon}
      <span className="absolute top-2 left-2 text-b12 font-semibold md:top-4 md:left-4 md:text-b16">{tile.label}</span>
    </>
  );
  const cls = "relative block h-[88px] overflow-hidden rounded-[14.4px] md:h-32";
  if (!tile.href) return <div className={cls}>{inner}</div>;
  if (tile.external)
    return (
      <a href={tile.href} target="_blank" rel="noopener noreferrer" className={`state ${cls}`}>
        {inner}
      </a>
    );
  return (
    <Link href={tile.href} className={`state ${cls}`}>
      {inner}
    </Link>
  );
}

function Stats() {
  return (
    <dl className="flex items-center justify-between md:px-4">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-1 flex-col-reverse items-center gap-1 px-3">
          <dt className="text-center text-b12 text-ink-2">{s.label}</dt>
          <dd className="flex items-center gap-1">
            <img src={s.icon} alt="" className="size-5 md:size-7" />
            <span className="font-display text-b16 font-semibold md:text-h24">{s.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** "Your professionals are from": bordered row with the heading sitting on the top border. */
function Partners() {
  return (
    <div className="relative pt-3">
      <div className="flex items-center justify-between rounded-lg border border-line px-4 py-4 md:px-[120px] md:py-6">
        <PartnerLogos height={32} className="w-full justify-between md:hidden" />
        <PartnerLogos height={52} className="hidden w-full justify-between md:flex" />
      </div>
      <h2 className="absolute top-0 left-1/2 -translate-x-1/2 bg-card px-4 text-center font-display text-b12 whitespace-nowrap text-ink md:-top-0.5 md:text-h20 md:font-semibold md:text-ink-2">
        Your professionals are from
      </h2>
    </div>
  );
}

export function HomeHero() {
  return (
    <div>
      <MobileHero />
      <div className="page flex flex-col gap-10 pt-6 md:gap-16 md:pt-14">
        <div className="flex flex-col-reverse gap-8 rounded-lg bg-tint-2 lg:flex-row">
          <div className="flex flex-1 flex-col gap-6 md:gap-10">
            <div className="flex flex-col gap-6">
              <h2 className="hidden font-display text-h24 font-semibold md:block">What care do you need today?</h2>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {serviceTiles.map((t) => (
                  <ServiceTile key={t.label} tile={t} />
                ))}
              </div>
            </div>
            <Stats />
          </div>
          <DesktopBanner />
        </div>
        <Partners />
      </div>
    </div>
  );
}
