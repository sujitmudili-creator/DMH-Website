"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { CropImg } from "@/components/ui/CropImg";
import { Modal } from "@/components/ui/Modal";
import {
  getAddOn,
  ratingFor,
  reviewsFor,
  rupees,
  trustPoints,
  whyTiles,
  type AddOn,
  type Service,
} from "@/data/services";
import { useCart } from "@/lib/cart";
import { routes } from "@/lib/routes";
import { Reviews } from "./Reviews";
import { DashedDivider } from "./ServiceCard";
import { ShareButton } from "./ShareButton";

const H2 = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <h2 className={`font-display text-h20 font-semibold ${className}`}>{children}</h2>
);

function Summary({ service }: { service: Service }) {
  const [more, setMore] = useState(false);
  const cut = service.description.length > 100 ? service.description.slice(0, 95).replace(/\s+\S*$/, "").replace(/[.,;:]+$/, "") : null;
  return (
    <div className="flex flex-col gap-4 px-4 md:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-h24 font-semibold">{service.name}</h1>
        <div className="flex flex-col gap-2">
          <a href="#reviews" className="state flex items-center gap-1 self-start rounded-sm text-b12 text-ink-2">
            <img src="/icons/services/star.svg" alt="" className="size-3" />
            {service.rating} ({service.reviews} reviews)
          </a>
          <p className="flex items-center gap-2">
            <span className="text-b14 font-semibold">{rupees(service.price)}</span>
            <s className="text-b12 text-ink-2">{rupees(service.mrp)}</s>
            <span className="text-b12 whitespace-pre text-ink-2">•  {service.unit}</span>
          </p>
        </div>
      </div>
      <p className="text-b14 text-ink-2">
        {cut && !more ? `${cut}... ` : `${service.description} `}
        {cut && (
          <button type="button" onClick={() => setMore((m) => !m)} className="cursor-pointer font-semibold text-ink hover:underline">
            {more ? "See less" : "See more"}
          </button>
        )}
      </p>
    </div>
  );
}

function AddOnCard({ addOn, added, onToggle }: { addOn: AddOn; added: boolean; onToggle: () => void }) {
  return (
    <li
      className={`flex w-[calc(50%-6px)] shrink-0 flex-col gap-3 rounded-lg px-2 pt-2 pb-3 ${
        added ? "border border-success bg-success-tint" : "border border-transparent bg-page"
      }`}
    >
      <img src={addOn.image} alt="" className="h-28 w-full rounded-lg bg-muted object-cover" />
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-1 flex-col gap-1">
          <h3 className="font-display text-b16 font-semibold md:text-h20">{addOn.name}</h3>
          <p className="flex items-center gap-1 text-b12 text-ink-2">
            <img src="/icons/services/star.svg" alt="" className="size-3" />
            {addOn.rating} ({addOn.reviews})
          </p>
          {/* Figma has no target for "View Details" on add-ons; kept as text. */}
          <p className="text-b12 font-semibold text-brand">View Details</p>
        </div>
        <DashedDivider src="/icons/services/dashed-divider-234.svg" />
        <div className="flex items-center">
          <p className="flex flex-1 flex-col gap-0.5">
            <span className="text-b16 font-semibold">{rupees(addOn.price)}</span>
            <s className="text-b12 text-ink-2">{rupees(addOn.mrp)}</s>
          </p>
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={added}
            aria-label={added ? `Remove ${addOn.name}` : `Add ${addOn.name}`}
            className={`flex h-[39px] flex-1 cursor-pointer items-center justify-center gap-0.5 rounded-md text-b14 font-semibold ${
              added ? "state-dark bg-success text-on-dark" : "state border border-line bg-card text-link"
            }`}
          >
            {!added && <img src="/icons/services/add-16.svg" alt="" className="size-4" />}
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </li>
  );
}

function OftenBooked({ addOns, selected, toggle }: { addOns: AddOn[]; selected: string[]; toggle: (id: string) => void }) {
  const ref = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  if (!addOns.length) return null;
  const onScroll = () => {
    const el = ref.current;
    if (el) setProgress(el.scrollWidth > el.clientWidth ? el.scrollLeft / (el.scrollWidth - el.clientWidth) : 0);
  };
  return (
    <section className="flex flex-col items-center gap-4 px-4 md:px-6">
      <H2 className="w-full">Often booked together</H2>
      <ul ref={ref} onScroll={onScroll} className="scroller w-full gap-3">
        {addOns.map((a) => (
          <AddOnCard key={a.id} addOn={a} added={selected.includes(a.id)} onToggle={() => toggle(a.id)} />
        ))}
      </ul>
      <div className="relative h-1 w-[79px] overflow-hidden rounded-xl bg-muted" aria-hidden>
        <span className="absolute top-0 h-1 w-6 rounded-xl bg-hero" style={{ left: `${progress * (79 - 24)}px` }} />
      </div>
    </section>
  );
}

function WhyTile({ label, src, crop, className, gradient }: { label: string; src: string; crop: { left: string; top: string; width: string; height: string }; className: string; gradient?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-lg p-4 ${className}`}>
      {gradient && <div className="absolute inset-0 bg-[linear-gradient(269deg,var(--color-why-tile-from),var(--color-why-tile-to))]" />}
      <CropImg src={src} crop={crop} className="absolute inset-0" />
      <p className="relative text-b12 font-semibold text-on-dark">{label}</p>
    </div>
  );
}

function WhyFamilies({ service }: { service: Service }) {
  return (
    <section className="flex flex-col gap-6 px-4 md:px-6">
      <H2>Why families choose us</H2>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <WhyTile {...whyTiles.professionals} gradient className="h-[218px]" crop={{ left: "-0.16%", top: "4.84%", width: "100%", height: "174.77%" }} />
            <WhyTile {...whyTiles.kit} className="h-[152px]" crop={{ left: "0%", top: "-37.33%", width: "100%", height: "250.66%" }} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <WhyTile {...whyTiles.sterile} className="h-[152px]" crop={{ left: "-13.75%", top: "-52.58%", width: "113.79%", height: "225.66%" }} />
            <WhyTile {...whyTiles.scrubs} className="h-[218px]" crop={{ left: "-16.54%", top: "-51.59%", width: "116.39%", height: "203.41%" }} />
          </div>
        </div>
        <div className="relative flex h-[176px] items-center overflow-hidden rounded-lg bg-[linear-gradient(70deg,var(--color-why-from)_6%,var(--color-why-to)_100%)] py-4 pl-6 md:pl-8">
          <ul className="relative z-10 flex flex-col gap-2">
            {trustPoints.map((t) => (
              <li key={t.icon} className="flex items-center gap-2 text-b14 whitespace-nowrap text-on-dark">
                <img src={t.icon} alt="" className="size-5" />
                {t.label(service)}
              </li>
            ))}
          </ul>
          <CropImg
            src={whyTiles.nurse}
            alt=""
            className="absolute top-1 right-[14.5px] h-[182px] w-[165.5px] -scale-x-100 rounded-lg max-md:right-0 max-md:w-[130px]"
            crop={{ left: "0%", top: "-4.56%", width: "100%", height: "142.09%" }}
          />
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="flex flex-col gap-6 px-4 md:px-6">
      <div className="flex items-center gap-3">
        <H2 className="flex-1">How the visit works</H2>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="visit-steps"
          className="state flex cursor-pointer items-center gap-1 rounded-sm text-b14 font-semibold text-link"
        >
          {open ? "Hide steps" : "View steps"}
          <img src="/icons/services/arrow-down-16-link.svg" alt="" className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open && (
        <ol id="visit-steps" className="flex flex-col gap-6">
          {service.steps.map((s, i) => (
            <li key={s.title} className="relative flex items-start gap-3.5">
              {i < service.steps.length - 1 && <span className="absolute top-9 -bottom-5 left-[14px] w-1 rounded-xl bg-line-2" aria-hidden />}
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-[0.5px] border-card bg-gradient-to-b from-tile to-card/60 text-b14 font-semibold backdrop-blur-[16px]">
                {i + 1}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-b16 font-semibold">{s.title}</h3>
                  <p className="text-b14 text-ink-2">{s.body}</p>
                </div>
                <img src={s.image} alt="" className="aspect-[466/262] w-full rounded-lg bg-muted object-cover" />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function InfoBox({ title, tone, items }: { title: string; tone: "included" | "note"; items: { icon: string; text: string }[] }) {
  const box = tone === "included" ? "border-included" : "border-note-line";
  const head = tone === "included" ? "from-included" : "from-note-tint";
  return (
    <section className={`flex flex-col gap-4 overflow-hidden rounded-lg border pb-4 ${box}`}>
      <div>
        <div className={`bg-gradient-to-b to-card p-4 ${head}`}>
          <H2>{title}</H2>
        </div>
        <DashedDivider src="/icons/services/dashed-divider-510.svg" />
      </div>
      <ul className="flex flex-col gap-2 px-4">
        {items.map((it) => (
          <li key={it.text} className="flex items-center gap-2 text-b12">
            <img src={it.icon} alt="" className="size-6 shrink-0" />
            {it.text}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Faqs({ service }: { service: Service }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="flex flex-col gap-6 px-4 md:px-6">
      <H2>Questions families ask</H2>
      <ul className="flex flex-col gap-2">
        {service.faqs.map((f, i) => {
          const on = open === i;
          return (
            <li key={f.q} className="rounded-lg border border-line bg-[linear-gradient(200deg,var(--color-tint-2)_0%,var(--color-faq)_38%)]">
              <button
                type="button"
                onClick={() => setOpen(on ? -1 : i)}
                aria-expanded={on}
                className="flex w-full cursor-pointer items-center gap-3 p-4 text-left text-b14 font-semibold"
              >
                <span className="flex-1">{f.q}</span>
                <img src="/icons/icon-arrow-down-18.svg" alt="" className={`size-[18px] transition-transform ${on ? "rotate-180" : ""}`} />
              </button>
              {on && <p className="-mt-2 px-4 pb-4 text-b14 text-ink-2">{f.a}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Service detail pop up (W1.04–W1.07, M1.04–M1.06): dialog on desktop, bottom sheet on mobile, over the
 * category listing. Add-ons toggle in place (W1.05) and the footer total follows. Continue saves the service
 * and add-ons to the cart and goes to checkout.
 */
export function ServiceDetail({ service }: { service: Service }) {
  const router = useRouter();
  const cart = useCart();
  const inCart = cart.items.find((x) => x.category === service.category && x.slug === service.slug);
  const addOns = service.addOns.map(getAddOn).filter(Boolean) as AddOn[];
  const [picked, setPicked] = useState<string[] | null>(null);
  // Until the user changes something, mirror what is already in the cart.
  const selected = picked ?? inCart?.addOns.map((a) => a.id) ?? [];

  const toggle = (id: string) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    setPicked(next);
    if (inCart) cart.add(toItem(next));
  };

  const toItem = (ids: string[]) => ({
    category: service.category,
    slug: service.slug,
    name: service.name,
    price: service.price,
    addOns: addOns.filter((a) => ids.includes(a.id)).map((a) => ({ id: a.id, name: a.name, price: a.price })),
  });

  const chosen = addOns.filter((a) => selected.includes(a.id));
  const total = service.price + chosen.reduce((n, a) => n + a.price, 0);
  const mrp = service.mrp + chosen.reduce((n, a) => n + a.mrp, 0);
  const count = 1 + chosen.length;

  const close = () => router.push(routes.category(service.category), { scroll: false });
  const proceed = () => {
    cart.add(toItem(selected));
    router.push(routes.checkout);
  };

  const footer = (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
        <p className="flex items-center gap-2">
          <span className="font-display text-h20 font-semibold">{rupees(total)}</span>
          <s className="text-b12 text-ink-2">{rupees(mrp)}</s>
        </p>
        <p className="text-b12 font-medium text-success">
          {count} {count === 1 ? "service" : "services"} · You save {rupees(mrp - total)}
        </p>
      </div>
      <button type="button" onClick={proceed} className="state-dark h-14 flex-1 cursor-pointer rounded-lg bg-brand text-b16 font-semibold text-on-dark">
        Continue
      </button>
    </div>
  );

  const roundBtn = "state flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-card";

  return (
    <Modal open onClose={close} footer={footer}>
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-6">
          <img src={service.image} alt="" className="h-60 w-full bg-muted object-cover md:h-[300px]" />
          <Summary service={service} />
        </div>
        <OftenBooked addOns={addOns} selected={selected} toggle={toggle} />
        <WhyFamilies service={service} />
        <HowItWorks service={service} />
        <div className="flex flex-col gap-4 px-4 md:px-6">
          <InfoBox
            title="What’s included & what’s not"
            tone="included"
            items={[
              ...service.included.map((text) => ({ icon: "/icons/services/tick-circle-24.svg", text })),
              ...service.excluded.map((text) => ({ icon: "/icons/services/close-circle-24.svg", text })),
            ]}
          />
          <InfoBox title="Good to know" tone="note" items={service.goodToKnow.map((text) => ({ icon: "/icons/services/info-circle-24.svg", text }))} />
        </div>
        <section id="reviews" className="flex scroll-mt-4 flex-col gap-6 px-4 md:px-10">
          <H2>Reviews</H2>
          <Reviews summary={ratingFor(service)} reviews={reviewsFor(service)} />
        </section>
        <Faqs service={service} />
      </div>
      {/* Actions float over the photo and stay put while the content scrolls. */}
      <button type="button" onClick={close} aria-label="Back" className={`${roundBtn} absolute top-4 left-4 md:hidden`}>
        <img src="/icons/icon-back.svg" alt="" className="size-5" />
      </button>
      <div className="absolute top-4 right-4 flex gap-2">
        <ShareButton title={service.name} />
        <button type="button" onClick={close} aria-label="Close" className={`${roundBtn} max-md:hidden`}>
          <img src="/icons/icon-add-26.svg" alt="" className="size-[26px] rotate-45" />
        </button>
      </div>
    </Modal>
  );
}
