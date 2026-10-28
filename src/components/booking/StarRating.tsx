"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Five rating stars (Figma component "Star": On = orange gradient, Off = surface/muted + border/field).
 * Web hover previews On at 60% on every star up to the pointer. Each star either links (`hrefFor`, the
 * booking card → rate pop up) or selects (`onSelect`, inside the pop up).
 */
export function StarRating({
  value,
  size,
  hrefFor,
  onSelect,
  label = "Rate your visit",
}: {
  value: number;
  size: 32 | 40;
  hrefFor?: (stars: number) => string;
  onSelect?: (stars: number) => void;
  label?: string;
}) {
  const [hover, setHover] = useState(0);
  const sizeClass = size === 40 ? "size-10" : "size-8";

  return (
    <div role="radiogroup" aria-label={label} className="flex items-start gap-3" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = hover ? n <= hover : n <= value;
        const preview = hover > 0 && n <= hover && n > value;
        const img = (
          <img
            src={on ? "/icons/booking/star-on-40.svg" : "/icons/booking/star-off.svg"}
            alt=""
            className={`${sizeClass} transition-opacity ${preview ? "opacity-60" : ""}`}
          />
        );
        const common = {
          role: "radio",
          "aria-checked": n === value,
          "aria-label": `${n} star${n > 1 ? "s" : ""}`,
          onMouseEnter: () => setHover(n),
          className: `block shrink-0 cursor-pointer rounded-full ${sizeClass}`,
        } as const;
        return hrefFor ? (
          <Link key={n} href={hrefFor(n)} scroll={false} {...common}>
            {img}
          </Link>
        ) : (
          <button key={n} type="button" onClick={() => onSelect?.(n)} {...common}>
            {img}
          </button>
        );
      })}
    </div>
  );
}
