"use client";

import { useCallback, useEffect, useState } from "react";
import { demoUser } from "@/data/profile";
import { useSession } from "@/lib/session";

/**
 * useSession() plus demo sign-in: opening a profile page with ?demo=1 signs in the demo account (Rahul Sharma),
 * so a fresh browser shows the logged-in screens. If storage is blocked (private mode, embedded frames) the demo
 * user is still shown for this page view. ?demo=0 signs out.
 */
export function useProfileSession() {
  const { user, signIn, signOut } = useSession();
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    let flag: string | null = null;
    try {
      flag = new URLSearchParams(window.location.search).get("demo");
    } catch {}
    if (flag === "1") {
      setDemo(true);
      if (!user) signIn(demoUser);
    }
    if (flag === "0" && user) signOut();
    // Only on first load: later sign-outs must stick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const out = useCallback(() => {
    setDemo(false);
    signOut();
  }, [signOut]);

  return { user: user ?? (demo ? demoUser : null), signIn, signOut: out };
}
