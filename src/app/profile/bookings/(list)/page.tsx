import type { Metadata } from "next";
import { BookingsView } from "@/components/profile/BookingsView";
import { ProfileColumn } from "@/components/profile/ProfileColumn";
import { AppBarIconLink } from "@/components/site/MobileAppBar";
import { PageShell } from "@/components/site/PageShell";
import type { BookingStatus } from "@/data/bookings";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "My bookings · Dr. Morepen Home" };

const TABS: BookingStatus[] = ["upcoming", "past", "cancelled"];

// W12.02–W12.09 / M12.02–M12.09 My bookings. ?tab=past|cancelled opens a tab; ?empty=1 shows the empty state (W12.09).
export default async function BookingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const tab = TABS.find((t) => t === sp.tab) ?? "upcoming";
  return (
    <PageShell
      title="My bookings"
      backHref={routes.profile}
      appBarActions={<AppBarIconLink href={routes.careTeam} icon="/icons/icon-headset.svg" label="Talk to our care team" />}
    >
      <ProfileColumn title="My bookings" backHref={routes.profile}>
        <BookingsView key={tab} initialTab={tab} empty={sp.empty === "1"} />
      </ProfileColumn>
    </PageShell>
  );
}
