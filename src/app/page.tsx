import { FamilyVideos, WhatWeBring, WhatWeDontDo } from "@/components/home/HomeCarousels";
import { HomeHero } from "@/components/home/HomeHero";
import { HowWeWork } from "@/components/home/HowWeWork";
import { TalkToUs } from "@/components/home/TalkToUs";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

// W1.01 · Home / M1.01 · Home
export default function HomePage() {
  return (
    <>
      <SiteHeader variant="hero" />
      <main className="flex flex-col gap-10 pb-10 md:gap-20 md:pb-20">
        <HomeHero />
        <HowWeWork />
        <WhatWeBring />
        <WhatWeDontDo />
        <FamilyVideos />
        <TalkToUs />
      </main>
      <SiteFooter />
    </>
  );
}
