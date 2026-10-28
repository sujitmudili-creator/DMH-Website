import type { Metadata } from "next";
import { AddressesView } from "@/components/profile/AddressesView";
import { ProfileColumn } from "@/components/profile/ProfileColumn";
import { AppBarIconLink } from "@/components/site/MobileAppBar";
import { PageShell } from "@/components/site/PageShell";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Saved addresses · Dr. Morepen Home" };

// W13.02 / M13.02 Saved addresses · W13.03 options · W13.05 delete confirm.
export default function SavedAddressesPage() {
  return (
    <PageShell
      title="Saved addresses"
      backHref={routes.profile}
      appBarActions={<AppBarIconLink href={routes.careTeam} icon="/icons/icon-headset.svg" label="Talk to our care team" />}
    >
      <ProfileColumn title="Saved addresses" backHref={routes.profile}>
        <AddressesView />
      </ProfileColumn>
    </PageShell>
  );
}
