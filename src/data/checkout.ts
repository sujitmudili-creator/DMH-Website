import type { Crop } from "@/components/ui/CropImg";
import type { CartItem } from "@/lib/cart";
import { routes } from "@/lib/routes";

// Placeholder content for checkout, slot picking, coupons and booking confirmed (W1.08–W3.09, M1.07–M3.11).
// Replace with the pricing, slots, coupons and booking APIs; components only read from here.

/** Flat tax line on every booking (Figma shows ₹49). */
export const TAXES = 49;

/** Late cancellation fee and how long before the visit it starts. */
export const cancellation = { fee: 500, freeUntilMinutesBefore: 30 };

/**
 * Catalogue facts the cart does not carry: list price (MRP, struck through) and the thumbnail.
 * Keyed by service slug or add-on id. Unknown ids fall back to `fallbackService`.
 */
export const serviceInfo: Record<string, { mrp: number; image: string }> = {
  "wound-dressing": { mrp: 1199, image: "/img/step-home.jpg" },
  "tetanus-injection": { mrp: 999, image: "/img/services/injections.jpg" },
  "blood-sugar-test": { mrp: 399, image: "/img/step-home.jpg" },
  "vitals-check": { mrp: 399, image: "/img/services/chronic-care.jpg" },
};
export const fallbackService = { image: "/img/step-home.jpg" };

/** "You might also need" cards. Adding one puts it on the first service as an add-on. */
export const upsells: {
  id: string;
  name: string;
  rating: string;
  price: number;
  mrp: number;
  image: string;
  href: string;
}[] = [
  {
    id: "blood-sugar-test",
    name: "Blood sugar test",
    rating: "4.8 (2.4K)",
    price: 199,
    mrp: 399,
    image: "/img/step-home.jpg",
    href: routes.labTest,
  },
  {
    id: "vitals-check",
    name: "Vitals check at home",
    rating: "4.7 (860)",
    price: 249,
    mrp: 399,
    image: "/img/services/chronic-care.jpg",
    href: routes.category("nurse"),
  },
];

/** Cart used by `?demo=` links and screenshots (W1.05 → W1.08: wound dressing + tetanus add-on). */
export const demoCart: CartItem[] = [
  {
    category: "nurse",
    slug: "wound-dressing",
    name: "Wound dressing & care",
    price: 899,
    addOns: [{ id: "tetanus-injection", name: "Tetanus injection at home", price: 799 }],
  },
];

/** Address used when the signed-in user has none saved yet. */
export const defaultAddress = { label: "Home", line: "B 42, Sector 15, Noida" };

export type Coupon = {
  code: string;
  amount: number; // ₹ off
  title: string; // "Flat ₹150 OFF"
  terms: string[];
  /** Extra terms behind "Read more". */
  more: string[];
  /** Booking value (after service discounts) needed; shown as "Add ₹X more to unlock". */
  minOrder?: number;
  /** Number of services (incl. add-ons) needed; that term turns red when not met. */
  minServices?: number;
  /** Index into `terms` of the condition that turns red when `minServices` is not met. */
  conditionTerm?: number;
};

export const coupons: Coupon[] = [
  {
    code: "FIRSTVISIT",
    amount: 150,
    title: "Flat ₹150 OFF",
    terms: ["Valid on your first booking", "Applicable on bookings above ₹999"],
    more: ["One coupon per booking", "Cannot be combined with other offers"],
    minOrder: 999,
  },
  {
    code: "CARE100",
    amount: 100,
    title: "Flat ₹100 OFF",
    terms: ["Valid when you book 2 or more services", "Maximum discount is ₹100"],
    more: ["One coupon per booking", "Add-ons count as services"],
    minServices: 2,
    conditionTerm: 0,
  },
  {
    code: "HOMECARE200",
    amount: 200,
    title: "Flat ₹200 OFF",
    terms: ["Applicable on bookings above ₹4,000", "Valid once per account"],
    more: ["One coupon per booking", "Cannot be combined with other offers"],
    minOrder: 4000,
  },
];

export const couponCopy = {
  placeholder: "Type coupon code here",
  invalid: "This code is not valid. Check and try again.",
  notApplicable: "This code can't be used on this booking yet.",
};

/** Previous providers for repeat bookings (W2.05–W2.11). `id: "best"` is "Best available". */
export type Provider = {
  id: string;
  name: string;
  /** Next free slot shown on the chip (days from today + time); null = busy. */
  slot: { dayOffset: number; time: string } | null;
  photo?: string;
  crop?: Crop;
  /** 3D icon sprite crop for "Best available". */
  sprite?: Crop;
};

export const previousProviders: Provider[] = [
  {
    id: "best",
    name: "Best available",
    slot: { dayOffset: 0, time: "2:30 PM" },
    sprite: { left: "-214.13%", top: "-17.37%", width: "527.5%", height: "268.22%" },
  },
  {
    id: "sunita",
    name: "Sunita Rawat",
    slot: { dayOffset: 0, time: "5:00 PM" },
    photo: "/img/checkout/provider-sunita.png",
    crop: { left: "-73.97%", top: "-1.42%", width: "233.04%", height: "155.36%" },
  },
  {
    id: "preeti",
    name: "Preeti Shetty",
    slot: null,
    photo: "/img/checkout/provider-preeti.jpg",
    crop: { left: "-98.9%", top: "-18.85%", width: "232.56%", height: "181.69%" },
  },
  {
    id: "anita",
    name: "Anita Verma",
    slot: { dayOffset: 1, time: "10:00 AM" },
    photo: "/img/checkout/provider-anita.jpg",
  },
  {
    id: "meena",
    name: "Meena Joshi",
    slot: { dayOffset: 3, time: "9:00 AM" },
    photo: "/img/checkout/provider-meena.png",
  },
];
/** The provider from the last visit, preselected for repeat bookings. */
export const lastProviderId = "sunita";

/** Visit slots per day (W1.16). Times earlier than now + `leadMinutes` are greyed out for today. */
export const slotGroups: { label: string; times: string[] }[] = [
  { label: "Morning", times: ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"] },
  { label: "Afternoon", times: ["12:00 PM", "1:00 PM", "2:30 PM", "3:30 PM"] },
  { label: "Evening", times: ["5:00 PM", "5:30 PM", "6:30 PM", "7:30 PM"] },
];
export const slotRules = { leadMinutes: 60, daysAhead: 60 };

export const policy = {
  title: "Payment and cancellation policy",
  summary: "Pay after your visit · Late cancellation charges apply",
  details: [
    "Pay after your visit by UPI, card or cash.",
    "Cancel free up to 30 minutes before your slot.",
    "Cancelling later, or not being home, costs ₹500.",
  ],
};

export const checkoutCopy = {
  guestHint: "We will send a one time code to your phone",
  chooseSlotHint: "Pick a date and time for the visit",
  terms: "By confirming, you agree to our",
  emptyTitle: "No service selected yet",
  emptyBody: "Add a service to book a visit",
  failedTitle: "We couldn't confirm your booking",
  failedBody: "Nothing has been booked yet. Please try again.",
  slotTakenTitle: "This slot was just booked",
  slotTakenBody: "Pick another time that works for you.",
  expiredTitle: "Your session has expired",
  expiredBody: "Log in again to continue your booking.",
};

/** Simulated network delays (ms) for the loading states in Figma section 20. */
export const delays = { confirm: 1400, price: 700, slots: 600 };
