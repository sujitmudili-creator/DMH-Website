import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = { title: "Checkout · Dr. Morepen Home" };

/** W1.08 / M1.07 and every checkout state (see CheckoutView). */
export default function CheckoutPage() {
  return <CheckoutView />;
}
