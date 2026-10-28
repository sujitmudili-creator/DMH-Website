import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { OtpForm } from "@/components/auth/OtpForm";
import { safeNext, withQuery } from "@/components/auth/flow";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Verify code · Dr. Morepen Home" };

type Search = Promise<Record<string, string | string[] | undefined>>;

/** W1.10 Verify code with its states: W4.02 resent, W4.03 wrong, W4.04 expired, W4.05 locked, W20.12 verifying. */
export default async function VerifyPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const phone = typeof sp.phone === "string" ? sp.phone.replace(/\D/g, "").slice(0, 10) : "";
  const next = safeNext(sp.next, routes.home);
  if (phone.length !== 10) redirect(withQuery(routes.login, { next }));
  return (
    <AuthScreen>
      <OtpForm phone={phone} next={next} />
    </AuthScreen>
  );
}
