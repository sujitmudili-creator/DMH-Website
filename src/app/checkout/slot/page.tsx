import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = { title: "Pick a slot · Dr. Morepen Home" };

/** W1.16 Pick a slot / W1.17 Pick a date: a pop up over checkout (bottom sheet on mobile). */
export default function CheckoutSlotPage() {
  return <CheckoutView initial="slot" />;
}
