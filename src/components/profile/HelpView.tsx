"use client";

import { useState } from "react";
import { careLine } from "@/data/care-team";
import { helpFaqs } from "@/data/profile";

/** Help and support (W14.02 / M14.02): care team card with Call us, then the FAQ accordion (first one open). */
export function HelpView() {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4 rounded-lg border border-line p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-tint">
            <img src="/icons/profile/headset-24.svg" alt="" className="size-6" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h2 className="text-b16 font-semibold">Talk to our care team</h2>
            <p className="text-b14 text-ink-2">Get help with a booking or a service</p>
          </div>
        </div>
        <a
          href={careLine.tel}
          aria-label={`Call us on ${careLine.display}`}
          className="state-dark flex h-[52px] items-center justify-center rounded-lg bg-brand text-b16 font-semibold text-on-dark"
        >
          Call us
        </a>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-h20 font-semibold">Questions families ask</h2>
        <ul className="flex flex-col gap-2">
          {helpFaqs.map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q} className="rounded-lg border border-line bg-[linear-gradient(196deg,var(--color-tint-2)_0%,var(--color-faq)_38%)]">
                <button
                  type="button"
                  onClick={() => setOpen(on ? -1 : i)}
                  aria-expanded={on}
                  className="state flex w-full cursor-pointer items-center gap-3 rounded-lg p-4 text-left text-b14 font-semibold"
                >
                  <span className="flex-1">{f.q}</span>
                  <img src="/icons/icon-arrow-down-18.svg" alt="" className={`size-[18px] shrink-0 transition-transform ${on ? "rotate-180" : ""}`} />
                </button>
                {on && <p className="-mt-2 px-4 pb-4 text-b14 text-ink-2">{f.a}</p>}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
