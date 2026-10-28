import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { ChooseLocation } from "@/components/auth/ChooseLocation";
import { safeNext } from "@/components/auth/flow";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Choose your location · Dr. Morepen Home" };

type Search = Promise<Record<string, string | string[] | undefined>>;

/** W5.02 / M5.02 Choose location (W20.16 detecting as UI state). `?next=` is where it returns (default: home). */
export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  return (
    <AuthScreen>
      <ChooseLocation next={safeNext(sp.next, routes.home)} />
    </AuthScreen>
  );
}
