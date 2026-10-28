"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { careLine, careOptions as c } from "@/data/care-team";
import { Chevron, DialogTitle, HeaderClose } from "./CareParts";

/**
 * W8.02 Talk to our care team · W8.03 Call us (number open) · W8.04 Number copied (toast).
 * M8.02 on mobile (bottom sheet, same rows).
 */
export function CareOptions({ onClose, onCallback }: { onClose: () => void; onCallback: () => void }) {
  const [callOpen, setCallOpen] = useState(false);
  const [copied, setCopied] = useState(0);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(0), 4000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(careLine.copy);
    } catch {
      // Clipboard can be blocked (http, permissions); fall back to a hidden textarea.
      const ta = document.createElement("textarea");
      ta.value = careLine.copy;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(Date.now());
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-[50px] pt-4 md:pb-6">
      <div className="flex items-center gap-2">
        <DialogTitle title={c.title} subtitle={c.subtitle} />
        <HeaderClose onClick={onClose} className="hidden md:flex" />
      </div>

      <div className="flex flex-col overflow-hidden rounded-lg border border-line">
        <OptionRow
          as="button"
          onClick={() => setCallOpen((o) => !o)}
          ariaExpanded={callOpen}
          icon={c.call.icon}
          label={c.call.label}
          hint={c.call.hint}
          chevronOpen={callOpen}
        />
        {callOpen && (
          <div className="state flex items-center gap-4 rounded-lg bg-muted p-4">
            <a href={careLine.tel} className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-lg after:absolute after:inset-0 after:rounded-lg">
              <span className="text-b16 font-semibold text-ink">{careLine.display}</span>
              <span className="text-b12 text-ink-2">{c.number.hint}</span>
            </a>
            <button
              type="button"
              onClick={copyNumber}
              aria-label="Copy number"
              className="state relative z-10 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-field bg-card"
            >
              {/* "Icon · copy" is drawn from two 10.5px rounded squares in Figma, not an exported asset. */}
              <span className="relative size-5" aria-hidden>
                <span className="absolute left-[2.5px] top-[2.5px] size-[10.5px] rounded-[3px] border-[1.5px] border-ink" />
                <span className="absolute left-[7px] top-[7px] size-[10.5px] rounded-[3px] border-[1.5px] border-ink bg-card" />
              </span>
            </button>
            <Chevron />
          </div>
        )}
        <OptionRow as="a" href={careLine.whatsapp} external icon={c.whatsapp.icon} label={c.whatsapp.label} hint={c.whatsapp.hint} />
        <OptionRow as="button" onClick={onCallback} icon={c.callback.icon} label={c.callback.label} hint={c.callback.hint} />
        <OptionRow as="link" href={c.faqs.href} icon={c.faqs.icon} label={c.faqs.label} hint={c.faqs.hint} />
      </div>

      {copied > 0 && (
        <div
          key={copied}
          role="status"
          className="fixed left-1/2 top-4 z-50 flex h-14 w-[420px] max-w-[calc(100%-32px)] -translate-x-1/2 items-center rounded-lg bg-inverse px-4 text-b14 font-medium text-on-dark md:top-auto md:bottom-8"
        >
          {c.copied}
        </div>
      )}
    </div>
  );
}

type RowProps = {
  icon: string;
  label: string;
  hint: string;
  chevronOpen?: boolean;
} & (
  | { as: "button"; onClick: () => void; ariaExpanded?: boolean }
  | { as: "a"; href: string; external?: boolean }
  | { as: "link"; href: string }
);

function OptionRow(props: RowProps) {
  const body: ReactNode = (
    <>
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <img src={props.icon} alt="" className="size-[22px] shrink-0" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
          <span className="text-b14 font-medium text-ink">{props.label}</span>
          <span className="text-b12 text-ink-2">{props.hint}</span>
        </span>
      </span>
      <Chevron open={props.chevronOpen} />
    </>
  );
  const cls = "state flex w-full cursor-pointer items-center gap-4 p-4";
  if (props.as === "button")
    return (
      <button type="button" onClick={props.onClick} aria-expanded={props.ariaExpanded} className={cls}>
        {body}
      </button>
    );
  if (props.as === "a")
    return (
      <a href={props.href} target={props.external ? "_blank" : undefined} rel={props.external ? "noopener noreferrer" : undefined} className={cls}>
        {body}
      </a>
    );
  return (
    <Link href={props.href} className={cls}>
      {body}
    </Link>
  );
}
