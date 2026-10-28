"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { routes } from "@/lib/routes";
import { LoggedOutMenuCard, ProfileMenuCard } from "./ProfileMenu";
import { useProfileSession } from "./useProfileSession";

const buttonClass = "state flex size-10 cursor-pointer items-center justify-center rounded-full border border-field";

/**
 * Nav profile button. Desktop (md+): opens the profile menu as a dropdown (W11.01, logged out W10.01) under the
 * button, right-aligned to the content edge. Mobile: links to the full-page profile (M11.01 / M10.01).
 */
export function ProfileNavButton() {
  const { user, signOut } = useProfileSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      // Clicks inside the log-out dialog (a top-layer <dialog>) are still inside `ref`.
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("dialog[open]")) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <div className="md:hidden">
        <Link href={routes.profile} aria-label="Profile" className={buttonClass}>
          <img src="/icons/icon-profile.svg" alt="" className="size-5" />
        </Link>
      </div>
      <div ref={ref} className="relative hidden md:block">
        <button type="button" aria-label="Profile" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)} className={buttonClass}>
          <img src="/icons/icon-profile.svg" alt="" className="size-5" />
        </button>
        {open && (
          <div className="absolute right-0 top-12 z-40">
            {user ? (
              <ProfileMenuCard
                user={user}
                onNavigate={close}
                onSignOut={() => {
                  signOut();
                  router.push(routes.home);
                }}
              />
            ) : (
              <LoggedOutMenuCard onNavigate={close} />
            )}
          </div>
        )}
      </div>
    </>
  );
}
