"use client";

import { useCallback, useSyncExternalStore } from "react";
import { defaultRecentSearches } from "@/data/services";
import { routes } from "@/lib/routes";

// Recent searches, kept per browser (localStorage, wrapped: storage can be blocked).

const KEY = "dmh-recent-searches";
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    cache = Array.isArray(parsed) ? parsed : defaultRecentSearches;
  } catch {
    cache = defaultRecentSearches;
  }
  return cache;
}

export function rememberSearch(q: string) {
  const term = q.trim();
  if (!term) return;
  const next = [term, ...read().filter((x) => x.toLowerCase() !== term.toLowerCase())].slice(0, 6);
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function useRecentSearches() {
  return useSyncExternalStore(
    useCallback((l: () => void) => {
      listeners.add(l);
      return () => listeners.delete(l);
    }, []),
    read,
    () => defaultRecentSearches,
  );
}

export const resultsHref = (q: string) => `${routes.search}?q=${encodeURIComponent(q.trim())}`;
