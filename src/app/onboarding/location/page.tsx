import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { MapPicker } from "@/components/auth/MapPicker";
import { safeNext } from "@/components/auth/flow";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Set visit location · Dr. Morepen Home" };

type Search = Promise<Record<string, string | string[] | undefined>>;

/**
 * W1.13 / M1.12 Set visit location (W5.03 when `mode=repeat`), with W1.14 searching, W20.17 map loading,
 * W5.05 area not served and W5.06 location access off as UI state.
 * `?mode=onboarding` returns to the address step; `?mode=repeat` saves the location and goes to `next` (home).
 * `?locate=1` asks the browser for the current position on open.
 */
export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const mode = sp.mode === "repeat" ? "repeat" : "onboarding";
  return (
    <AuthScreen>
      <MapPicker
        mode={mode}
        next={safeNext(sp.next, routes.home)}
        locate={sp.locate === "1"}
      />
    </AuthScreen>
  );
}
