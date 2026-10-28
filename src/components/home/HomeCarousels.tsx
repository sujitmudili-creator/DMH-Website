import { Carousel } from "@/components/ui/Carousel";
import { kit, notCovered, videos } from "@/data/home";

function PhotoCard({ src, label, className, shade }: { src: string; label: string; className: string; shade: "navy" | "grey" }) {
  const overlay =
    shade === "navy"
      ? "bg-gradient-to-b from-[rgb(10_23_51/0)] from-45% to-[rgb(10_23_51/0.75)]"
      : "bg-[linear-gradient(180deg,rgb(0_0_0/0)_45%,rgb(0_0_0/0.75)_100%),linear-gradient(rgb(0_0_0/0.2),rgb(0_0_0/0.2))]";
  return (
    <figure className={`relative flex shrink-0 items-end justify-center overflow-hidden rounded-xl px-4 pb-4 ${className}`}>
      <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
      <div className={`absolute inset-0 ${overlay}`} />
      <figcaption className="relative text-center font-display text-b14 font-semibold text-on-dark md:text-h18">{label}</figcaption>
    </figure>
  );
}

export function WhatWeBring() {
  return (
    <Carousel title="What we bring with us">
      {kit.map((k) => (
        <PhotoCard key={k.label} {...k} shade="navy" className="h-[255px] w-[206px] md:h-[332px] md:w-[279px]" />
      ))}
    </Carousel>
  );
}

export function WhatWeDontDo() {
  return (
    <Carousel title="What we don’t do">
      {notCovered.map((k) => (
        <PhotoCard key={k.label} {...k} shade="grey" className="h-[100px] w-[113px] md:h-[220px] md:w-[233px] [&_figcaption]:font-medium" />
      ))}
    </Carousel>
  );
}

export function FamilyVideos() {
  return (
    <Carousel title="Care that speaks for itself">
      {videos.map((v) => (
        <figure key={v.poster} className="relative h-[184px] w-[124px] shrink-0 overflow-hidden rounded-xl md:h-[360px] md:w-[252px]">
          <img src={v.poster} alt={v.title} className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
          <span className="absolute top-1/2 left-1/2 flex size-[38px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-card">
            <img src="/icons/icon-play.svg" alt="" className="size-[17px]" />
          </span>
        </figure>
      ))}
    </Carousel>
  );
}
