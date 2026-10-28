import type { CSSProperties, ReactNode } from "react";

const tones = {
  // Figma "Bar": text placeholders, #e9ebef, radius 4.
  bar: "bg-skeleton [--sk-hi:var(--color-muted)]",
  // Image / avatar / chip / button blocks: surface/muted.
  block: "bg-muted [--sk-hi:var(--color-card)]",
} as const;

/**
 * Loading placeholder (Figma section 20): a flat block with a soft shimmer sweep.
 * Size, shape and radius come from the caller:
 *   <Skeleton className="h-2.5 w-40" />                  text bar (radius 4)
 *   <Skeleton tone="block" className="size-12" round />  avatar
 *   <Skeleton tone="block" className="h-14 w-14 rounded-[10px]" /> image
 * Decorative only; wrap a screen in <SkeletonGroup> so assistive tech hears one "Loading" status.
 */
export function Skeleton({
  className = "",
  tone = "bar",
  round = false,
  style,
}: {
  className?: string;
  tone?: keyof typeof tones;
  /** Circle / pill. Otherwise radius 4 unless className sets one. */
  round?: boolean;
  style?: CSSProperties;
}) {
  const hasRadius = /(^|\s)rounded/.test(className);
  return (
    <span
      aria-hidden
      style={style}
      className={`relative block shrink-0 overflow-hidden ${tones[tone]} ${round ? "rounded-full" : hasRadius ? "" : "rounded-[4px]"} ${className}`}
    >
      <span className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent_0%,transparent_30%,var(--sk-hi)_50%,transparent_70%,transparent_100%)] bg-[length:200%_100%] opacity-70 motion-reduce:hidden" />
    </span>
  );
}

/** Wraps a skeleton screen: one polite "Loading…" status for screen readers. */
export function SkeletonGroup({ label = "Loading", className = "", children }: { label?: string; className?: string; children: ReactNode }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
