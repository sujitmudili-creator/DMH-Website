import { ProfileColumn } from "@/components/profile/ProfileColumn";
import { BookingsSkeleton } from "@/components/profile/ProfileSkeletons";
import { PageShell } from "@/components/site/PageShell";
import { routes } from "@/lib/routes";

// W20.06 / M20.06 Loading · My bookings · Skeleton.
export default function Loading() {
  return (
    <PageShell title="My bookings" backHref={routes.profile}>
      <ProfileColumn title="My bookings" backHref={routes.profile}>
        <BookingsSkeleton />
      </ProfileColumn>
    </PageShell>
  );
}
