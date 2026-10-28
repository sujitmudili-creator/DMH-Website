import { Button, ButtonLink } from "@/components/ui/Button";

/** Empty state (W12.09 "No visits yet"): 96 muted circle with a bulk icon, title, line, optional primary action. */
export function EmptyState({
  icon,
  title,
  text,
  action,
  onAction,
  className = "",
}: {
  icon: string;
  title: string;
  text: string;
  action?: { label: string; href: string };
  onAction?: { label: string; onClick: () => void };
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-3 text-center ${className}`}>
      <span className="flex size-24 items-center justify-center rounded-full bg-muted">
        <img src={icon} alt="" className="size-12" />
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-h20 font-semibold">{title}</h2>
        <p className="text-b14 text-ink-2">{text}</p>
      </div>
      {action && (
        <ButtonLink href={action.href} className="h-[52px] text-b16">
          {action.label}
        </ButtonLink>
      )}
      {onAction && (
        <Button onClick={onAction.onClick} variant="outline" className="h-12">
          {onAction.label}
        </Button>
      )}
    </div>
  );
}
