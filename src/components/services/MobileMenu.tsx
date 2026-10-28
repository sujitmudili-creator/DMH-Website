"use client";

import Link from "next/link";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import type { Category, Service } from "@/data/services";
import { routes } from "@/lib/routes";

/** Floating "Menu" pill (M1.03) that opens the service menu sheet (M7.02). Mobile only. */
export function MobileMenu({ category, services }: { category: Category; services: Pick<Service, "slug" | "name" | "image" | "group">[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-20 flex justify-center md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="state-dark pointer-events-auto flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-b from-pill to-pill/95 px-4 py-3 text-b16 font-semibold text-on-dark shadow-pill"
        >
          <img src="/icons/services/menu-18-white.svg" alt="" className="size-[18px]" />
          Menu
        </button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Menu">
        <div className="flex flex-col gap-6 px-4 pt-4 pb-8">
          {category.groups.map((g) => (
            <section key={g.id} className="flex flex-col gap-3">
              <h3 className="font-display text-b16 font-semibold">{g.title}</h3>
              <ul className="grid grid-cols-3 gap-x-3 gap-y-4">
                {services
                  .filter((s) => s.group === g.id)
                  .map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={routes.service(category.slug, s.slug)}
                        scroll={false}
                        onClick={() => setOpen(false)}
                        className="state flex flex-col gap-2 rounded-lg"
                      >
                        <img src={s.image} alt="" className="aspect-[112/88] w-full rounded-lg bg-muted object-cover" />
                        <span className="text-b12">{s.name}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </Modal>
    </>
  );
}
