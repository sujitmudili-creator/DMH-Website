"use client";

import { useState } from "react";

/** App bar "Share" (M19.02): native share sheet, else copy the link. */
export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // User closed the share sheet.
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label={copied ? "Link copied" : "Share"}
      className="state flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-card"
    >
      <img src="/icons/icon-share.svg" alt="" className="size-5" />
    </button>
  );
}
