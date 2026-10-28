import { CropImg } from "@/components/ui/CropImg";
import { howWeWork } from "@/data/home";

/** Photo panel: faded skyline, ground fade, doctor and nurse (W1.01 "Photo"). */
function Scene({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <CropImg
        src="/img/skyline.png"
        className="absolute top-[-225px] left-[-367px] h-[905px] w-[1307px] opacity-45"
        crop={{ left: "-53.32%", top: "-73.36%", width: "240.11%", height: "173.46%" }}
      />
      <div className="absolute top-[442px] left-0 h-[238px] w-full bg-gradient-to-b from-tint-3/0 via-tint-3 via-75% to-tint-3" />
      <img
        src="/img/doctor-and-nurse.png"
        alt="A doctor and an older patient talking at home"
        className="absolute top-[81px] left-[-161px] h-[626px] w-[894px] max-w-none object-cover"
      />
    </div>
  );
}

export function HowWeWork() {
  return (
    <section className="md:page">
      {/* Mobile: scene on top, card overlapping it. Desktop: two panels in a tinted frame. */}
      <div className="relative bg-gradient-to-b from-tint-3 to-card md:flex md:gap-3 md:rounded-3xl md:bg-tint md:bg-none md:p-3">
        <Scene className="h-[220px] md:hidden [&>img]:top-[-30px] [&>img]:left-1/2 [&>img]:h-[280px] [&>img]:w-[400px] [&>img]:-translate-x-1/2" />
        <div className="relative z-10 mx-4 -mt-3 flex flex-col gap-6 overflow-hidden rounded-2xl bg-card pt-4 pb-6 shadow-[0_8px_24px_rgb(15_15_15/0.06)] md:m-0 md:w-[520px] md:shrink-0 md:gap-9 md:pt-6 md:pb-9 md:shadow-none">
          <div className="flex flex-col gap-4 md:gap-[18px]">
            <h2 className="px-6 text-center font-display text-h20 font-semibold md:text-h24">How we work</h2>
            <div className="h-px bg-line-2" />
          </div>
          <ol className="flex flex-col px-4 md:px-6">
            {howWeWork.map((step, i) => (
              <li key={step.title} className={`flex items-center gap-3 md:gap-[18px] ${i > 0 ? "mt-4 border-t border-line-2 pt-4 md:mt-6 md:pt-6" : ""}`}>
                <CropImg src={step.src} crop={step.crop} className="size-16 shrink-0 rounded-full md:size-24" />
                <div className="flex flex-1 flex-col gap-0.5">
                  <h3 className="font-display text-b14 font-semibold md:text-h20">{step.title}</h3>
                  <p className="text-b12 text-ink-2 md:text-b16">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <Scene className="hidden flex-1 rounded-2xl md:block" />
      </div>
    </section>
  );
}
