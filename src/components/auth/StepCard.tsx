import type { ReactNode } from "react";

/**
 * Accordion step in the "Your details" pop up (W1.11 / W1.12 "Step card"): border/card hairline, radius 16.
 * open → number badge + title + chevron up, body below; done → green tick + title + summary; closed → badge + chevron down.
 * The header is a button when `onToggle` is given.
 */
export function StepCard({
  step,
  title,
  summary,
  state,
  onToggle,
  children,
}: {
  step: number;
  title: string;
  summary?: ReactNode;
  state: "open" | "closed" | "done";
  onToggle?: () => void;
  children?: ReactNode;
}) {
  const open = state === "open";
  const head = (
    <>
      {state === "done" ? (
        <img src="/icons/auth/tick-circle-26.svg" alt="Done" width={26} height={26} className="size-[26px] shrink-0" />
      ) : (
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-b12 font-semibold text-on-dark">{step}</span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
        <span className="font-display text-b16 leading-[1.3] font-semibold text-ink">{title}</span>
        {state === "done" && summary && <span className="truncate text-b14 text-ink-2">{summary}</span>}
      </span>
      <img
        src="/icons/auth/chevron-down-20.svg"
        alt=""
        width={20}
        height={20}
        className={`size-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      />
    </>
  );
  const headClass = "flex w-full items-center gap-3";
  return (
    <section className="flex w-full flex-col gap-6 rounded-xl border border-line bg-card p-4">
      {onToggle ? (
        <button type="button" onClick={onToggle} aria-expanded={open} className={`state cursor-pointer rounded-lg ${headClass}`}>
          {head}
        </button>
      ) : (
        <div className={headClass}>{head}</div>
      )}
      {open && children}
    </section>
  );
}

/** Equal or hugging choice chips (Gender, Save as): selected = brand/tint fill, border/choice-selected, brand text. */
export function ChoiceChips<T extends string>({
  label,
  options,
  value,
  onChange,
  equal = false,
  error,
}: {
  label: string;
  options: readonly T[];
  value: T | undefined;
  onChange: (v: T) => void;
  equal?: boolean;
  error?: string;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-b14 font-medium text-ink">{label}</legend>
      <div className="flex gap-2" role="radiogroup">
        {options.map((o) => {
          const on = o === value;
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(o)}
              className={`state flex cursor-pointer items-center justify-center rounded-lg border ${
                equal ? "h-[52px] min-w-0 flex-1 text-b16" : "h-[47px] px-4 text-b14"
              } ${on ? "border-choice-selected bg-tint font-semibold text-brand" : "border-field bg-card font-medium text-ink"}`}
            >
              {o}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-b12 text-danger">
          <img src="/icons/icon-info-circle-danger-16.svg" alt="" width={16} height={16} className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </fieldset>
  );
}
