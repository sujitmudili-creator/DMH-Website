"use client";

// Saved addresses kept in this browser (localStorage "dmh.addresses"), seeded from src/data/addresses.ts.
// Replace with the addresses API. Same pattern as lib/cart.ts: module store + useSyncExternalStore.
import { useSyncExternalStore } from "react";
import { seedAddresses, type SavedAddress } from "@/data/addresses";

const KEY = "dmh.addresses";
let list: SavedAddress[] = seedAddresses;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed)) list = parsed as SavedAddress[];
  } catch {
    /* storage blocked or bad JSON: keep the seed */
  }
}

function save(next: SavedAddress[]) {
  list = next;
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

const getSnapshot = () => {
  load();
  return list;
};

export function useAddresses() {
  return useSyncExternalStore(subscribe, getSnapshot, () => seedAddresses);
}

/** Add (no id yet) or replace by id. Returns the saved id. */
export function saveAddress(a: Omit<SavedAddress, "id"> & { id?: string }) {
  load();
  if (a.id && list.some((x) => x.id === a.id)) {
    save(list.map((x) => (x.id === a.id ? ({ ...x, ...a } as SavedAddress) : x)));
    return a.id;
  }
  const id = a.id ?? `addr-${Date.now().toString(36)}`;
  save([...list, { ...a, id } as SavedAddress]);
  return id;
}

export function deleteAddress(id: string) {
  load();
  save(list.filter((x) => x.id !== id));
}
