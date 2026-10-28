"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { IconButton } from "./Button";

/** Section with a heading, prev/next arrows (desktop) and a horizontal scroller (swipe on mobile). */
export function Carousel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className={`flex flex-col gap-4 md:gap-6 ${className}`}>
      <div className="page flex items-end justify-between">
        <h2 className="font-display text-h20 font-semibold md:text-h24">{title}</h2>
        <div className="hidden gap-2 md:flex">
          <IconButton icon="/icons/icon-arrow-left.svg" label={`Previous: ${title}`} onClick={() => scroll(-1)} disabled={edge.start} />
          <IconButton icon="/icons/icon-arrow-right.svg" label={`Next: ${title}`} onClick={() => scroll(1)} disabled={edge.end} />
        </div>
      </div>
      {/* Scroller bleeds to the right edge; left padding keeps the first card on the content line. */}
      <div
        ref={ref}
        onScroll={update}
        className="scroller gap-3 md:gap-4"
        style={{
          paddingInline: "max(var(--gutter), calc((100% - 1120px) / 2))",
          scrollPaddingInline: "max(var(--gutter), calc((100% - 1120px) / 2))",
        }}
      >
        {children}
      </div>
    </section>
  );
}
