import type { Metadata } from "next";
import { CareTeamPage } from "@/components/care-team/CareTeamPage";

export const metadata: Metadata = { title: "Callback requested · Dr. Morepen Home" };

// W8.08 Callback requested
export default async function Page({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from } = await searchParams;
  return <CareTeamPage view="requested" from={from} />;
}
