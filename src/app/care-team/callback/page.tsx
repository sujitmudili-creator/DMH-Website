import type { Metadata } from "next";
import { CareTeamPage } from "@/components/care-team/CareTeamPage";

export const metadata: Metadata = { title: "Request a callback · Dr. Morepen Home" };

// W8.05 Request a callback · W8.06 Typing time · W8.07 Outside hours · W8.09 Callback failed (?error=1 to preview)
export default async function Page({ searchParams }: { searchParams: Promise<{ from?: string; error?: string }> }) {
  const { from, error } = await searchParams;
  return <CareTeamPage view={error ? "failed" : "callback"} from={from} />;
}
