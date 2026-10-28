import Link from "next/link";
import { rupees, type Service } from "@/data/services";
import { routes } from "@/lib/routes";

/** Opens the ratings pop up (W7.02) on the category page: `?reviews=<slug>`. */
export const reviewsHref = (s: Service) => `${routes.category(s.category)}?reviews=${s.slug}`;

export function RatingLink({ service, href }: { service: Service; href?: string }) {
  return (
    <Link
      href={href ?? reviewsHref(service)}
      scroll={false}
      className="state flex items-center gap-1 self-start rounded-sm text-b12 text-ink-2"
    >
      <img src="/icons/services/star.svg" alt="" className="size-3" />
      <span className="underline decoration-dotted underline-offset-2">
        {service.rating} ({service.reviews} reviews)
      </span>
    </Link>
  );
}

export function Price({ price, mrp }: { price: number; mrp: number }) {
  return (
    <p className="flex items-center gap-2">
      <span className="text-b14 font-semibold">{rupees(price)}</span>
      <s className="text-b12 text-ink-2">{rupees(mrp)}</s>
    </p>
  );
}

export function DashedDivider({ src = "/icons/services/dashed-divider.svg" }: { src?: string }) {
  return <img src={src} alt="" className="block h-px w-full" />;
}

function BookLink({ service, className = "" }: { service: Service; className?: string }) {
  return (
    <Link
      href={routes.service(service.category, service.slug)}
      scroll={false}
      className={`state flex h-[42px] w-[90px] items-center justify-center rounded-md border border-line bg-card text-b16 font-semibold text-link shadow-card ${className}`}
    >
      Book
      <span className="sr-only">: {service.name}</span>
    </Link>
  );
}

/**
 * Procedure card. Grid layout (W1.02, all mobile): copy left, photo right with Book on its bottom edge.
 * Inside a `group/listing` wrapper with `data-view="list"` (W1.03, desktop only) it switches to photo left,
 * copy, Book on the right — one markup for both views.
 */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="flex gap-4 rounded-lg border border-line bg-gradient-to-l from-tint-2 to-card p-4 md:group-data-[view=list]/listing:items-center md:group-data-[view=list]/listing:gap-5">
      <div className="hidden size-24 shrink-0 overflow-hidden rounded-lg bg-muted md:group-data-[view=list]/listing:block">
        <img src={service.image} alt="" className="size-full object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-b16 font-semibold">{service.name}</h3>
          <div className="flex flex-col gap-2">
            <RatingLink service={service} />
            <Price price={service.price} mrp={service.mrp} />
          </div>
        </div>
        <DashedDivider />
        <ul className="flex list-disc flex-col gap-1 ps-[18px] text-b12 text-ink-2">
          {service.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <Link
          href={routes.service(service.category, service.slug)}
          scroll={false}
          className="self-start text-b14 font-semibold text-link hover:underline"
        >
          View details
        </Link>
      </div>
      <div className="relative h-[148px] w-[124px] shrink-0 md:group-data-[view=list]/listing:hidden">
        <div className="size-[124px] overflow-hidden rounded-lg bg-muted">
          <img src={service.image} alt="" className="size-full object-cover" />
        </div>
        <BookLink service={service} className="absolute top-[103.5px] left-[17px]" />
      </div>
      <div className="hidden md:group-data-[view=list]/listing:block">
        <BookLink service={service} />
      </div>
    </article>
  );
}
