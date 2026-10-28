import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";

/**
 * Page frame for the log in / onboarding / location screens. In Figma these are pop ups over a blurred
 * page ("Behind (blurred)" + "Scrim"); as routes they render a quiet stand-in page behind the dialog so a
 * direct visit looks the same. The dialog itself (AuthDialog) is fixed on top.
 */
export function AuthScreen({ children }: { children: ReactNode }) {
  return (
    <>
      <div aria-hidden inert className="pointer-events-none select-none">
        <div className="hidden md:block">
          <SiteHeader />
        </div>
        <div className="page-narrow flex flex-col gap-6 py-8">
          <div className="h-10 w-48 rounded-lg bg-muted" />
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            <div className="flex flex-col gap-4">
              <div className="h-60 rounded-xl border border-line" />
              <div className="h-72 rounded-xl border border-line" />
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-40 rounded-xl border border-line" />
              <div className="h-52 rounded-xl border border-line" />
              <div className="h-12 rounded-lg bg-brand/80" />
            </div>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
