"use client";

import Link from "next/link";
import { upsells } from "@/data/checkout";
import { Card, CardTitle, Dashed } from "./parts";
import { inr } from "./pricing";
import { ScrollRow } from "./ScrollRow";

/** "You might also need" (W1.08 / W2.11): Add puts the service on the booking, the button turns into "Added". */
export function Upsell({
  addedIds,
  onToggle,
  className = "",
}: {
  addedIds: string[];
  onToggle: (id: string) => void;
  className?: string;
}) {
  return (
    <Card className={`flex flex-col gap-4 p-4 ${className}`}>
      <CardTitle>You might also need</CardTitle>
      <ScrollRow label="Suggested services" className="gap-3">
        {upsells.map((u) => {
          const added = addedIds.includes(u.id);
          return (
            <div
              key={u.id}
              role="listitem"
              className="flex w-[calc(50%-6px)] shrink-0 flex-col gap-3 rounded-lg bg-page px-2 pt-2 pb-3"
            >
              <img src={u.image} alt="" className="h-28 w-full rounded-lg object-cover" />
              <div className="flex flex-col gap-1">
                <p className="font-display text-b14 leading-[1.3] font-semibold">{u.name}</p>
                <p className="flex items-center gap-1 text-b12 text-ink-2">
                  <img src="/icons/checkout/star-12.svg" alt="" className="size-3" />
                  {u.rating}
                </p>
                <Link href={u.href} className="self-start text-b12 font-semibold text-brand hover:underline">
                  View Details
                </Link>
              </div>
              <Dashed />
              <div className="flex items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-b16 font-semibold">{inr(u.price)}</p>
                  <s className="text-b12 text-ink-2">{inr(u.mrp)}</s>
                </div>
                <button
                  type="button"
                  onClick={() => onToggle(u.id)}
                  aria-pressed={added}
                  aria-label={added ? `Remove ${u.name}` : `Add ${u.name}`}
                  className={`flex h-[39px] min-w-0 flex-1 cursor-pointer items-center justify-center gap-0.5 rounded-md text-b14 font-semibold ${
                    added ? "state-dark bg-success text-on-dark" : "state border border-line bg-card text-link"
                  }`}
                >
                  {!added && <img src="/icons/services/add-16.svg" alt="" className="size-4" />}
                  {added ? "Added" : "Add"}
                </button>
              </div>
            </div>
          );
        })}
      </ScrollRow>
    </Card>
  );
}
