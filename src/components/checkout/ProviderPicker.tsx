"use client";

import { CropImg } from "@/components/ui/CropImg";
import { previousProviders, type Provider } from "@/data/checkout";
import { Card, CardTitle } from "./parts";
import { providerSlotLabel } from "./pricing";
import { ScrollRow } from "./ScrollRow";

/** "Your previous provider" (W2.07): tap a chip to pick that person and their next slot; tap again to unpick (W2.10). */
export function ProviderPicker({
  selected,
  onSelect,
  className = "",
}: {
  selected: string | null;
  onSelect: (p: Provider | null) => void;
  className?: string;
}) {
  return (
    <Card raised className={`flex flex-col gap-4 p-4 ${className}`}>
      <CardTitle>Your previous provider</CardTitle>
      <ScrollRow label="Providers" className="gap-2">
        {previousProviders.map((p) => {
          const busy = !p.slot;
          const on = selected === p.id;
          return (
            <div key={p.id} role="listitem" className="shrink-0">
              <button
                type="button"
                disabled={busy}
                aria-pressed={on}
                onClick={() => onSelect(on ? null : p)}
                className={`state flex h-[131px] w-[97px] shrink-0 flex-col items-center gap-2 rounded-lg border px-1.5 py-3 disabled:cursor-not-allowed ${
                  on
                    ? "border-choice bg-tint"
                    : "cursor-pointer border-transparent bg-page"
                }`}
              >
                {p.sprite ? (
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-accent-soft">
                    <CropImg
                      src="/img/service-icons-3d.png"
                      crop={p.sprite}
                      className="absolute inset-0"
                    />
                  </span>
                ) : (
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-full">
                    <CropImg
                      src={p.photo!}
                      crop={p.crop}
                      className="absolute inset-0"
                    />
                    {busy && <span className="absolute inset-0 bg-ink/20" />}
                  </span>
                )}
                <span className="flex w-full flex-col gap-1.5">
                  <span
                    className={`font-display text-b12 font-medium ${busy ? "text-ink-3" : "text-ink"}`}
                  >
                    {p.name}
                  </span>
                  <span
                    aria-hidden
                    className="h-px w-full bg-[repeating-linear-gradient(90deg,var(--color-dash)_0_4px,transparent_4px_8px)]"
                  />
                  <span
                    className={`flex w-full items-center justify-center rounded-2xl border-[0.5px] px-1.5 py-0.5 text-[9px] leading-[1.5] font-semibold whitespace-nowrap uppercase ${
                      busy
                        ? "border-card bg-gradient-to-b from-muted to-card text-ink-3 shadow-[inset_0_1px_2px_rgb(68_68_68/0.07)]"
                        : "border-available/10 bg-gradient-to-b from-available-from to-available-to text-available shadow-[inset_0_1px_2px_rgb(3_184_87/0.07)]"
                    }`}
                  >
                    {p.slot
                      ? providerSlotLabel(p.slot.dayOffset, p.slot.time)
                      : "Busy"}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </ScrollRow>
    </Card>
  );
}
