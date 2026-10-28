import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { PhoneForm } from "@/components/auth/PhoneForm";
import { safeNext } from "@/components/auth/flow";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Log in · Dr. Morepen Home" };

type Search = Promise<Record<string, string | string[] | undefined>>;

/** W1.09 / M1.08 Log in · Phone number. `?next=` is where the flow returns (default: home). */
export default async function LoginPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const phone = typeof sp.phone === "string" ? sp.phone : "";
  return (
    <AuthScreen>
      <PhoneForm next={safeNext(sp.next, routes.home)} initialPhone={phone} />
    </AuthScreen>
  );
}
