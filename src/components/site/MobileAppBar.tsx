import Link from "next/link";
import type { ReactNode } from "react";
import { routes } from "@/lib/routes";

/** Round 40px icon link used in the app bar (border/card hairline). */
export function AppBarIconLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link href={href} aria-label={label} className="state flex size-10 shrink-0 items-center justify-center rounded-full border border-line">
      <img src={icon} alt="" className="size-5" />
    </Link>
  );
}

/**
 * Mobile app bar for inner pages (M1.03 "App bar"): back, title, optional actions. Hidden from md up,
 * where the desktop SiteHeader takes over.
 */
export function MobileAppBar({
  title,
  backHref = routes.home,
  actions,
  className = "",
}: {
  title: string;
  backHref?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`sticky top-0 z-20 flex h-16 items-center gap-2 bg-card px-4 py-3 md:hidden ${className}`}>
      <AppBarIconLink href={backHref} icon="/icons/icon-back.svg" label="Back" />
      <h1 className="min-w-0 flex-1 truncate font-display text-h20 font-semibold">{title}</h1>
      {actions}
    </div>
  );
}
