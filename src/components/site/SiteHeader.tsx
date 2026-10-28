import Link from "next/link";
import { routes } from "@/lib/routes";
import { ProfileNavButton } from "@/components/profile/ProfileNavButton";
import { HeaderSearch } from "@/components/search/HeaderSearch";
import { CareTeamTrigger } from "@/components/care-team/CareTeamDialog";
import { LocationLabel } from "./LocationLabel";
import { Logo, LogoWhite } from "./Logo";

/**
 * Site header.
 * Desktop (md+): white nav — logo, location, search field, help, profile (W1.01 "Nav").
 * Mobile: `default` is a white bar; Home uses `hero` (hidden on mobile) plus <MobileHeroHeader /> inside the blue hero.
 */
export function SiteHeader({ variant = "default" }: { variant?: "default" | "hero" }) {
  return (
    <header className={`border-b border-line bg-card ${variant === "hero" ? "hidden md:block" : ""}`}>
      <div className="page flex h-[60px] items-center justify-between gap-4 md:h-[73px]">
        <div className="flex items-center gap-3 md:gap-6">
          <Logo className="h-[35px] w-[61px] md:h-10 md:w-[70px]" />
          <Link
            href={routes.chooseLocation}
            className="state flex h-10 items-center gap-2 rounded-lg border border-field px-3 text-b12 font-semibold md:px-4 md:text-b14 md:font-medium"
          >
            <span className="md:hidden">
              <LocationLabel size="short" />
            </span>
            <span className="hidden md:inline">
              <LocationLabel size="full" />
            </span>
            <img src="/icons/icon-arrow-down.svg" alt="" className="size-4" />
          </Link>
        </div>
        <nav className="flex items-center gap-3" aria-label="Main">
          {/* Live search field + dropdown (W6.02–W6.06). */}
          <div className="hidden md:block">
            <HeaderSearch />
          </div>
          <Link href={routes.search} aria-label="Search" className="state flex size-10 items-center justify-center rounded-full border border-field md:hidden">
            <img src="/icons/icon-search.svg" alt="" className="size-5" />
          </Link>
          {/* Opens the care-team pop up over the current page (W8.02). */}
          <div className="hidden md:block">
            <CareTeamTrigger aria-label="Talk to our care team" className="state flex size-10 items-center justify-center rounded-full border border-field">
              <img src="/icons/icon-headset.svg" alt="" className="size-5" />
            </CareTeamTrigger>
          </div>
          {/* Desktop: opens the profile menu dropdown (W11.01 / W10.01). Mobile: links to /profile. */}
          <ProfileNavButton />
        </nav>
      </div>
    </header>
  );
}

/** Mobile header on the blue home hero (M1.01 "Home header"): white logo, location, menu, search. */
export function MobileHeroHeader() {
  return (
    <div className="flex flex-col gap-4 md:hidden">
      <div className="flex items-center justify-between px-4">
        <LogoWhite />
        <div className="flex items-center gap-2">
          <Link
            href={routes.chooseLocation}
            className="state flex items-center gap-2 rounded-lg border-[0.5px] border-line bg-card/20 px-3 py-2 text-b12 font-semibold text-on-dark"
          >
            <LocationLabel size="short" />
            <img src="/icons/icon-arrow-down-white.svg" alt="" className="size-4" />
          </Link>
          {/* Menu opens the profile menu (M10.01). */}
          <Link href={routes.profile} aria-label="Menu" className="state-dark flex size-8 items-center justify-center rounded-lg">
            <img src="/icons/icon-menu-white.svg" alt="" className="h-[17.33px] w-[22.67px]" />
          </Link>
        </div>
      </div>
      <div className="px-4">
        <Link href={routes.search} className="state flex h-11 items-center gap-3 rounded-lg bg-card px-4 text-b14 text-ink-3">
          <img src="/icons/icon-search-sm.svg" alt="" className="size-[18px]" />
          Search doctors, tests, nursing…
        </Link>
      </div>
    </div>
  );
}
