"use client";

import { useSyncExternalStore } from "react";

// Client-side memory of ratings given in this browser, so the booking page shows "You rated…" (W18.07)
// right after the rate pop up. Replace with the rating returned by the bookings API.
const key = (id: string) => `dmh:booking-rating:${id}`;
const EVENT = "dmh:booking-rating";

function read(id: string): number | null {
  try {
    const v = Number(window.localStorage.getItem(key(id)));
    return v >= 1 && v <= 5 ? v : null;
  } catch {
    return null;
  }
}

export function saveBookingRating(id: string, stars: number) {
  try {
    window.localStorage.setItem(key(id), String(stars));
  } catch {
    // Private mode / storage blocked: the page falls back to the API value.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Rating for a booking: the one saved in this browser, else `initial` from the data. */
export function useBookingRating(id: string, initial: number | null | undefined) {
  const local = useSyncExternalStore(
    subscribe,
    () => read(id),
    () => null,
  );
  return local ?? initial ?? null;
}
