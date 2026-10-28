"use client";

// Tiny client cart shared by service pages and checkout. No provider needed:
// a module-level store synced to localStorage, read with useSyncExternalStore.
import { useCallback, useSyncExternalStore } from "react";

export type CartAddOn = { id: string; name: string; price: number };
export type CartItem = {
  category: string;
  slug: string;
  name: string;
  price: number;
  addOns: CartAddOn[];
};

const KEY = "dmh-cart";
const EMPTY: CartItem[] = [];
let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed)) items = parsed as CartItem[];
  } catch {
    /* storage blocked or bad JSON: start empty */
  }
}

function save(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    loaded = false;
    load();
    l();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return items;
}

const getServerSnapshot = () => EMPTY;

const same = (a: { category: string; slug: string }, b: { category: string; slug: string }) =>
  a.category === b.category && a.slug === b.slug;

/** Add or replace a service (same category + slug replaces, so add-on changes update it). */
export function addToCart(item: CartItem) {
  load();
  const i = items.findIndex((x) => same(x, item));
  save(i === -1 ? [...items, item] : items.map((x, j) => (j === i ? item : x)));
}

export function removeFromCart(category: string, slug: string) {
  load();
  save(items.filter((x) => !same(x, { category, slug })));
}

export function clearCart() {
  save([]);
}

export const cartTotal = (list: CartItem[]) =>
  list.reduce((sum, x) => sum + x.price + x.addOns.reduce((s, a) => s + a.price, 0), 0);

export function useCart() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const has = useCallback(
    (category: string, slug: string) => list.some((x) => same(x, { category, slug })),
    [list],
  );
  return {
    items: list,
    add: addToCart,
    remove: removeFromCart,
    clear: clearCart,
    has,
    total: cartTotal(list),
  };
}
