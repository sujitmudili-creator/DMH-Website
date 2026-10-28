"use client";

import { useSyncExternalStore } from "react";
import type { SessionUser } from "@/lib/session";
import type { Bill, Slot } from "./pricing";

/**
 * Checkout choices that survive a trip to log in and back (slot, provider, coupon), plus the last
 * confirmed booking for /booking/confirmed. Kept in sessionStorage; every access is guarded.
 */
export type CheckoutChoices = { slot: Slot | null; providerId: string | null; coupon: string | null };
export type BookingSnapshot = {
  user: SessionUser;
  address: { label: string; line: string };
  slot: Slot;
  bill: Bill;
};

function createStore<T>(key: string, initial: T) {
  let value = initial;
  let loaded = false;
  const listeners = new Set<() => void>();
  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.sessionStorage.getItem(key);
      if (raw) value = { ...initial, ...JSON.parse(raw) };
    } catch {}
  };
  return {
    get: () => {
      load();
      return value;
    },
    set: (next: T) => {
      value = next;
      loaded = true;
      try {
        window.sessionStorage.setItem(key, JSON.stringify(next));
      } catch {}
      listeners.forEach((l) => l());
    },
    subscribe: (l: () => void) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    server: () => initial,
  };
}

const EMPTY: CheckoutChoices = { slot: null, providerId: null, coupon: null };
export const choicesStore = createStore<CheckoutChoices>("dmh.checkout", EMPTY);
export const bookingStore = createStore<BookingSnapshot | null>("dmh.lastBooking", null);

export function useChoices() {
  const choices = useSyncExternalStore(choicesStore.subscribe, choicesStore.get, choicesStore.server);
  const update = (patch: Partial<CheckoutChoices>) => choicesStore.set({ ...choicesStore.get(), ...patch });
  const reset = () => choicesStore.set(EMPTY);
  return { ...choices, update, reset };
}

export function useLastBooking() {
  return useSyncExternalStore(bookingStore.subscribe, bookingStore.get, bookingStore.server);
}

const noop = () => () => {};
/** False during SSR and hydration, true after: client-only state (cart, session) is ready. */
export function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
