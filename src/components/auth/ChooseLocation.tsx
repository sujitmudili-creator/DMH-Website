"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { savedAddresses } from "@/data/auth";
import { setVisitLocation } from "@/lib/location";
import { routes } from "@/lib/routes";
import { AuthDialog } from "./AuthDialog";
import { withQuery } from "./flow";
import { Spinner } from "./Spinner";

const rowClass = "state flex w-full cursor-pointer items-center gap-4 rounded text-left";

function Chevron() {
  return <img src="/icons/icon-arrow-down-18.svg" alt="" width={18} height={18} className="size-[18px] shrink-0 -rotate-90" />;
}

/**
 * W5.02 / M5.02 · Choose location, with W20.16 "Detecting your location" as UI state.
 * Current location → asks the browser, then opens the map (W5.03); a saved address sets the location and closes.
 */
export function ChooseLocation({ next }: { next: string }) {
  const router = useRouter();
  const [detecting, setDetecting] = useState(false);

  const useCurrent = () => {
    if (detecting) return;
    setDetecting(true);
    const go = () => router.push(withQuery(routes.visitLocation, { mode: "repeat", locate: "1", next }));
    if (!("geolocation" in navigator)) return go();
    navigator.geolocation.getCurrentPosition(go, go, { timeout: 10000, maximumAge: 60000 });
  };

  return (
    <AuthDialog title="Choose your location" tight onClose={() => router.push(next)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 rounded-lg border border-line p-4">
          <button type="button" onClick={useCurrent} aria-busy={detecting || undefined} className={rowClass}>
            <span className="flex min-w-0 flex-1 items-center gap-2" aria-live="polite">
              {detecting ? (
                <Spinner className="size-5" />
              ) : (
                <img src="/icons/auth/gps-link-22.svg" alt="" width={22} height={22} className="size-[22px] shrink-0" />
              )}
              <span className="flex-1 text-b14 font-medium text-link">{detecting ? "Detecting your location" : "Use my current location"}</span>
            </span>
            <Chevron />
          </button>
          <hr className="border-line-3" />
          <Link href={routes.addAddress} className={rowClass}>
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <img src="/icons/auth/add-link-22.svg" alt="" width={22} height={22} className="size-[22px] shrink-0" />
              <span className="flex-1 text-b14 font-medium text-link">Add new address</span>
            </span>
            <Chevron />
          </Link>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-b16 leading-[1.3] font-semibold">Your saved addresses</h2>
          {savedAddresses.map((a) => (
            <div key={a.id} className="relative">
              <button
                type="button"
                onClick={() => {
                  setVisitLocation({ short: a.short, full: a.full });
                  router.push(next);
                }}
                className="state flex w-full cursor-pointer items-start gap-4 rounded-lg border border-line bg-linear-to-l from-tint-2 to-card p-4 pr-14 text-left"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <img
                    src={a.label === "Home" ? "/icons/auth/home-link-22.svg" : "/icons/auth/location-link-22.svg"}
                    alt=""
                    width={22}
                    height={22}
                    className="size-[22px]"
                  />
                </span>
                <span className="flex min-w-0 max-w-[231px] flex-1 flex-col gap-3">
                  <span className="flex flex-col gap-1">
                    <span className="text-b16 font-semibold">{a.label}</span>
                    <span className="text-b14 text-ink-2">{a.line}</span>
                    <span className="text-b14 text-ink-2">
                      Phone number: <span className="font-semibold text-ink">{a.phone}</span>
                    </span>
                  </span>
                  <span className="text-b12 text-ink-2">{a.lastBooked}</span>
                </span>
              </button>
              <Link
                href={routes.addresses}
                aria-label={`Manage ${a.label} address`}
                className="state absolute top-[15px] right-[15px] flex size-9 items-center justify-center rounded-full"
              >
                <img src="/icons/auth/more-36.svg" alt="" width={36} height={36} className="size-9 rotate-90" />
              </Link>
            </div>
          ))}
        </section>
      </div>
    </AuthDialog>
  );
}
