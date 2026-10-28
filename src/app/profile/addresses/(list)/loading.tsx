import { ProfileColumn } from "@/components/profile/ProfileColumn";
import { AddressesSkeleton } from "@/components/profile/ProfileSkeletons";
import { PageShell } from "@/components/site/PageShell";
import { routes } from "@/lib/routes";

// W20.09 / M20.09 Loading · Saved addresses · Skeleton.
export default function Loading() {
  return (
    <PageShell title="Saved addresses" backHref={routes.profile}>
      <ProfileColumn title="Saved addresses" backHref={routes.profile}>
        <AddressesSkeleton />
      </ProfileColumn>
    </PageShell>
  );
}
