import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { CropImg } from "@/components/ui/CropImg";
import { careTeamAvatars, faqs } from "@/data/home";
import { routes } from "@/lib/routes";

/** "Not sure what you need?" (W1.01 "Talk to us"). Mobile keeps the heading, a text link and the illustration. */
export function TalkToUs() {
  return (
    <section className="page">
      <div className="flex items-center justify-between gap-4 md:h-[370px] md:rounded-2xl md:bg-tint md:p-12">
        <div className="flex flex-col gap-3 md:w-[724px] md:gap-6">
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex">
              {careTeamAvatars.map((a, i) => (
                <CropImg key={a.src} src={a.src} crop={a.crop} className={`size-10 rounded-full border-2 border-card ${i > 0 ? "-ml-3" : ""}`} />
              ))}
            </div>
            <p className="text-b14 font-medium text-ink-2">Our care team is here to help</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="w-[180px] font-display text-h20 font-semibold md:w-auto md:text-d40 md:font-medium">Not sure what you need?</h2>
            <p className="hidden text-b16 text-ink-2 md:block">Ask us anything. Here are a few things families often ask.</p>
          </div>
          <div className="hidden flex-wrap gap-3 md:flex lg:flex-nowrap">
            {faqs.map((q) => (
              <ButtonLink key={q} href={routes.careTeam} variant="chip">
                {q}
                <img src="/icons/icon-arrow-right-sm.svg" alt="" className="size-4" />
              </ButtonLink>
            ))}
          </div>
          <div className="hidden md:block">
            <ButtonLink href={routes.careTeam} className="w-[200px]">
              Talk to our care team
            </ButtonLink>
          </div>
          <Link href={routes.careTeam} className="text-b14 font-semibold text-link md:hidden">
            Talk to our care team ›
          </Link>
        </div>
        <img src="/icons/talk-illustration.svg" alt="" className="w-[170px] shrink-0 md:w-[289px]" />
      </div>
    </section>
  );
}
