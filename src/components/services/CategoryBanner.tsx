import { CropImg } from "@/components/ui/CropImg";

// Promo banner at the top of a category (W1.02 "Banner" 776×260, M1.03 177 high).

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

const cta = (
  <a href="#services" className="state self-start rounded-full bg-card px-4 py-2 text-b12 font-semibold text-link">
    Book a visit
  </a>
);

export function CategoryBanner() {
  return (
    <>
      {/* Desktop */}
      <div className="relative hidden h-[260px] overflow-hidden rounded-2xl md:block" style={{ backgroundImage: "var(--gradient-hero)" }}>
        <img src="/icons/decor-ring-480.svg" alt="" className="absolute top-[-70px] left-[329.5px] size-[480px] max-w-none" />
        <img src="/icons/decor-ring-352.svg" alt="" className="absolute top-[-6px] left-[393.5px] size-[352px] max-w-none" />
        <CropImg
          src="/img/hero-photo.png"
          alt="A doctor visiting an older man at home"
          className="absolute top-0 left-[387px] h-[260px] w-[365px]"
          crop={{ left: "2.53%", top: "0.12%", width: "106.87%", height: "100%" }}
        />
        <div className="absolute top-4 left-10 flex w-[340px] flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h32 font-semibold text-on-dark">{headline}</h2>
            <p className="w-[280px] text-b16 text-on-dark">Nurses, doctors and lab tests at home, booked in a few taps.</p>
          </div>
          {cta}
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Dots />
        </div>
      </div>
      {/* Mobile */}
      <div className="relative mx-4 h-[177px] overflow-hidden rounded-2xl md:hidden" style={{ backgroundImage: "var(--gradient-hero)" }}>
        <img src="/icons/decor-ring-300.svg" alt="" className="absolute top-[25px] left-[calc(100%-246px)] size-[300px] max-w-none" />
        <img src="/icons/decor-ring-220.svg" alt="" className="absolute top-[65px] left-[calc(100%-206px)] size-[220px] max-w-none" />
        <CropImg
          src="/img/hero-photo.png"
          alt="A doctor visiting an older man at home"
          className="absolute -top-2 right-0 size-[239px]"
          crop={{ left: "0.14%", top: "5.41%", width: "134.16%", height: "89.44%" }}
        />
        <div className="absolute top-6 left-4 flex w-[211px] flex-col gap-2">
          <h2 className="font-display text-h20 font-semibold text-on-dark">{headline}</h2>
          {cta}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <Dots />
        </div>
      </div>
    </>
  );
}
