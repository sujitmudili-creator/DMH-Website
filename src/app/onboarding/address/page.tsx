import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { AddressForm } from "@/components/auth/AddressForm";
import { safeNext } from "@/components/auth/flow";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Address · Dr. Morepen Home" };

type Search = Promise<Record<string, string | string[] | undefined>>;

/** W1.12 / M1.11 Your details · Address (step 2). `?next=` is where the flow ends (default: home). */
export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  return (
    <AuthScreen>
      <AddressForm next={safeNext(sp.next, routes.home)} />
    </AuthScreen>
  );
}
