"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppBarIconLink } from "@/components/site/MobileAppBar";
import { PageShell } from "@/components/site/PageShell";
import {
  checkoutCopy,
  defaultAddress,
  delays,
  demoCart,
  lastProviderId,
  policy,
  previousProviders,
  upsells,
} from "@/data/checkout";
import { demoUser } from "@/data/profile";
import { useCart, type CartItem } from "@/lib/cart";
import { external, routes } from "@/lib/routes";
import { useSession } from "@/lib/session";
import { CheckoutSkeleton } from "./CheckoutSkeleton";
import { CheckoutDialogs, type Dialog } from "./CheckoutDialogs";
import { CouponsSheet } from "./CouponsSheet";
import { BillCard, Card, CardTitle, ChangeButton, Dashed, PolicyCard, ServicesCard, Spinner, VISIT_ICONS, VisitRow } from "./parts";
import {
  addDays,
  bestCouponAmount,
  cartLines,
  dateKey,
  dayName,
  inr,
  makeBill,
  shortTime,
  slotGone,
  today,
  type Line,
} from "./pricing";
import { ProviderPicker } from "./ProviderPicker";
import { SlotPicker } from "./SlotPicker";
import { bookingStore, useChoices, useMounted } from "./store";
import { Upsell } from "./Upsell";

type Sheet = "slot" | "coupons" | null;

/**
 * Checkout (W1.08, W1.15, W1.18, W2.05–W2.11, W3.04, W3.07–W3.09; M1.07, M1.14, M1.17, M2.x, M3.x).
 * One page whose state comes from the cart (useCart), the session (useSession) and the checkout
 * choices (slot, provider, coupon). `initial` opens the slot picker or coupons on /checkout/slot and
 * /checkout/coupons. `?demo=guest|choose|ready|repeat|coupon|failed|slot-taken|expired|empty` seeds a
 * fresh browser for reviews and screenshots.
 */
export function CheckoutView({ initial = null }: { initial?: Sheet }) {
  const router = useRouter();
  const mounted = useMounted();
  const cart = useCart();
  const { user, signIn, signOut } = useSession();
  const choices = useChoices();
  const [sheet, setSheet] = useState<Sheet>(initial);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [confirming, setConfirming] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [couponsLoading, setCouponsLoading] = useState(initial === "coupons");
  const [toast, setToast] = useState<{ text: string; undo: () => void } | null>(null);

  // Demo seeding (fresh headless browsers have no cart or session).
  useEffect(() => {
    let demo: string | null = null;
    try {
      demo = new URLSearchParams(window.location.search).get("demo");
    } catch {}
    if (!demo) return;
    if (demo === "empty") return cart.clear();
    cart.clear();
    demoCart.forEach((i) => cart.add(i));
    const ready = { date: dateKey(today()), time: "5:00 PM" };
    if (demo === "guest") {
      signOut();
      choices.reset();
      return;
    }
    signIn({ ...demoUser, address: defaultAddress, repeat: demo === "repeat" });
    choices.update({
      slot: demo === "choose" ? null : ready,
      providerId: demo === "repeat" ? lastProviderId : null,
      coupon: demo === "coupon" ? "FIRSTVISIT" : null,
    });
    if (demo === "failed") setDialog("failed");
    if (demo === "slot-taken") setDialog("slot-taken");
    if (demo === "expired") setDialog("expired");
    // Run once on load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // W20.10: coupons load briefly when the page opens on /checkout/coupons.
  useEffect(() => {
    if (!couponsLoading) return;
    const t = window.setTimeout(() => setCouponsLoading(false), delays.price);
    return () => window.clearTimeout(t);
  }, [couponsLoading]);

  const lines = useMemo(() => cartLines(cart.items), [cart.items]);
  const bill = useMemo(() => makeBill(lines, choices.coupon), [lines, choices.coupon]);
  const address = user?.address ?? defaultAddress;
  // A slot that has gone by while the page sat open counts as not chosen.
  const slot = choices.slot && !slotGone(choices.slot.date, choices.slot.time) ? choices.slot : null;
  const stage = !user ? "guest" : !slot ? "choose" : "ready";
  const addedIds = cart.items.flatMap((i) => i.addOns.map((a) => a.id));

  // W20.13 Price updating: bill values shimmer briefly after the user changes services or the coupon.
  const priceTimer = useRef(0);
  const bump = () => {
    setUpdating(true);
    window.clearTimeout(priceTimer.current);
    priceTimer.current = window.setTimeout(() => setUpdating(false), delays.price);
  };

  // Toast goes away after 4 seconds (W3.07).
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(t);
  }, [toast]);

  const closeSheet = () => {
    setSheet(null);
    // Leave /checkout/slot or /checkout/coupons without remounting the page (keeps dialogs and state).
    if (window.location.pathname !== routes.checkout) window.history.replaceState(null, "", routes.checkout);
  };

  const removeLine = (line: Line) => {
    const before = cart.items;
    const item = before.find((i) => i.category === line.category && i.slug === line.slug);
    if (!item) return;
    if (line.addOnId) cart.add({ ...item, addOns: item.addOns.filter((a) => a.id !== line.addOnId) });
    else cart.remove(line.category, line.slug);
    bump();
    setToast({ text: `${line.name} removed`, undo: () => restore(before) });
  };
  const restore = (items: CartItem[]) => {
    cart.clear();
    items.forEach((i) => cart.add(i));
    bump();
    setToast(null);
  };

  const toggleUpsell = (id: string) => {
    const first = cart.items[0];
    const u = upsells.find((x) => x.id === id);
    if (!first || !u) return;
    const has = first.addOns.some((a) => a.id === id);
    bump();
    cart.add({
      ...first,
      addOns: has ? first.addOns.filter((a) => a.id !== id) : [...first.addOns, { id, name: u.name, price: u.price }],
    });
  };

  const confirm = () => {
    if (!user) return router.push(`${routes.login}?next=${encodeURIComponent(routes.checkout)}`);
    if (!slot) return setSheet("slot");
    setConfirming(true);
    window.setTimeout(() => {
      // Placeholder for the booking API: on failure show setDialog("failed" | "slot-taken" | "expired").
      bookingStore.set({ user, address, slot, bill });
      router.push(routes.bookingConfirmed);
      cart.clear();
      choices.reset();
    }, delays.confirm);
  };

  const backHref = cart.items[0] ? routes.service(cart.items[0].category, cart.items[0].slug) : routes.home;

  if (!mounted) return <CheckoutSkeleton />;

  const empty = lines.length === 0;
  const cta =
    stage === "guest"
      ? { label: "Log in to continue", mobileLabel: "Login/Sign up to continue", hint: checkoutCopy.guestHint }
      : stage === "choose"
        ? { label: "Choose a slot", mobileLabel: "Choose a slot", hint: checkoutCopy.chooseSlotHint }
        : { label: "Confirm booking", mobileLabel: "Confirm booking", hint: null };

  const ctaButton = (mobile: boolean) => (
    <button
      type="button"
      onClick={confirm}
      disabled={confirming}
      aria-busy={confirming || undefined}
      className="state-dark flex h-[52px] w-full min-w-0 cursor-pointer items-center justify-center rounded-lg bg-brand text-b16 font-semibold whitespace-nowrap text-on-dark disabled:cursor-progress"
    >
      {confirming ? <Spinner /> : mobile ? cta.mobileLabel : cta.label}
      {confirming && <span className="sr-only">Confirming your booking</span>}
    </button>
  );

  return (
    <PageShell
      title="Checkout"
      backHref={backHref}
      appBarActions={<AppBarIconLink href={routes.careTeam} icon="/icons/icon-headset.svg" label="Talk to our care team" />}
    >
      <div className={`min-h-[calc(100dvh-64px)] md:min-h-0 md:bg-card ${empty ? "bg-card" : "bg-page"}`}>
        <div className="page-narrow pt-6 pb-[200px] md:pt-8 md:pb-12">
          <div className="mb-6 hidden items-center gap-3 md:flex">
            <Link href={backHref} aria-label="Back" className="state flex size-10 items-center justify-center rounded-full border border-line bg-card">
              <img src="/icons/icon-back.svg" alt="" className="size-5" />
            </Link>
            <h1 className="font-display text-h24 font-semibold">Checkout</h1>
          </div>

          {empty ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
              {/* Mobile: one column ordered by `order-*`; desktop: two columns (left 1fr, right 420). */}
              <div className="contents md:flex md:min-w-0 md:flex-1 md:flex-col md:gap-4">
                {user?.repeat && (
                  <ProviderPicker
                    className="order-2 md:order-none"
                    selected={choices.providerId}
                    onSelect={(p) =>
                      choices.update({
                        providerId: p?.id ?? null,
                        ...(p?.slot ? { slot: { date: dateKey(addDays(today(), p.slot.dayOffset)), time: p.slot.time } } : {}),
                      })
                    }
                  />
                )}
                <Card raised className="order-3 flex flex-col gap-4 p-4 md:order-none">
                  <CardTitle>Visit details</CardTitle>
                  <Dashed />
                  <div className="flex flex-col gap-4">
                    {user ? (
                      <>
                        <VisitRow
                          icon={VISIT_ICONS.patient}
                          title={user.name}
                          sub={user.phone}
                          action={<ChangeButton href={routes.personalDetails} label="Change patient details" />}
                        />
                        {slot ? (
                          <VisitRow
                            icon={VISIT_ICONS.time}
                            title={dayName(slot.date)}
                            sub={shortTime(slot.time)}
                            action={<ChangeButton onClick={() => setSheet("slot")} label="Change date and time" />}
                          />
                        ) : (
                          <VisitRow icon={VISIT_ICONS.time} title="Date and time" sub="Not chosen yet" muted />
                        )}
                        <VisitRow
                          className="max-md:hidden"
                          icon={VISIT_ICONS.address}
                          title={address.label}
                          sub={address.line}
                          action={<ChangeButton href={routes.addresses} label="Change visit address" />}
                        />
                      </>
                    ) : (
                      <>
                        <VisitRow icon={VISIT_ICONS.patient} title="Patient details" sub="Added after you log in" muted />
                        <VisitRow icon={VISIT_ICONS.time} title="Date and time" sub="Chosen after you log in" muted />
                        <VisitRow className="max-md:hidden" icon={VISIT_ICONS.address} title="Visit address" sub="Added after you log in" muted />
                      </>
                    )}
                  </div>
                </Card>
                <Upsell className="order-4 md:order-none" addedIds={addedIds} onToggle={toggleUpsell} />
                <div className="order-7 md:order-none">
                  <PolicyCard title={policy.title} summary={policy.summary} details={policy.details} />
                </div>
              </div>

              <div className="contents md:flex md:w-[420px] md:shrink-0 md:flex-col md:gap-4">
                <ServicesCard className="order-1 md:order-none" lines={lines} onRemove={removeLine} />
                <CouponRow
                  className="order-5 md:order-none"
                  applied={bill.coupon}
                  best={bestCouponAmount(lines)}
                  onOpen={() => {
                    setCouponsLoading(true);
                    setSheet("coupons");
                  }}
                  onRemove={() => {
                    choices.update({ coupon: null });
                    bump();
                  }}
                />
                <div className="order-6 md:order-none">
                  <BillCard bill={bill} updating={updating} />
                </div>
                <div className="hidden flex-col items-center gap-3 md:flex">
                  {ctaButton(false)}
                  <p className="text-center text-b12 text-ink-2">
                    {cta.hint ?? (
                      <>
                        {checkoutCopy.terms}{" "}
                        <a href={external.terms} target="_blank" rel="noreferrer" className="hover:underline">
                          T&amp;C
                        </a>{" "}
                        and{" "}
                        <a href={external.privacy} target="_blank" rel="noreferrer" className="hover:underline">
                          Privacy policy
                        </a>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {!empty && (
          <MobileBottomBar
            showAddress={!!user}
            address={`${address.label} · ${address.line}`}
            total={stage === "guest" ? null : { toPay: bill.toPay, mrp: bill.mrpTotal, savings: bill.savings }}
            button={ctaButton(true)}
          />
        )}
      </div>

      {toast && (
        <div className="fixed inset-x-4 bottom-[180px] z-40 mx-auto max-w-[420px] md:bottom-14">
          <div role="status" className="flex h-14 items-center gap-3 rounded-lg bg-inverse px-4 text-b14 text-on-dark shadow-float">
            <p className="min-w-0 flex-1 font-medium">{toast.text}</p>
            <button type="button" onClick={toast.undo} className="cursor-pointer font-semibold underline">
              Undo
            </button>
          </div>
        </div>
      )}

      <SlotPicker
        open={sheet === "slot"}
        initial={slot}
        onClose={closeSheet}
        onConfirm={(s) => {
          const keep = previousProviders.find((p) => p.id === choices.providerId);
          const sameAsProvider = keep?.slot && dateKey(addDays(today(), keep.slot.dayOffset)) === s.date && keep.slot.time === s.time;
          choices.update({ slot: s, providerId: sameAsProvider ? choices.providerId : null });
          closeSheet();
        }}
      />
      <CouponsSheet
        open={sheet === "coupons"}
        loading={couponsLoading}
        lines={lines}
        applied={bill.coupon?.code ?? null}
        onClose={closeSheet}
        onApply={(code) => {
          choices.update({ coupon: code });
          bump();
          closeSheet();
          setDialog({ applied: code });
        }}
      />
      <CheckoutDialogs
        dialog={dialog}
        onClose={() => setDialog(null)}
        onRetry={() => {
          setDialog(null);
          confirm();
        }}
        onPickSlot={() => {
          setDialog(null);
          choices.update({ slot: null });
          setSheet("slot");
        }}
        onLogin={() => {
          setDialog(null);
          signOut();
          router.push(`${routes.login}?next=${encodeURIComponent(routes.checkout)}`);
        }}
      />
    </PageShell>
  );
}

function CouponRow({
  applied,
  best,
  onOpen,
  onRemove,
  className = "",
}: {
  applied: { code: string; amount: number } | null;
  best: number;
  onOpen: () => void;
  onRemove: () => void;
  className?: string;
}) {
  if (applied) {
    return (
      <Card className={`flex items-center gap-3 p-4 ${className}`}>
        <img src="/icons/checkout/discount-32.svg" alt="" className="size-8 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-b14 font-semibold">{applied.code} applied</p>
          <p className="text-b12 font-medium text-success">You save {inr(applied.amount)} on this booking</p>
        </div>
        <button type="button" onClick={onRemove} className="state -m-2 cursor-pointer rounded-md p-2 text-b12 font-medium text-danger">
          Remove
        </button>
      </Card>
    );
  }
  return (
    <Card className={`p-0 ${className}`}>
      <button type="button" onClick={onOpen} className="state flex w-full cursor-pointer items-center gap-3 rounded-xl p-4 text-left">
        <img src="/icons/checkout/discount-32.svg" alt="" className="size-8 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block text-b14 font-semibold">Apply coupon</span>
          <span className="block text-b12 font-medium text-success">
            {best > 0 ? `Save up to ${inr(best)} more` : "See available offers"}
          </span>
        </span>
        <img src="/icons/checkout/arrow-right-20.svg" alt="" className="size-5" />
      </button>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[460px] flex-col items-center justify-center gap-3 px-4 text-center">
      <span className="flex size-24 items-center justify-center rounded-full bg-muted">
        <img src="/icons/checkout/calendar-bold-48.svg" alt="" className="size-12" />
      </span>
      <div className="flex flex-col items-center gap-1">
        <h2 className="font-display text-h18 font-semibold">{checkoutCopy.emptyTitle}</h2>
        <p className="text-b14 text-ink-2">{checkoutCopy.emptyBody}</p>
      </div>
      <Link
        href={routes.home}
        className="state-dark flex h-[52px] items-center justify-center rounded-lg bg-brand px-[17px] text-b16 font-semibold text-on-dark"
      >
        Explore services
      </Link>
    </div>
  );
}

/** M2.07 bottom bar: visit address + total + main action (guest: action only). */
function MobileBottomBar({
  showAddress,
  address,
  total,
  button,
}: {
  showAddress: boolean;
  address: string;
  total: { toPay: number; mrp: number; savings: number } | null;
  button: React.ReactNode;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-card pb-[max(16px,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgb(0_0_0/0.06)] md:hidden">
      {showAddress && (
        <Link href={routes.addresses} className="state flex items-center gap-3 px-4 py-6">
          <img src="/icons/checkout/location-20.svg" alt="" className="size-5 shrink-0" />
          <span className="min-w-0 flex-1 truncate text-b14 font-medium">{address}</span>
          <img src="/icons/checkout/edit-20.svg" alt="Change address" className="size-5 shrink-0" />
        </Link>
      )}
      <div className={`flex items-center gap-2 px-4 ${showAddress ? "" : "pt-4"}`}>
        {total && (
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-display text-h18 font-semibold">{inr(total.toPay)}</span>
              {total.mrp > total.toPay && <s className="text-b12 text-ink-2">{inr(total.mrp)}</s>}
            </p>
            {total.savings > 0 && <p className="text-b12 text-success">You save {inr(total.savings)}</p>}
          </div>
        )}
        <div className="min-w-0 flex-1">{button}</div>
      </div>
    </div>
  );
}
