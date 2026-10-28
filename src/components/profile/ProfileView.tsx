"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { profileQuickActions, profileSections } from "@/data/profile";
import { routes } from "@/lib/routes";
import { LogoutDialog } from "./LogoutDialog";
import { Chevron } from "./ProfileMenu";
import { useProfileSession } from "./useProfileSession";

/**
 * Full-page profile: M11.01 "Profile" (logged in) and M10.01 "Profile · Logged out".
 * On desktop the same page sits in the 640 profile column under the nav; the nav button also opens it as a dropdown.
 */
export function ProfileView() {
  const { user, signOut } = useProfileSession();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-[672px] flex-col pb-12 md:pt-10">
      {/* Account header: gradient top with back, avatar, name. */}
      <div className="flex flex-col items-center gap-3 bg-linear-to-b from-accent-soft to-card pb-6 pt-3 md:rounded-2xl md:pt-6">
        <div className="flex w-full px-4 md:hidden">
          <Link href={routes.home} aria-label="Back" className="state flex size-10 items-center justify-center rounded-full border border-line bg-card">
            <img src="/icons/icon-back.svg" alt="" className="size-5" />
          </Link>
        </div>
        <img src="/icons/profile/avatar-96.svg" alt="" className="size-[83px] md:size-24" />
        {user ? (
          <div className="flex flex-col items-center">
            <h1 className="font-display text-h20 font-semibold">{user.name || "Your account"}</h1>
            <p className="text-b14 text-ink-2">{user.phone}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center px-4 text-center">
            <h1 className="font-display text-h20 font-semibold">Log in to book a visit</h1>
            <p className="text-b14 text-ink-2">See your bookings and saved addresses</p>
          </div>
        )}
      </div>

      {!user ? (
        <div className="px-4">
          <ButtonLink href={routes.login} className="h-[52px] w-full text-b16">
            Log in
          </ButtonLink>
        </div>
      ) : (
        <div className="flex flex-col gap-6 px-4">
          <div className="flex gap-3">
            {profileQuickActions.map((a) => (
              <Link key={a.label} href={a.href} className="state flex min-w-0 flex-1 flex-col items-center gap-3 rounded-2xl border border-line py-4">
                <img src={a.icon} alt="" className="size-7" />
                <span className="text-b14 font-semibold">{a.label}</span>
              </Link>
            ))}
          </div>

          {profileSections.map((section) => (
            <section key={section.title} className="flex flex-col gap-2">
              <h2 className="font-display text-b16 font-semibold">{section.title}</h2>
              <div className="flex flex-col overflow-hidden rounded-lg border border-line">
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="state flex items-center gap-4 p-4"
                  >
                    <span className="flex min-w-0 flex-1 items-center gap-2">
                      <img src={item.iconInk} alt="" className="size-[22px] shrink-0" />
                      <span className="truncate text-b14 font-medium">{item.label}</span>
                    </span>
                    <Chevron />
                  </Link>
                ))}
              </div>
            </section>
          ))}

          <button
            type="button"
            onClick={() => setConfirm(true)}
            className="state flex cursor-pointer items-center justify-center rounded-lg bg-danger-fill p-4 text-b16 font-medium text-danger"
          >
            Log out
          </button>
          <LogoutDialog
            open={confirm}
            onClose={() => setConfirm(false)}
            onConfirm={() => {
              setConfirm(false);
              signOut();
              router.push(routes.home);
            }}
          />
        </div>
      )}
    </div>
  );
}
