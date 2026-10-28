"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState } from "react";
import { groupAnchor, type Category, type Service, type SubCategory } from "@/data/services";
import { routes } from "@/lib/routes";
import { ShareButton } from "./ShareButton";

function hrefFor(category: Category, sub: SubCategory) {
  return "group" in sub.target ? `#${groupAnchor(sub.target.group)}` : routes.service(category.slug, sub.target.service);
}

/** Which sidebar entry is current: the open service, else the group in view. */
function useActive(category: Category, services: Pick<Service, "slug" | "group">[]) {
  const slug = useSelectedLayoutSegment();
  const [groupInView, setGroupInView] = useState(category.groups[0]?.id);

  useEffect(() => {
    const els = category.groups.map((g) => document.getElementById(groupAnchor(g.id))).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setGroupInView(top.target.id.replace("group-", ""));
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [category.groups]);

  return (sub: SubCategory) => {
    if (slug) {
      if ("service" in sub.target) return sub.target.service === slug;
      const svc = services.find((s) => s.slug === slug);
      const direct = category.subcategories.some((s) => "service" in s.target && s.target.service === slug);
      return !direct && svc?.group === sub.target.group;
    }
    return "group" in sub.target && sub.target.group === groupInView;
  };
}

/** Desktop sidebar card (W1.02 "Categories"): back, title, share, sub-category list. */
export function CategorySidebar({ category, services }: { category: Category; services: Pick<Service, "slug" | "group">[] }) {
  const isActive = useActive(category, services);
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line bg-card p-4">
      <div className="flex items-center gap-3">
        <Link href={routes.home} aria-label="Back to home" className="state flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-card">
          <img src="/icons/icon-back.svg" alt="" className="size-5" />
        </Link>
        <h1 className="min-w-0 flex-1 font-display text-h24 font-semibold">{category.name}</h1>
        <ShareButton title={category.name} path={routes.category(category.slug)} />
      </div>
      <nav aria-label={`${category.name} services`} className="flex flex-col gap-3">
        <p className="text-b14 text-ink-2">Select a service</p>
        <ul className="flex flex-col">
          {category.subcategories.map((sub) => {
            const active = isActive(sub);
            return (
              <li key={sub.label}>
                <Link
                  href={hrefFor(category, sub)}
                  scroll={"group" in sub.target}
                  aria-current={active ? "true" : undefined}
                  className={`state flex h-16 items-center gap-3 rounded-md px-2 text-b14 ${
                    active ? "bg-tint font-semibold text-brand" : "font-medium text-ink"
                  }`}
                >
                  <img src={sub.image} alt="" className="size-12 shrink-0 rounded-md bg-muted object-cover" />
                  {sub.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/** Mobile 3-up tiles (M1.03 "Tiles"). */
export function CategoryTiles({ category }: { category: Category }) {
  return (
    <ul className="grid grid-cols-3 gap-x-2 gap-y-4 px-4 md:hidden">
      {category.subcategories.map((sub) => (
        <li key={sub.label}>
          <Link href={hrefFor(category, sub)} scroll={"group" in sub.target} className="state flex flex-col items-center gap-2 rounded-md">
            <img src={sub.image} alt="" className="h-[101px] w-full rounded-md bg-muted object-cover" />
            <span className="text-center text-b12 font-medium">{sub.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
