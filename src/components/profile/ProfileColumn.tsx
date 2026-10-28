import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Profile pages (W11–W14) on desktop: a 640 column centred under the nav (40 top), with a back button + Web/Heading 24
 * header. On mobile the PageShell app bar carries back + title, so the header is hidden and the column is full width.
 */
export function ProfileColumn({
  title,
  backHref,
  actions,
  children,
  className = "",
}: {
  title: string;
  backHref: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto flex w-full max-w-[672px] flex-col gap-8 px-4 pb-10 pt-6 md:pb-20 md:pt-10 ${className}`}>
      <div className="hidden md:block">
        <div className="flex items-center gap-4">
          <Link href={backHref} aria-label="Back" className="state flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-card">
            <img src="/icons/icon-back.svg" alt="" className="size-5" />
          </Link>
          <h1 className="min-w-0 flex-1 font-display text-h24 font-semibold">{title}</h1>
          {actions}
        </div>
      </div>
      {children}
    </div>
  );
}
