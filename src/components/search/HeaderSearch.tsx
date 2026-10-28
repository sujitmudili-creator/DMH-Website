"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { rememberSearch, resultsHref } from "./searchState";
import { SearchSuggestions } from "./SearchSuggestions";

/**
 * Desktop nav search field with its dropdown (W6.02 recent + popular, W6.03 typing, W6.06 no results).
 * Enter opens the results page (W6.04). The page behind is dimmed and blurred while it is open.
 */
export function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [scrimTop, setScrimTop] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);

  // Close on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const header = wrap.current?.closest("header");
    setScrimTop(Math.max(0, header?.getBoundingClientRect().bottom ?? 0));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = () => {
    const q = query.trim();
    if (!q) return;
    rememberSearch(q);
    setOpen(false);
    router.push(resultsHref(q));
  };

  return (
    <>
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-x-0 bottom-0 z-30 bg-ink/40 backdrop-blur-sm"
          style={{ top: scrimTop }}
        />
      )}
      <div ref={wrap} className="relative z-40 w-[240px] lg:w-[320px]">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className={`flex h-10 items-center gap-2 rounded-lg border bg-card px-4 ${open ? "border-[1.5px] border-field-selected" : "border-field"}`}
        >
          <img src="/icons/icon-search.svg" alt="" className="size-5" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search doctors, tests, nursing…"
            aria-label="Search doctors, tests, nursing"
            className="h-full min-w-0 flex-1 bg-transparent text-b14 text-ink outline-none placeholder:text-ink-3 [&::-webkit-search-cancel-button]:hidden"
          />
        </form>
        {open && (
          <div
            id="header-search-panel"
            className="absolute top-12 right-0 left-0 max-h-[calc(100dvh-96px)] overflow-y-auto rounded-2xl border border-line bg-card shadow-floating"
          >
            <SearchSuggestions query={query} variant="dropdown" onPick={() => setOpen(false)} />
          </div>
        )}
      </div>
    </>
  );
}
