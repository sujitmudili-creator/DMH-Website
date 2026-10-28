import { HomeSkeleton } from "@/components/loading/HomeSkeleton";
import { RouteLoading } from "@/components/loading/RouteLoading";

/** W20.01 / M20.01 Home skeleton (+ W20.19 slow network toast). */
export default function Loading() {
  return <RouteLoading home={<HomeSkeleton />} />;
}
