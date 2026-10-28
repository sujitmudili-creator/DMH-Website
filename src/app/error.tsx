"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect, useSyncExternalStore } from "react";
import { ErrorState, errorActionClass } from "@/components/errors/ErrorState";

function subscribe(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

/**
 * Route error boundary: W15.01 "You're offline" when the browser has no connection,
 * otherwise W15.02 "Something went wrong". Try again re-fetches the route and re-renders it.
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );

  useEffect(() => {
    console.error(error);
  }, [error]);

  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <ErrorState
      kind={online ? "failed" : "offline"}
      careLink={online}
      action={
        <button type="button" onClick={retry} className={errorActionClass}>
          Try again
        </button>
      }
    />
  );
}
