import type { Metadata } from "next";
import { SearchScreen } from "@/components/search/SearchScreen";
import { PageShell } from "@/components/site/PageShell";

export const metadata: Metadata = { title: "Search · Dr. Morepen Home" };

// W6.04 Results (desktop; the W6.02/W6.03/W6.06 dropdown lives in the nav) · M6.02–M6.06 (full page on mobile).
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const raw = (await searchParams).q;
  const query = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
  return (
    <PageShell title="Search" appBar={null}>
      {/* key: a new query resets the field state. */}
      <SearchScreen key={query} query={query} />
    </PageShell>
  );
}
