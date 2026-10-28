"use client";

import { useId, useState } from "react";
import { Card } from "./BookingParts";

/** Cancellation policy card (W17.03 closed ↔ W17.04 open). */
export function CancellationPolicy({ cancelBy, fee, minutes }: { cancelBy: string; fee: string; minutes: number }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="state flex w-full cursor-pointer items-center gap-3 rounded-xl p-4 text-left"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-b14 font-semibold">Cancellation policy</span>
          <span className="text-b12">
            Cancel by {cancelBy} to avoid a <span className="font-semibold">{fee} fee</span>
          </span>
        </span>
        <img src="/icons/booking/chevron-down-16.svg" alt="" className={`size-[17.23px] shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div id={panelId} className="flex flex-col gap-4 px-4 pb-4">
          <div className="h-px bg-line-2" />
          <ul className="flex flex-col gap-2.5 text-b12 text-ink-2">
            <li className="flex items-start gap-2">
              <img src="/icons/booking/info-warning-16.svg" alt="" className="size-4 shrink-0" />
              <p>
                <span className="font-semibold text-ink">{fee} fee</span> if you cancel within {minutes} min of the visit
              </p>
            </li>
            <li className="flex items-start gap-2">
              <img src="/icons/booking/tick-success-16.svg" alt="" className="size-4 shrink-0" />
              <p>No fee if you cancel earlier than that</p>
            </li>
            <li className="flex items-start gap-2">
              <img src="/icons/booking/info-muted-16.svg" alt="" className="size-4 shrink-0" />
              <p>To cancel or reschedule, call our care team</p>
            </li>
          </ul>
        </div>
      )}
    </Card>
  );
}
