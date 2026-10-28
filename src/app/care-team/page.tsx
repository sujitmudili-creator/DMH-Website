import type { Metadata } from "next";
import { CareTeamPage } from "@/components/care-team/CareTeamPage";

export const metadata: Metadata = { title: "Talk to our care team · Dr. Morepen Home" };

// W8.02 Talk to our care team · W8.03 Call us · W8.04 Number copied · W8.11 from checkout (?from=/checkout)
export default async function Page({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from } = await searchParams;
  return <CareTeamPage view="options" from={from} />;
}
