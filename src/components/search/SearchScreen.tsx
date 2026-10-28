"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ServiceCard } from "@/components/services/ServiceCard";
import { searchResults } from "@/data/services";
import { routes } from "@/lib/routes";
import { rememberSearch, resultsHref } from "./searchState";
import { NoResults, SearchSuggestions } from "./SearchSuggestions";

function Results({ query }: { query: string }) {
  const res = searchResults(query);
  if (!res) return <NoResults query={query} variant="page" />;
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-display text-h20 font-semibold">Best match</h2>
          <p className="text-b14 text-ink-2 md:hidden">
            Results for <strong className="font-semibold text-ink">&quot;{query}&quot;</strong>
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:items-start">
          <ServiceCard service={res.best} />
        </div>
      </section>
      {res.related.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-h20 font-semibold">Related services</h2>
          <div className="grid gap-4 md:grid-cols-2 md:items-start">
            {res.related.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Search page. Mobile: field at the top with suggestions (M6.02/M6.03), results (M6.04) or no results (M6.06).
 * Desktop: results page (W6.04); typing happens in the nav field (HeaderSearch).
 */
export function SearchScreen({ query }: { query: string }) {
  const router = useRouter();
  const [text, setText] = useState(query);
  const [editing, setEditing] = useState(!query);
  const showResults = !!query && !editing;

  const submit = () => {
    const q = text.trim();
    if (!q) return;
    rememberSearch(q);
    setEditing(false);
    router.push(resultsHref(q));
  };

  const back = () => {
    if (window.history.length > 1) router.back();
    else router.push(routes.home);
  };

  const roundBtn = "state flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-card";

  return (
    <div className="page-narrow flex flex-col gap-6 pt-3 pb-16 md:pt-8">
      {/* Field (mobile always; desktop only before a search). */}
      <div className={`flex items-center gap-3 ${query ? "md:hidden" : ""}`}>
        <button type="button" onClick={back} aria-label="Back" className={roundBtn}>
          <img src="/icons/icon-back.svg" alt="" className="size-5" />
        </button>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className={`flex h-12 min-w-0 flex-1 items-center gap-3 rounded-lg bg-card px-4 ${
            editing ? "border-[1.5px] border-field-selected" : "border border-field"
          }`}
        >
          <img src="/icons/icon-search.svg" alt="" className="size-5" />
          <input
            type="search"
            value={text}
            autoFocus={!query}
            onFocus={() => setEditing(true)}
            onChange={(e) => {
              setText(e.target.value);
              setEditing(true);
            }}
            placeholder="Search for a service"
            aria-label="Search for a service"
            className="h-full min-w-0 flex-1 bg-transparent text-b16 text-ink caret-brand outline-none placeholder:text-ink-3 [&::-webkit-search-cancel-button]:hidden"
          />
          {text && (
            <button
              type="button"
              onClick={() => {
                setText("");
                setEditing(true);
              }}
              aria-label="Clear search"
              className="state flex size-[22px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-muted"
            >
              <img src="/icons/auth/close-grey-14.svg" alt="" className="size-3.5 rotate-45" />
            </button>
          )}
        </form>
      </div>

      {/* Desktop heading (W6.04). */}
      {showResults && (
        <div className="hidden items-center gap-3 md:flex">
          <Link href={routes.home} aria-label="Back to home" className={roundBtn}>
            <img src="/icons/icon-back.svg" alt="" className="size-5" />
          </Link>
          <h1 className="font-display text-h24 font-semibold">Results for “{query}”</h1>
        </div>
      )}

      {showResults ? <Results query={query} /> : <SearchSuggestions query={text} variant="page" />}
    </div>
  );
}
