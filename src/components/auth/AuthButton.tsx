import type { ComponentProps, ReactNode } from "react";
import { Spinner } from "./Spinner";

/**
 * 52px (48 with size="md") primary button used across the log in / onboarding dialogs (Figma "Button": brand fill, radius 12,
 * Body 16 SemiBold). Disabled = surface/muted with text/disabled (W1.10 "Verify"), loading = spinner + label (W20.12).
 */
export function AuthButton({
  loading = false,
  size = "lg",
  className = "",
  children,
  type = "button",
  disabled,
  ...rest
}: { loading?: boolean; size?: "lg" | "md"; className?: string; children: ReactNode } & ComponentProps<"button">) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex ${size === "lg" ? "h-[52px]" : "h-12"} cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg px-6 text-b16 font-semibold ${
        disabled && !loading ? "cursor-not-allowed bg-muted text-ink-3" : "state-dark bg-brand text-on-dark"
      } ${loading ? "cursor-progress" : ""} ${className}`}
    >
      {loading && <Spinner className="size-5" light />}
      {children}
    </button>
  );
}

/** Secondary 48px button with a border/card hairline (W5.05 "Talk to our care team"). */
export function AuthOutlineButton({ className = "", children, type = "button", ...rest }: { className?: string; children: ReactNode } & ComponentProps<"button">) {
  return (
    <button
      {...rest}
      type={type}
      className={`state inline-flex h-12 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-line px-4 text-b16 font-semibold text-ink ${className}`}
    >
      {children}
    </button>
  );
}
