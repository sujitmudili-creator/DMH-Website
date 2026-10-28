import type { ComponentProps, ReactNode } from "react";

/** Desktop header close: 40px round, border/card hairline, 26px "add" icon turned 45°. */
export function HeaderClose({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className={`state size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-card ${className}`}
    >
      <img src="/icons/icon-add-26.svg" alt="" className="size-[26px] -rotate-45" />
    </button>
  );
}

/** Mobile sheet close: white 40px circle floating 16px above the sheet (Shadow/Floating). */
export function FloatingClose({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute -top-14 right-4 md:hidden">
      <button
        type="button"
        onClick={onClick}
        aria-label="Close"
        className="state flex size-10 cursor-pointer items-center justify-center rounded-full bg-card shadow-floating"
      >
        <img src="/icons/icon-add-20.svg" alt="" className="size-5 -rotate-45" />
      </button>
    </div>
  );
}

/** Pop-up title block: Heading 20 on mobile, Web/Heading 24 on desktop, Body 14 secondary below. */
export function DialogTitle({ title, subtitle, className = "" }: { title: ReactNode; subtitle?: ReactNode; className?: string }) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col gap-1 ${className}`}>
      <h2 tabIndex={-1} className="font-display text-h20 font-semibold outline-none md:text-h24">{title}</h2>
      {subtitle && <p className="text-b14 text-ink-2">{subtitle}</p>}
    </div>
  );
}

/** Option chevron: the 18px "arrow-down" icon turned to point right, or up when its row is open. */
export function Chevron({ open = false }: { open?: boolean }) {
  return (
    <img
      src="/icons/icon-arrow-down-18.svg"
      alt=""
      className={`size-[18px] shrink-0 transition-transform duration-150 ${open ? "rotate-180" : "-rotate-90"}`}
    />
  );
}

/** Full-width 52px brand button used for the main action in these pop ups. */
export function PrimaryAction({ className = "", children, ...rest }: ComponentProps<"button">) {
  return (
    <button
      type="submit"
      {...rest}
      className={`state-dark flex h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand text-b16 font-semibold text-on-dark disabled:cursor-wait disabled:opacity-70 ${className}`}
    >
      {children}
    </button>
  );
}

/** Two-way choice (AM/PM, gender): tint fill and choice-selected border when picked. */
export function Choice({
  selected,
  className = "",
  children,
  ...rest
}: { selected: boolean } & ComponentProps<"button">) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      {...rest}
      className={`state flex cursor-pointer items-center justify-center rounded-lg ${
        selected ? "border-[1.5px] border-choice-selected bg-tint text-brand" : "border border-field bg-card text-ink"
      } ${className}`}
    >
      {children}
    </button>
  );
}
