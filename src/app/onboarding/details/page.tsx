import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { DetailsForm } from "@/components/auth/DetailsForm";
import { safeNext } from "@/components/auth/flow";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Your details · Dr. Morepen Home" };

type Search = Promise<Record<string, string | string[] | undefined>>;

/** W1.11 / M1.10 Your details (step 1). `?next=` is where the flow ends (default: home). */
export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  return (
    <AuthScreen>
      <DetailsForm next={safeNext(sp.next, routes.home)} />
    </AuthScreen>
  );
}
