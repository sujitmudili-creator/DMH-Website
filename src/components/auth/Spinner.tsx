/** Figma "Spinner" instance (W20.12 button, W20.16 detecting, W20.17 map loading), rotated with CSS. */
export function Spinner({ className = "size-5", light = false }: { className?: string; light?: boolean }) {
  return (
    <img
      src={light ? "/icons/auth/spinner-light.svg" : "/icons/auth/spinner.svg"}
      alt=""
      aria-hidden
      className={`shrink-0 animate-spin motion-reduce:animate-[spin_3s_linear_infinite] ${className}`}
    />
  );
}
