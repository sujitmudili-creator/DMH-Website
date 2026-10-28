"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SlowNetworkToast } from "@/components/ui/NetworkToasts";

/**
 * The root `loading.tsx` also covers every route without its own skeleton. Show the Home skeleton
 * only on "/"; elsewhere keep the current screen blank (no misleading Home layout) with the slow-network toast.
 */
export function RouteLoading({ home }: { home: ReactNode }) {
  const path = usePathname();
  if (path === "/") return home;
  return (
    <div role="status" aria-busy="true" className="min-h-dvh">
      <span className="sr-only">Loading</span>
      <SlowNetworkToast />
    </div>
  );
}
