"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { detectedPlace, mapLabels, places, type Place } from "@/data/auth";
import { setVisitLocation } from "@/lib/location";
import { routes } from "@/lib/routes";
import { AuthButton, AuthOutlineButton } from "./AuthButton";
import { AuthDialog, CloseButton } from "./AuthDialog";
import { withQuery, writeDraft } from "./flow";
import { LocationErrorModal } from "./LocationErrorModal";
import { PlaceholderMap } from "./PlaceholderMap";
import { Spinner } from "./Spinner";

/** Base-map point under the pin with no drag: mobile (scale 1) and desktop (scale 1.95, 600×400 map area). */
const PIN = { mobile: { x: 196.5, y: 284, scale: 1 }, desktop: { x: 139.5, y: 222, scale: 1.95 } };
const MAX_DRAG = 160;
const MAP_LOAD_MS = 900;

type Mode = "onboarding" | "repeat";
type Problem = "unserved" | "denied" | null;

function nearestPlace(x: number, y: number): Place {
  let best = mapLabels[0];
  let d = Infinity;
  for (const l of mapLabels) {
    const dd = (l.x + 27 - x) ** 2 + (l.y + 9 - y) ** 2;
    if (dd < d) {
      d = dd;
      best = l;
    }
  }
  return { ...best.place, served: true };
}

/** Bolds the part of `title` that matches `q` (W1.14 "**Sector 18** Market"). */
function Highlight({ title, q }: { title: string; q: string }) {
  const i = q ? title.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <span className="font-medium">{title}</span>;
  return (
    <span className="font-medium">
      {title.slice(0, i)}
      <span className="font-semibold">{title.slice(i, i + q.length)}</span>
      {title.slice(i + q.length)}
    </span>
  );
}

/**
 * W1.13 / M1.12 · Set visit location (and W5.03 repeat), with its states as UI state:
 * W20.17 map loading, W1.14 / M1.13 searching, W5.05 area not served, W5.06 location access off.
 * Desktop: 600-wide pop up with a 400px map. Mobile: full-screen map with floating search and address card.
 * The map is a drawn placeholder; drag it (or use arrow keys) under the fixed pin.
 */
export function MapPicker({ mode, next, locate }: { mode: Mode; next: string; locate: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [place, setPlace] = useState<Place>(detectedPlace);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [problem, setProblem] = useState<Problem>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const closeHref = mode === "onboarding" ? withQuery(routes.address, { next }) : next;
  const close = () => router.push(closeHref);

  const locateMe = useCallback(() => {
    setLoading(true);
    setProblem(null);
    if (!("geolocation" in navigator)) {
      setLoading(false);
      setProblem("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        // Placeholder: no reverse geocoding yet, the demo address stands in for the GPS fix.
        setPlace(detectedPlace);
        setOffset({ x: 0, y: 0 });
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) setProblem("denied");
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  useEffect(() => {
    if (locate) {
      locateMe();
      return;
    }
    const t = window.setTimeout(() => setLoading(false), MAP_LOAD_MS);
    return () => window.clearTimeout(t);
  }, [locate, locateMe]);

  /** Re-reads which labelled area is under the pin after a drag / key move. */
  const settle = (o: { x: number; y: number }) => {
    const p = window.matchMedia("(min-width: 768px)").matches ? PIN.desktop : PIN.mobile;
    setPlace(nearestPlace(p.x - o.x / p.scale, p.y - o.y / p.scale));
  };

  const clamp = (v: number) => Math.max(-MAX_DRAG, Math.min(MAX_DRAG, v));

  const onPointerDown = (e: React.PointerEvent) => {
    if (loading) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    setSearching(false);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    if (!dragging && Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) > 3) setDragging(true);
    setOffset({ x: clamp(d.ox + e.clientX - d.x), y: clamp(d.oy + e.clientY - d.y) });
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    if (dragging) settle(offset);
    setDragging(false);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = { ArrowLeft: [20, 0], ArrowRight: [-20, 0], ArrowUp: [0, 20], ArrowDown: [0, -20] }[e.key];
    if (!step || loading) return;
    e.preventDefault();
    const o = { x: clamp(offset.x + step[0]), y: clamp(offset.y + step[1]) };
    setOffset(o);
    settle(o);
  };

  const pick = (p: Place) => {
    setPlace(p);
    setOffset({ x: 0, y: 0 });
    setSearching(false);
    setQuery("");
    if (!p.served) setProblem("unserved");
  };

  const openSearch = () => {
    setProblem(null);
    setSearching(true);
    window.setTimeout(() => searchRef.current?.focus(), 0);
  };

  const confirm = () => {
    if (loading) return;
    if (!place.served) return setProblem("unserved");
    setVisitLocation({ short: place.area, full: `${place.area}, ${place.city}` });
    if (mode === "onboarding") {
      writeDraft({ area: place.area, city: place.city, pincode: place.pincode });
      router.push(withQuery(routes.address, { next }));
    } else router.push(next);
  };

  const q = query.trim();
  const results = q ? places.filter((p) => `${p.title} ${p.line}`.toLowerCase().includes(q.toLowerCase())).slice(0, 4) : [];

  const currentLocationChip = (
    <button
      type="button"
      onClick={locateMe}
      className="state flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-card px-4 py-2 text-b14 font-semibold shadow-floating"
    >
      <img src="/icons/auth/gps-20.svg" alt="" width={20} height={20} className="size-5" />
      Current location
    </button>
  );

  return (
    <AuthDialog title="Set visit location" bare mobileFull width={600} onClose={close}>
      <div className="relative flex h-full flex-col md:h-auto">
        <div className="hidden items-center gap-2 px-6 pt-6 pb-4 md:flex">
          <h1 className="flex-1 font-display text-h24 font-semibold">Set visit location</h1>
          <CloseButton onClick={close} />
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden bg-map md:h-[400px] md:flex-none">
          {/* Map + drag surface */}
          <div
            className="absolute origin-top-left left-[calc(50%-196.5px+var(--dx))] top-[var(--dy)] md:top-[calc(-236.05px+var(--dy))] md:left-[calc(50%-272.02px+var(--dx))] md:scale-[1.95]"
            style={{ ["--dx" as string]: `${offset.x}px`, ["--dy" as string]: `${offset.y}px` }}
          >
            <PlaceholderMap hidden={loading} />
          </div>
          <div
            role="application"
            aria-label="Map. Drag or use the arrow keys to move the pin to the visit address."
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
            className={`absolute inset-0 touch-none outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--color-brand)] ${
              loading ? "cursor-progress" : dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          />

          {loading ? (
            <div role="status" className="pointer-events-none absolute top-[287px] left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-1/2">
              <Spinner className="size-8" />
              <span className="sr-only">Loading map</span>
            </div>
          ) : (
            <div
              className="pointer-events-none absolute top-[287px] left-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center gap-2 md:top-[203px]"
            >
              <div className={`flex flex-col items-center gap-0.5 rounded-lg bg-inverse px-3 py-2 text-b12 whitespace-nowrap text-on-dark transition-opacity md:hidden ${dragging ? "opacity-0" : ""}`}>
                <span className="font-semibold">Your visit will be here</span>
                <span className="opacity-70">Move the map to adjust</span>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src="/img/auth/location-pin.png"
                  alt=""
                  width={94}
                  height={92}
                  className={`-mb-[3px] h-[47px] w-12 object-contain transition-transform md:-mb-[6px] md:h-[92px] md:w-[94px] ${dragging ? "-translate-y-2" : ""}`}
                />
                <img src="/img/auth/pin-shadow.svg" alt="" width={31} height={12} className="h-1.5 w-4 md:h-[11.7px] md:w-[31.2px]" />
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 md:block">{currentLocationChip}</div>

          {/* Search: back + field on mobile, field on desktop; results drop down below (W1.14). */}
          <div className="absolute inset-x-4 top-3 flex flex-col gap-2 md:inset-x-6 md:top-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={close}
                aria-label="Back"
                className="state flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-card shadow-floating md:hidden"
              >
                <img src="/icons/auth/arrow-left-22.svg" alt="" width={22} height={22} className="size-[22px]" />
              </button>
              {searching ? (
                <div className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-lg border-[1.5px] border-field-selected bg-card px-4 shadow-floating">
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        e.preventDefault();
                        setSearching(false);
                      }
                      if (e.key === "Enter" && results[0]) pick(results[0]);
                    }}
                    placeholder="Search an area or address"
                    aria-label="Search an area or address"
                    aria-controls="place-results"
                    autoComplete="off"
                    className="h-full min-w-0 flex-1 bg-transparent text-b16 outline-none caret-brand placeholder:text-ink-3"
                  />
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      if (query) {
                        setQuery("");
                        searchRef.current?.focus();
                      } else setSearching(false);
                    }}
                    className="state flex size-[22px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-muted"
                  >
                    <img src="/icons/auth/close-grey-14.svg" alt="" width={14} height={14} className="size-3.5 -rotate-45" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openSearch}
                  className="state flex h-12 min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg border border-line bg-card px-4 text-left shadow-floating md:border-0"
                >
                  <span className="flex-1 truncate text-b16 text-ink-3">Search an area or address</span>
                  <img src="/icons/auth/search-22.svg" alt="" width={22} height={22} className="size-[22px]" />
                </button>
              )}
            </div>

            {searching && (
              <div id="place-results" className="flex flex-col gap-4 rounded-xl border border-line bg-card p-4 shadow-[0_2px_4px_rgb(0_0_0/0.12)]">
                <button type="button" onClick={() => (setSearching(false), locateMe())} className="state flex cursor-pointer items-start gap-2 rounded text-left">
                  <img src="/icons/auth/gps-link-22.svg" alt="" width={22} height={22} className="size-[22px]" />
                  <span className="flex-1 text-b14 font-medium text-link">Use my current location</span>
                </button>
                {q && results.length === 0 && (
                  <>
                    <hr className="border-line-3" />
                    <p className="text-b14 text-ink-2">No places found for “{q}”. Try an area, sector or landmark.</p>
                  </>
                )}
                {results.map((p, i) => (
                  <div key={p.title} className={i > 2 ? "contents md:hidden" : "contents"}>
                    <hr className="border-line-3" />
                    <button type="button" onClick={() => pick(p)} className="state flex cursor-pointer items-start gap-2 rounded text-left">
                      <img src="/icons/profile/location-22-ink.svg" alt="" width={22} height={22} className="size-[22px]" />
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-b14 text-ink">
                          <Highlight title={p.title} q={q} />
                        </span>
                        <span className="text-b12 text-ink-2">{p.line}</span>
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Address card: floating on mobile (with the chip above it), a section under the map on desktop. */}
        <div className="absolute inset-x-4 bottom-[max(16px,env(safe-area-inset-bottom))] flex flex-col items-center gap-4 md:static">
          <div className="md:hidden">{currentLocationChip}</div>
          <div className="flex w-full flex-col gap-4 rounded-xl bg-card p-4 shadow-floating md:rounded-none md:px-6 md:pt-4 md:pb-6 md:shadow-none">
            <div className="flex items-start gap-2" aria-live="polite">
              <img src="/icons/auth/location-24.svg" alt="" width={24} height={24} className="size-6 shrink-0" />
              {loading ? (
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="flex h-[23px] items-center md:h-[26px]">
                    <Skeleton className="h-2.5 w-[41px]" />
                  </span>
                  <span className="flex h-[21px] items-center">
                    <Skeleton className="h-2.5 w-[41px]" />
                  </span>
                  <span className="sr-only">Finding the address</span>
                </div>
              ) : (
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="font-display text-h18 font-semibold md:text-h20">{place.title}</p>
                  <p className="text-b14 text-ink-2">{place.line}</p>
                </div>
              )}
            </div>
            <AuthButton onClick={confirm} className="w-full" aria-disabled={loading || undefined}>
              Confirm location
            </AuthButton>
          </div>
        </div>
      </div>

      <LocationErrorModal
        open={problem === "unserved"}
        onClose={() => setProblem(null)}
        icon="/icons/auth/location-cross-32.svg"
        title="We don't serve this area yet"
        text="Try a different address nearby, or talk to our care team."
        secondary={
          <AuthOutlineButton className="w-full md:w-auto md:flex-1" onClick={() => router.push(routes.careTeam)}>
            Talk to our care team
          </AuthOutlineButton>
        }
        primary={
          <AuthButton size="md" className="w-full md:w-auto md:flex-1" onClick={openSearch}>
            Change location
          </AuthButton>
        }
      />
      <LocationErrorModal
        open={problem === "denied"}
        onClose={() => setProblem(null)}
        icon="/icons/auth/location-slash-32.svg"
        title="Location access is off"
        text="Allow location in your browser settings, or search for your address."
        secondary={
          <AuthOutlineButton className="w-full md:w-auto md:flex-1" onClick={locateMe}>
            Try again
          </AuthOutlineButton>
        }
        primary={
          <AuthButton size="md" className="w-full md:w-auto md:flex-1" onClick={openSearch}>
            Search your address
          </AuthButton>
        }
      />
    </AuthDialog>
  );
}
