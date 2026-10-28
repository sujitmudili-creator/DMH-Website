import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = { title: "Coupons · Dr. Morepen Home" };

/** W3.02 Coupons: a pop up over checkout on desktop, a full page on mobile (M3.02). */
export default function CheckoutCouponsPage() {
  return <CheckoutView initial="coupons" />;
}
