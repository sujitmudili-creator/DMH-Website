"use client";

import { useState } from "react";

/** Round share button: native share sheet where available, otherwise copies the link. */
export function ShareButton({
  title,
  path,
  icon = "/icons/services/share-18.svg",
  iconClass = "size-[18px]",
  className = "",
}: {
  title: string;
  /** Path to share; defaults to the current URL. */
  path?: string;
  icon?: string;
  iconClass?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = path ? new URL(path, window.location.origin).toString() : window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user closed the share sheet */
    }
  };
  return (
    <button
      type="button"
      onClick={share}
      aria-label={copied ? "Link copied" : `Share ${title}`}
      title={copied ? "Link copied" : undefined}
      className={`state flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-card ${className}`}
    >
      <img src={icon} alt="" className={iconClass} />
    </button>
  );
}
