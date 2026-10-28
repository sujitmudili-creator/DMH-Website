"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

/** Dark toast (surface/inverse, radius 12) pinned bottom-centre, above sticky bottom bars. */
function Toast({ icon, children, onRetry, className = "" }: { icon?: string; children: ReactNode; onRetry: () => void; className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-4 bottom-[max(24px,env(safe-area-inset-bottom))] z-50 mx-auto flex items-center gap-3 rounded-lg bg-inverse px-4 py-3 text-b14 text-on-dark md:bottom-8 ${className}`}
    >
      {icon && <img src={icon} alt="" className="size-5 shrink-0" />}
      <p className="min-w-0 flex-1">{children}</p>
      <button type="button" onClick={onRetry} className="shrink-0 cursor-pointer font-semibold underline underline-offset-2">
        Retry
      </button>
    </div>
  );
}

function subscribe(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

/**
 * W15.04 / M15.04 "You're offline" toast. Mounted once in the root layout; shows while the browser
 * reports no connection. Retry re-fetches the current route once the connection is back.
 */
export function OfflineToast() {
  const router = useRouter();
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!online) setWasOffline(true);
    else if (wasOffline) {
      // Connection is back: refresh what failed to load while offline.
      router.refresh();
      setWasOffline(false);
    }
  }, [online, wasOffline, router]);

  if (online) return null;
  return (
    <Toast icon="/icons/error/cloud-cross-20.svg" onRetry={() => navigator.onLine && router.refresh()} className="h-14 py-0 md:w-[420px]">
      <span className="font-medium">You&apos;re offline</span>
    </Toast>
  );
}

/**
 * W20.19 / M20.19 "Taking longer than usual" toast. Drop it into a `loading.tsx` skeleton: it appears
 * only if the skeleton is still showing after `delay` ms. Retry reloads the page.
 */
export function SlowNetworkToast({ delay = 8000 }: { delay?: number }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  if (!slow) return null;
  return (
    <Toast onRetry={() => window.location.reload()} className="md:w-[361px]">
      Taking longer than usual. Check your internet.
    </Toast>
  );
}
