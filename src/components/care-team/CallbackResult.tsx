import { callbackCopy as c, careLine } from "@/data/care-team";
import { HeaderClose } from "./CareParts";

/** W8.08 Callback requested (desktop: tick left, brand Done) · M8.06 (mobile: centred, tinted tick, outline Done). */
export function CallbackRequested({ phone, onDone }: { phone: string; onDone: () => void }) {
  return (
    <div className="flex flex-col gap-4 pb-[50px] pt-8 md:gap-6 md:px-4 md:pb-8 md:pt-4">
      <div className="hidden items-start justify-between md:flex">
        <img src="/icons/icon-tick-circle-56.svg" alt="" className="size-14" />
        <HeaderClose onClick={onDone} className="flex" />
      </div>
      <div className="flex flex-col items-center gap-3 px-4 text-center md:items-start md:px-0 md:text-left">
        <div className="flex size-16 items-center justify-center rounded-full bg-success-tint md:hidden">
          <img src="/icons/icon-tick-circle-32.svg" alt="" className="size-8" />
        </div>
        <h2 tabIndex={-1} className="font-display text-h20 font-semibold outline-none md:text-h24">{c.requestedTitle}</h2>
        <p className="text-b14 text-ink-2">{c.requested(phone)}</p>
        <button
          type="button"
          onClick={onDone}
          className="state flex h-[52px] w-full cursor-pointer items-center justify-center rounded-lg border border-line bg-card text-b16 font-semibold text-ink md:state-dark md:border-0 md:bg-brand md:text-on-dark"
        >
          {c.done}
        </button>
      </div>
    </div>
  );
}

/** W8.09 Error · Callback failed · M8.07 (buttons stack on mobile with Try again first). */
export function CallbackFailed({ retrying, onRetry, onClose }: { retrying: boolean; onRetry: () => void; onClose: () => void }) {
  return (
    <div className="flex flex-col gap-6 px-4 pb-[50px] pt-6 md:p-8">
      <div className="-mb-2 flex items-start justify-between md:mb-0">
        <div className="flex size-16 items-center justify-center rounded-full bg-danger-tint">
          <img src="/icons/icon-warning-32.svg" alt="" className="size-8" />
        </div>
        <HeaderClose onClick={onClose} className="hidden md:flex" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 tabIndex={-1} className="font-display text-h20 font-semibold outline-none md:text-h24">{c.failedTitle}</h2>
        <p className="text-b14 text-ink-2">{c.failedBody}</p>
      </div>
      <div className="flex flex-col-reverse gap-3 md:flex-row">
        <a
          href={careLine.tel}
          className="state flex h-[52px] items-center justify-center rounded-lg border border-line bg-card text-b16 font-semibold text-ink md:h-12 md:flex-1"
        >
          {c.callUs}
        </a>
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          aria-busy={retrying}
          className="state-dark flex h-[52px] cursor-pointer items-center justify-center rounded-lg bg-brand text-b16 font-semibold text-on-dark disabled:cursor-wait disabled:opacity-70 md:h-12 md:flex-1"
        >
          {retrying ? c.sending : c.tryAgain}
        </button>
      </div>
    </div>
  );
}
