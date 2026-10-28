import { PageShell } from "@/components/site/PageShell";
import { SearchSkeleton } from "@/components/services/Skeletons";

// W20.04 / M20.04 Loading · Search · Results · Skeleton.
export default function Loading() {
  return (
    <PageShell title="Search" appBar={null}>
      <SearchSkeleton />
    </PageShell>
  );
}
