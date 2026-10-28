"use client";

import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { profileMenu } from "@/data/profile";
import { routes } from "@/lib/routes";
import { LogoutDialog } from "./LogoutDialog";
import type { SessionUser } from "@/lib/session";

/** 18px chevron pointing right (Figma rotates arrow-down by -90°). */
export function Chevron({ className = "" }: { className?: string }) {
  return <img src="/icons/icon-arrow-down-18.svg" alt="" className={`size-[18px] shrink-0 -rotate-90 ${className}`} />;
}

/**
 * W11.01 "Profile menu": account row, four links and Log out (red), in a 320 card.
 * Used as the desktop nav dropdown. `onNavigate` closes the dropdown when a row is picked.
 */
export function ProfileMenuCard({
  user,
  onSignOut,
  onNavigate,
}: {
  user: SessionUser;
  onSignOut: () => void;
  onNavigate?: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="flex w-80 flex-col overflow-hidden rounded-xl border border-line bg-card shadow-menu">
      <Link href={routes.personalDetails} onClick={onNavigate} className="state flex items-center gap-4 p-4">
        <span className="flex aspect-square min-w-px flex-1 items-center justify-center">
          <img src="/icons/profile/avatar.svg" alt="" className="size-[55.5px]" />
        </span>
        <span className="flex min-w-0 shrink flex-col gap-1">
          <span className="truncate font-display text-h18 font-semibold">{user.name || "Your account"}</span>
          <span className="text-b14 text-ink-2">{user.phone}</span>
        </span>
        <Chevron />
      </Link>
      {profileMenu.map((item) => (
        <Link key={item.href} href={item.href} onClick={onNavigate} className="state flex items-center gap-2 rounded-lg p-4">
          <img src={item.icon} alt="" className="size-[22px] shrink-0" />
          <span className="min-w-0 flex-1 text-b16">{item.label}</span>
          <Chevron />
        </Link>
      ))}
      <button type="button" onClick={() => setConfirm(true)} className="state flex cursor-pointer items-center gap-2 rounded-lg p-4 text-left">
        <img src="/icons/profile/logout-20.svg" alt="" className="size-5 shrink-0" />
        <span className="min-w-0 flex-1 text-b16 text-danger">Log out</span>
        <Chevron />
      </button>
      <LogoutDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          onNavigate?.();
          onSignOut();
        }}
      />
    </div>
  );
}

/** W10.01 "Profile menu · Logged out": prompt + Log in, in a 320 card. */
export function LoggedOutMenuCard({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex w-80 flex-col gap-4 rounded-xl border border-line bg-card p-5 shadow-menu">
      <div className="flex flex-col gap-1">
        <p className="text-b16 font-semibold">Log in to book a visit</p>
        <p className="text-b14 text-ink-2">See your bookings and saved addresses</p>
      </div>
      <ButtonLink href={routes.login} onClick={onNavigate} className="w-full">
        Log in
      </ButtonLink>
    </div>
  );
}
