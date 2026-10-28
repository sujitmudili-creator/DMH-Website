import type { Metadata } from "next";
import { AddressEditor } from "@/components/profile/AddressEditor";
import { ProfileColumn } from "@/components/profile/ProfileColumn";
import { PageShell } from "@/components/site/PageShell";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Edit address · Dr. Morepen Home" };

// W13.04 / M13.04 Edit address.
export default async function EditAddressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PageShell title="Edit address" backHref={routes.addresses}>
      <ProfileColumn title="Edit address" backHref={routes.addresses}>
        <AddressEditor id={id} />
      </ProfileColumn>
    </PageShell>
  );
}
