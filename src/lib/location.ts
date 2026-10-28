"use client";

import { useCallback, useSyncExternalStore } from "react";
import { currentLocation as fallback } from "@/data/session";

/**
 * The visit location the user picked (W5.02 Choose location / W1.13 map). Placeholder: localStorage
 * "dmh.location", falling back to `currentLocation` in data/session. Replace with the real API.
 */
export type VisitLocation = { short: string; full: string };

const KEY = "dmh.location";
const EVENT = "dmh:location";

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(EVENT, cb);
  };
}

function parse(raw: string | null): VisitLocation {
  if (!raw) return fallback;
  try {
    const v = JSON.parse(raw) as VisitLocation;
    return v && typeof v.short === "string" && typeof v.full === "string" ? v : fallback;
  } catch {
    return fallback;
  }
}

export function setVisitLocation(v: VisitLocation) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(v));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function useVisitLocation() {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const location = parse(raw);
  const set = useCallback((v: VisitLocation) => setVisitLocation(v), []);
  return { location, setLocation: set };
}
