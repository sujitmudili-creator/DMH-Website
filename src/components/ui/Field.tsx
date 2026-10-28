import { useId, type ComponentProps, type ReactNode } from "react";

/**
 * Text field (Figma W1.11 / W1.12 inputs): 14 medium label, 8 gap, 52px input with a border/field hairline,
 * radius 12, 16px text. Focus → 1.5px border/field-selected. Error → status/danger border and a 12px
 * danger message with the info-circle icon. `hint` shows below in text/secondary when there is no error.
 */
export function Field({
  label,
  hint,
  error,
  prefix,
  suffix,
  className = "",
  id,
  ...input
}: {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  className?: string;
} & Omit<ComponentProps<"input">, "prefix">) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const describedBy = error || hint ? `${fieldId}-msg` : undefined;
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={fieldId} className="text-b14 font-medium text-ink">
          {label}
        </label>
      )}
      <div
        className={`flex h-[52px] items-center gap-2 rounded-lg border bg-card px-4 transition-[border-color,box-shadow] ${
          error
            ? "border-danger"
            : "border-field focus-within:border-field-selected focus-within:shadow-[inset_0_0_0_0.5px_var(--color-field-selected)]"
        }`}
      >
        {prefix && <span className="text-b16 text-ink">{prefix}</span>}
        <input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...input}
          className="h-full min-w-0 flex-1 bg-transparent text-b16 text-ink outline-none placeholder:text-ink-3 disabled:text-ink-3"
        />
        {suffix}
      </div>
      {error ? (
        <p id={describedBy} className="flex items-center gap-1 text-b12 text-danger">
          <img src="/icons/icon-info-circle-danger-16.svg" alt="" className="size-4 shrink-0" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={describedBy} className="text-b12 text-ink-2">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
