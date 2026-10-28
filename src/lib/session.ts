"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Tiny placeholder session: the signed-in user lives in localStorage ("dmh.session").
 * Replace with the real auth API. Every storage access is wrapped in try/catch (private mode, blocked storage).
 */
export type SessionUser = {
  name: string;
  phone: string;
  /** Default visit address, shown at checkout. */
  address?: { label: string; line: string };
  /** Has booked before: checkout offers "Your previous provider" (W2.x repeat flow). */
  repeat?: boolean;
};

const KEY = "dmh.session";
const EVENT = "dmh:session";

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

function parse(raw: string | null): SessionUser | null {
  if (!raw) return null;
  try {
    const u = JSON.parse(raw) as SessionUser;
    return u && typeof u.phone === "string" ? u : null;
  } catch {
    return null;
  }
}

export function useSession() {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const user = parse(raw);

  const signIn = useCallback((u: SessionUser) => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(u));
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(KEY);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { user, signIn, signOut };
}
