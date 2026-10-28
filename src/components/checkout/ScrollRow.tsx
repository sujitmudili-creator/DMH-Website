"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** Horizontal scroller with the small pill indicator under it (shown only when the row overflows). */
export function ScrollRow({ children, className = "", label }: { children: ReactNode; className?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ size: number; pos: number } | null>(null);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (el.scrollWidth <= el.clientWidth + 1) return setThumb(null);
    const size = el.clientWidth / el.scrollWidth;
    setThumb({ size, pos: (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * (1 - size) });
  }, []);

  useEffect(() => {
    update();
    const ro = new ResizeObserver(update);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [update]);

  return (
    <>
      <div ref={ref} onScroll={update} role="list" aria-label={label} className={`scroller ${className}`}>
        {children}
      </div>
      {thumb && (
        <div aria-hidden className="relative mx-auto h-1 w-[79px] overflow-hidden rounded-xl bg-muted">
          <div className="absolute top-0 h-1 rounded-xl bg-thumb" style={{ width: `${thumb.size * 100}%`, left: `${thumb.pos * 100}%` }} />
        </div>
      )}
    </>
  );
}
