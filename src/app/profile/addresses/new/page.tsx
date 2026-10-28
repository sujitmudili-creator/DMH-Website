import type { Metadata } from "next";
import { AddressEditor } from "@/components/profile/AddressEditor";
import { ProfileColumn } from "@/components/profile/ProfileColumn";
import { PageShell } from "@/components/site/PageShell";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Add address · Dr. Morepen Home" };

// W13.06 Myself · W13.07 Other · W13.08 Someone else (and M13.06–M13.08).
export default function AddAddressPage() {
  return (
    <PageShell title="Add address" backHref={routes.addresses}>
      <ProfileColumn title="Add address" backHref={routes.addresses}>
        <AddressEditor />
      </ProfileColumn>
    </PageShell>
  );
}
