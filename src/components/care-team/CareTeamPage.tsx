import HomePage from "@/app/page";
import { routes } from "@/lib/routes";
import { CareTeamRouteDialog } from "./CareTeamDialog";
import type { CareView } from "./CareTeamFlow";

/**
 * Page for the care-team routes. In Figma these pop ups sit over Home ("Behind (blurred)"), so Home renders
 * behind the dialog. `?from=/checkout` (any internal path) makes close return there instead of Home (W8.11).
 */
export function CareTeamPage({ view, from }: { view: CareView; from?: string | string[] }) {
  const back = typeof from === "string" && from.startsWith("/") && !from.startsWith("//") ? from : routes.home;
  return (
    <>
      <div aria-hidden>
        <HomePage />
      </div>
      <CareTeamRouteDialog initialView={view} closeHref={back} />
    </>
  );
}
