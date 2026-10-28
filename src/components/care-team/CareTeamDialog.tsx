"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { routes } from "@/lib/routes";
import { CareTeamFlow, type CareView } from "./CareTeamFlow";

/**
 * In-place pop up for "Talk to our care team" (W8.02) or "Book a lab test" (`initialView="lab"`, W9.02).
 * Opens over the current page and closes back to it (e.g. W8.11 from checkout), without changing the URL.
 */
export function CareTeamDialog({
  open,
  onClose,
  initialView = "options",
}: {
  open: boolean;
  onClose: () => void;
  initialView?: CareView;
}) {
  // Mount only while open so every opening starts fresh at the first step.
  return open ? <CareTeamFlow initialView={initialView} onClose={onClose} /> : null;
}

/** A button that opens the care-team pop up in place. Style it like any button via `className`. */
export function CareTeamTrigger({
  initialView = "options",
  className = "",
  children,
  ...aria
}: {
  initialView?: CareView;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`cursor-pointer ${className}`} {...aria}>
        {children}
      </button>
      <CareTeamDialog open={open} onClose={() => setOpen(false)} initialView={initialView} />
    </>
  );
}

/** Route version (/care-team, /care-team/callback…, /lab-test): steps sync to the URL; close goes to `closeHref`. */
export function CareTeamRouteDialog({ initialView, closeHref = routes.home }: { initialView: CareView; closeHref?: string }) {
  const router = useRouter();
  return <CareTeamFlow initialView={initialView} syncUrl onClose={() => router.push(closeHref)} />;
}
