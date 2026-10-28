import Link from "next/link";
import type { ReactNode } from "react";
import { CareTeamTrigger } from "@/components/care-team/CareTeamDialog";
import { PageShell } from "@/components/site/PageShell";
import { routes } from "@/lib/routes";

export const errorStates = {
  offline: {
    icon: "/icons/error/cloud-cross-48.svg",
    tint: "bg-muted",
    title: "You're offline",
    body: "Check your internet connection and try again.",
  },
  failed: {
    icon: "/icons/error/danger-48.svg",
    tint: "bg-danger-tint",
    title: "Something went wrong",
    body: "We couldn't load this page. Please try again in a moment.",
  },
  notFound: {
    icon: "/icons/error/search-zoom-out-48.svg",
    tint: "bg-muted",
    title: "Page not found",
    body: "This link may be broken, or the page has moved.",
  },
} as const;

export type ErrorKind = keyof typeof errorStates;

/** Primary action: 208×52 brand button on desktop (240 frame − 16 padding), full-width bottom bar on mobile. */
export const errorActionClass =
  "state-dark flex h-13 w-full cursor-pointer items-center justify-center rounded-lg bg-brand text-b16 font-semibold text-on-dark md:w-[208px]";

/**
 * Full-page error (W15.01 offline · W15.02 something went wrong · W15.03 page not found, and M15.x).
 * Desktop: centred empty state with the action below. Mobile: app bar (back + help), centred state,
 * action pinned in a bottom bar.
 */
export function ErrorState({ kind, action, careLink = false }: { kind: ErrorKind; action: ReactNode; careLink?: boolean }) {
  const s = errorStates[kind];
  const appBar = (
    <div className="sticky top-0 z-20 flex h-16 items-center justify-between bg-card px-4 py-3 md:hidden">
      <Link href={routes.home} aria-label="Back to home" className="state flex size-10 items-center justify-center rounded-full border border-line">
        <img src="/icons/icon-back.svg" alt="" className="size-5" />
      </Link>
      <CareTeamTrigger aria-label="Talk to our care team" className="state flex size-10 items-center justify-center rounded-full border border-line">
        <img src="/icons/icon-headset.svg" alt="" className="size-5" />
      </CareTeamTrigger>
    </div>
  );

  return (
    <PageShell title={s.title} appBar={appBar}>
      <div className="flex min-h-[calc(100dvh-64px-120px)] flex-col items-center justify-center gap-8 px-4 py-10 md:min-h-[calc(100dvh-73px)]">
        <div className="flex w-full max-w-[420px] flex-col items-center gap-6">
          <span className={`flex size-24 items-center justify-center rounded-full ${s.tint}`}>
            <img src={s.icon} alt="" className="size-12" />
          </span>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="font-display text-h24 font-semibold">{s.title}</h1>
            <p className="text-b14 text-ink-2">{s.body}</p>
          </div>
          {careLink && (
            <CareTeamTrigger className="state rounded-sm text-b14 font-semibold text-link">Talk to our care team</CareTeamTrigger>
          )}
        </div>
        <div className="fixed inset-x-0 bottom-0 z-10 bg-card px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom))] shadow-bar md:static md:bg-transparent md:p-0 md:shadow-none">
          {action}
        </div>
      </div>
    </PageShell>
  );
}
