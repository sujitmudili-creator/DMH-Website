"use client";

import { useEffect, useState, type ReactNode } from "react";

const KEY = "dmh-services-view";

/**
 * "6 services" + grid/list toggle (W1.02 ↔ W1.03). Sets `data-view` on a `group/listing` wrapper; cards and
 * grids restyle from it (desktop only). The choice is remembered per browser. Mobile always shows the grid.
 */
export function ServiceListing({ count, children }: { count: number; children: ReactNode }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    try {
      // Restore after hydration; storage may be blocked.
      if (window.localStorage.getItem(KEY) === "list") setView("list");
    } catch {
      /* ignore */
    }
  }, []);

  const choose = (v: "grid" | "list") => {
    setView(v);
    try {
      window.localStorage.setItem(KEY, v);
    } catch {
      /* ignore */
    }
  };

  const btn = (v: "grid" | "list") =>
    `state flex h-8 w-9 cursor-pointer items-center justify-center rounded-md ${view === v ? "bg-tint" : ""}`;
  const bar = (v: "grid" | "list") => (view === v ? "bg-brand" : "bg-ink-2");

  return (
    <div id="services" className="flex scroll-mt-6 flex-col gap-8">
      <div className="hidden items-center justify-between md:flex">
        <p className="text-b14 text-ink-2">
          {count} {count === 1 ? "service" : "services"}
        </p>
        <div role="group" aria-label="Layout" className="flex gap-1 rounded-[10px] border border-line bg-card p-1">
          <button type="button" aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => choose("grid")} className={btn("grid")}>
            <span className="grid size-[18px] grid-cols-2 gap-0.5" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`size-2 rounded-[2px] ${bar("grid")}`} />
              ))}
            </span>
          </button>
          <button type="button" aria-label="List view" aria-pressed={view === "list"} onClick={() => choose("list")} className={btn("list")}>
            <span className="flex h-[18px] w-[18px] flex-col justify-between py-0.5" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className={`h-0.5 w-full rounded-[1px] ${bar("list")}`} />
              ))}
            </span>
          </button>
        </div>
      </div>
      <div data-view={view} className="group/listing">
        {children}
      </div>
    </div>
  );
}
