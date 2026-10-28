import Link from "next/link";
import { CropImg } from "@/components/ui/CropImg";
import { routes } from "@/lib/routes";

/** Colour logo (nav, footer). 70×40 crop of the 512² source, as in Figma "image 3". */
export function Logo({ className = "h-10 w-[70px]" }: { className?: string }) {
  return (
    <Link href={routes.home} aria-label="Dr. Morepen Home" className="shrink-0">
      <CropImg
        src="/img/logo.png"
        alt="Dr. Morepen Home"
        className={className}
        crop={{ left: "-10.64%", top: "-51.85%", width: "121.28%", height: "211.11%" }}
      />
    </Link>
  );
}

/** White logo on the blue mobile hero, 61×35 ("image 2"). */
export function LogoWhite() {
  return (
    <Link href={routes.home} aria-label="Dr. Morepen Home" className="shrink-0">
      <img src="/img/logo-white.png" alt="Dr. Morepen Home" className="aspect-[47/27] h-[35px] object-cover object-bottom" />
    </Link>
  );
}
