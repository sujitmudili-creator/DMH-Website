"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { getCategory, popularSearches, rupees, searchCatalogue, servicesIn } from "@/data/services";
import { routes } from "@/lib/routes";
import { rememberSearch, resultsHref, useRecentSearches } from "./searchState";

/** Bold the typed part of a name ("Wou|nd dressing"). */
function Highlight({ text, query }: { text: string; query: string }) {
  const i = text.toLowerCase().indexOf(query.trim().toLowerCase());
  if (!query.trim() || i < 0) return <>{text}</>;
  const end = i + query.trim().length;
  return (
    <>
      {text.slice(0, i)}
      <strong className="font-semibold">{text.slice(i, end)}</strong>
      {text.slice(end)}
    </>
  );
}

function Row({ href, image, title, note, onPick }: { href: string; image: string; title: ReactNode; note: string; onPick?: () => void }) {
  return (
    <li>
      <Link href={href} onClick={onPick} className="state -mx-2 flex items-center gap-3 rounded-lg px-2 py-1">
        <img src={image} alt="" className="size-12 shrink-0 rounded-lg bg-muted object-cover" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
          <span className="truncate text-b16">{title}</span>
          <span className="truncate text-b12 text-ink-2">{note}</span>
        </span>
      </Link>
    </li>
  );
}

const H = ({ children }: { children: ReactNode }) => <h2 className="font-display text-b16 font-semibold">{children}</h2>;

/** Empty state for a search with no matches (W6.06 / M6.06). */
export function NoResults({ query, variant }: { query: string; variant: "dropdown" | "page" }) {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-12 text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-muted">
        <img src="/icons/services/search-status-40.svg" alt="" className="size-10" />
      </span>
      <div className="flex flex-col gap-2">
        <p className="font-display text-h20 font-semibold md:text-h24">No results for “{query.trim()}”</p>
        <p className="text-b14 text-ink-2">Check the spelling or try another service.</p>
      </div>
      {variant === "dropdown" ? (
        <Link href={routes.careTeam} className="state rounded-lg text-b14 font-semibold text-link">
          Talk to our care team ›
        </Link>
      ) : (
        <Link href={routes.careTeam} className="state flex h-[52px] w-60 items-center justify-center rounded-lg border border-line text-b16 font-semibold">
          Talk to our care team
        </Link>
      )}
    </div>
  );
}

/**
 * What shows under the search field: recent + popular before typing (W6.02 / M6.02), live matches while
 * typing (W6.03 / M6.03), or the empty state (W6.06 / M6.06).
 */
export function SearchSuggestions({ query, variant, onPick }: { query: string; variant: "dropdown" | "page"; onPick?: () => void }) {
  const recent = useRecentSearches();
  const q = query.trim();

  if (!q) {
    return (
      <div className={`flex flex-col gap-6 ${variant === "dropdown" ? "p-4" : ""}`}>
        <section className="flex flex-col gap-3">
          <H>Recent searches</H>
          <ul className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <li key={r}>
                <Link
                  href={resultsHref(r)}
                  onClick={() => {
                    rememberSearch(r);
                    onPick?.();
                  }}
                  className={`state flex items-center rounded-full bg-muted px-4 font-medium ${variant === "dropdown" ? "h-9 text-b12" : "h-10 text-b14 md:h-9 md:text-b12"}`}
                >
                  {r}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="flex flex-col gap-4">
          <H>Popular services</H>
          <ul className="flex flex-col gap-4">
            {popularSearches.map((p) => (
              <Row key={p.label} href={p.href} image={p.image} title={<span className="font-medium">{p.label}</span>} note={p.note} onPick={onPick} />
            ))}
          </ul>
        </section>
      </div>
    );
  }

  const { services, categories } = searchCatalogue(q);
  if (!services.length && !categories.length) return <NoResults query={q} variant={variant} />;

  return (
    <div className={`flex flex-col gap-6 ${variant === "dropdown" ? "p-5" : "gap-10"}`}>
      {services.length > 0 && (
        <section className="flex flex-col gap-4">
          <H>Services</H>
          <ul className="flex flex-col gap-4">
            {services.slice(0, 5).map((s) => (
              <Row
                key={s.slug}
                href={routes.service(s.category, s.slug)}
                image={s.image}
                title={<Highlight text={s.name} query={q} />}
                note={`${getCategory(s.category)?.name} · ${s.searchNote ?? `${rupees(s.price)} · ${s.rating} ★`}`}
                onPick={() => {
                  rememberSearch(q);
                  onPick?.();
                }}
              />
            ))}
          </ul>
        </section>
      )}
      {categories.length > 0 && (
        <section className="flex flex-col gap-4">
          <H>Categories</H>
          <ul className="flex flex-col gap-4">
            {categories.map((c) => (
              <Row
                key={c.slug}
                href={routes.category(c.slug)}
                image={c.image}
                title={<span className="font-medium">{c.name}</span>}
                note={`${servicesIn(c.slug).length} services`}
                onPick={onPick}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
