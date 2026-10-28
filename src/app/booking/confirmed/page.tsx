import type { Metadata } from "next";
import { ConfirmedView } from "@/components/checkout/ConfirmedView";

export const metadata: Metadata = { title: "Booking confirmed · Dr. Morepen Home" };

/** W1.19 / M1.18 Booking confirmed. */
export default function BookingConfirmedPage() {
  return <ConfirmedView />;
}
