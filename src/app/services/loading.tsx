import { PageShell } from "@/components/site/PageShell";
import { ListingSkeleton } from "@/components/services/Skeletons";

// W20.02 / M20.02 Loading · Nurse at home · Skeleton.
export default function Loading() {
  return (
    <PageShell title="">
      <ListingSkeleton />
    </PageShell>
  );
}
