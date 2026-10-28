"use client";

import { useVisitLocation } from "@/lib/location";

/** Visit location shown in the headers; updates when the user picks a new one (W5.02 / W1.13). */
export function LocationLabel({ size }: { size: "short" | "full" }) {
  const { location } = useVisitLocation();
  return <>{location[size]}</>;
}
