import { coupons, fallbackService, serviceInfo, slotRules, TAXES, type Coupon } from "@/data/checkout";
import type { CartItem } from "@/lib/cart";

/** One row in "Your services" / the bill: a service or one of its add-ons. */
export type Line = {
  key: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  /** Add-on rows carry the "Added" tag. */
  added: boolean;
  category: string;
  slug: string;
  addOnId?: string;
};

export type Bill = {
  lines: Line[];
  mrpTotal: number;
  discount: number;
  /** Total after service discounts, before coupon and taxes. */
  subtotal: number;
  coupon: { code: string; amount: number } | null;
  taxes: number;
  toPay: number;
  savings: number;
};

const info = (id: string, price: number) => serviceInfo[id] ?? { mrp: price, image: fallbackService.image };

export function cartLines(items: CartItem[]): Line[] {
  return items.flatMap((item) => {
    const main = info(item.slug, item.price);
    return [
      {
        key: `${item.category}/${item.slug}`,
        name: item.name,
        image: main.image,
        price: item.price,
        mrp: Math.max(main.mrp, item.price),
        added: false,
        category: item.category,
        slug: item.slug,
      },
      ...item.addOns.map((a) => {
        const add = info(a.id, a.price);
        return {
          key: `${item.category}/${item.slug}/${a.id}`,
          name: a.name,
          image: add.image,
          price: a.price,
          mrp: Math.max(add.mrp, a.price),
          added: true,
          category: item.category,
          slug: item.slug,
          addOnId: a.id,
        };
      }),
    ];
  });
}

export function couponStatus(c: Coupon, lines: Line[]) {
  const subtotal = lines.reduce((s, l) => s + l.price, 0);
  const shortBy = c.minOrder && subtotal < c.minOrder ? c.minOrder - subtotal : 0;
  const failsServices = !!c.minServices && lines.length < c.minServices;
  return { ok: lines.length > 0 && !shortBy && !failsServices, shortBy, failsServices };
}

export function findCoupon(code: string | null | undefined) {
  if (!code) return undefined;
  return coupons.find((c) => c.code === code.trim().toUpperCase());
}

export function makeBill(lines: Line[], couponCode: string | null): Bill {
  const mrpTotal = lines.reduce((s, l) => s + l.mrp, 0);
  const subtotal = lines.reduce((s, l) => s + l.price, 0);
  const discount = mrpTotal - subtotal;
  const c = findCoupon(couponCode);
  const coupon = c && couponStatus(c, lines).ok ? { code: c.code, amount: c.amount } : null;
  const taxes = lines.length ? TAXES : 0;
  const toPay = subtotal - (coupon?.amount ?? 0) + taxes;
  return { lines, mrpTotal, discount, subtotal, coupon, taxes, toPay, savings: discount + (coupon?.amount ?? 0) };
}

/** Best coupon this cart can use, for "Save up to ₹X more". */
export function bestCouponAmount(lines: Line[]) {
  return coupons.filter((c) => couponStatus(c, lines).ok).reduce((m, c) => Math.max(m, c.amount), 0);
}

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* ---------- Dates and slots ---------- */

export type Slot = { date: string; time: string };

const pad = (n: number) => String(n).padStart(2, "0");
export const dateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export function fromKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function addDays(d: Date, n: number) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + n);
  return x;
}
export const today = () => addDays(new Date(), 0);

/** "5:30 PM" → minutes after midnight. */
export function minutesOf(time: string) {
  const m = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  const h = (Number(m[1]) % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0);
  return h * 60 + Number(m[2]);
}

/** Is this slot already in the past (or too soon to reach)? */
export function slotGone(date: string, time: string, now = new Date()) {
  const d = fromKey(date);
  d.setMinutes(minutesOf(time));
  return d.getTime() < now.getTime() + slotRules.leadMinutes * 60_000;
}

/** "5:00 PM" → "5 PM"; "5:30 PM" stays. */
export const shortTime = (t: string) => t.replace(":00", "");

export function dayName(key: string) {
  const d = fromKey(key);
  const diff = Math.round((d.getTime() - today().getTime()) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

/** Chip label for a provider's next slot: "Today, 5 PM" / "Wed, 10 AM". */
export function providerSlotLabel(dayOffset: number, time: string) {
  const d = addDays(today(), dayOffset);
  const day = dayOffset === 0 ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" });
  return `${day}, ${shortTime(time)}`;
}
