import type { Metadata } from "next";
import { CareTeamPage } from "@/components/care-team/CareTeamPage";

export const metadata: Metadata = { title: "Book a lab test · Dr. Morepen Home" };

// W9.02 Lab test · Form → W9.03 Lab test · Request a callback
export default async function Page({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from } = await searchParams;
  return <CareTeamPage view="lab" from={from} />;
}
