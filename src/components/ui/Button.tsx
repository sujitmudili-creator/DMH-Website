import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "pill-light" | "chip";

const variants: Record<Variant, string> = {
  // Brand fill, 48 high, radius 12 (e.g. "Talk to our care team").
  primary: "state-dark h-12 rounded-lg bg-brand px-6 text-b14 font-semibold text-on-dark",
  // Hairline field border, 40 high (e.g. location picker).
  outline: "state h-10 rounded-lg border border-field px-4 text-b14 font-medium text-ink",
  // White pill on the blue hero ("Book a visit").
  "pill-light": "state rounded-full bg-card px-4 py-2 text-b12 font-semibold text-link",
  // White pill with card border ("Which service do I need?").
  chip: "state h-10 rounded-full border border-line bg-card px-4 text-b14 font-medium text-ink",
};

type Common = { variant?: Variant; className?: string; children: ReactNode };

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link {...rest} className={`inline-flex items-center justify-center gap-2 whitespace-nowrap ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  type = "button",
  ...rest
}: Common & ComponentProps<"button">) {
  return (
    <button
      {...rest}
      type={type}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

/** 40×40 round icon button with a field or card border. */
export function IconButton({
  icon,
  label,
  className = "",
  ...rest
}: { icon: string; label: string; className?: string } & ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label={label}
      {...rest}
      className={`state inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-card disabled:cursor-default disabled:opacity-40 ${className}`}
    >
      <img src={icon} alt="" className="size-5" />
    </button>
  );
}
