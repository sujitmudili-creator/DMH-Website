"use client";

import { useState, type FormEvent } from "react";
import { Field } from "@/components/ui/Field";
import { callbackCopy as c, callbackHours, countryCode, defaultCallbackTime } from "@/data/care-team";
import { Choice, DialogTitle, HeaderClose, PrimaryAction } from "./CareParts";

export type Meridiem = "AM" | "PM";
export type CallbackDraft = { phone: string; time: string; meridiem: Meridiem; note: string };

/** "5:20" + PM → minutes after midnight, or null when it is not a 12-hour time. */
function toMinutes(time: string, meridiem: Meridiem) {
  const m = time.trim().match(/^(\d{1,2})(?:[:.](\d{2}))?$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2] ?? 0);
  if (h < 1 || h > 12 || min > 59) return null;
  return ((h % 12) + (meridiem === "PM" ? 12 : 0)) * 60 + min;
}

function timeError(time: string, meridiem: Meridiem) {
  const mins = toMinutes(time, meridiem);
  if (mins === null) return c.badTime;
  if (mins < callbackHours.from * 60 || mins > callbackHours.to * 60) return c.outsideHours;
  return null;
}

export function formatPhone(digits: string) {
  const d = digits.replace(/\D/g, "").slice(-10);
  return `${countryCode} ${d.slice(0, 5)} ${d.slice(5)}`.trim();
}

/**
 * W8.05 Request a callback · W8.06 typing the time · W8.07 outside hours (also W9.03 after the lab test form).
 * M8.03–M8.05 on mobile.
 */
export function CallbackForm({
  initial,
  sending,
  onClose,
  onSubmit,
}: {
  initial: CallbackDraft;
  sending: boolean;
  onClose: () => void;
  onSubmit: (draft: CallbackDraft) => void;
}) {
  const [draft, setDraft] = useState(initial);
  const [errors, setErrors] = useState<{ phone?: string; time?: string | null }>({});
  const set = (patch: Partial<CallbackDraft>) => setDraft((d) => ({ ...d, ...patch }));

  function checkTime(time = draft.time, meridiem = draft.meridiem) {
    if (!time.trim()) return setErrors((e) => ({ ...e, time: null }));
    setErrors((e) => ({ ...e, time: timeError(time, meridiem) }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const phone = draft.phone.replace(/\D/g, "").length === 10 ? undefined : c.badPhone;
    const time = timeError(draft.time, draft.meridiem);
    setErrors({ phone, time });
    if (!phone && !time) onSubmit(draft);
  }

  const timeMsg = errors.time;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6 px-4 pb-[50px] pt-4 md:pb-6">
      <div className="flex items-center gap-4">
        <DialogTitle title={c.title} subtitle={c.subtitle} />
        <HeaderClose onClick={onClose} className="hidden md:flex" />
      </div>

      <div className="flex flex-col gap-4">
        <Field
          label={c.phoneLabel}
          prefix={countryCode}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={draft.phone}
          error={errors.phone}
          onChange={(e) => {
            set({ phone: e.target.value.replace(/[^\d ]/g, "").slice(0, 11) });
            setErrors((x) => ({ ...x, phone: undefined }));
          }}
        />

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-b14 font-medium text-ink">{c.timeLabel}</legend>
          <div className="flex items-stretch gap-2">
            <Field
              aria-label="Time"
              className="flex-1"
              prefix={<img src="/icons/icon-clock-20.svg" alt="" className="size-5" />}
              inputMode="numeric"
              placeholder={defaultCallbackTime.time}
              value={draft.time}
              onChange={(e) => {
                set({ time: e.target.value.replace(/[^\d:.]/g, "").slice(0, 5) });
                setErrors((x) => ({ ...x, time: null }));
              }}
              onBlur={() => checkTime()}
            />
            <div role="radiogroup" aria-label="AM or PM" className="flex gap-2">
              {(["AM", "PM"] as const).map((m) => (
                <Choice
                  key={m}
                  selected={draft.meridiem === m}
                  onClick={() => {
                    set({ meridiem: m });
                    checkTime(draft.time, m);
                  }}
                  className={`w-16 text-b16 ${draft.meridiem === m ? "font-semibold" : ""}`}
                >
                  {m}
                </Choice>
              ))}
            </div>
          </div>
          {timeMsg ? (
            <p role="alert" className="flex items-center gap-2 text-b12 font-medium text-danger">
              <img src="/icons/icon-info-circle-danger-16.svg" alt="" className="size-4 shrink-0" />
              {timeMsg}
            </p>
          ) : (
            <p className="text-b12 text-ink-2">{callbackHours.label}</p>
          )}
        </fieldset>

        <Field
          label={c.noteLabel}
          placeholder={c.notePlaceholder}
          value={draft.note}
          onChange={(e) => set({ note: e.target.value })}
        />
      </div>

      <PrimaryAction disabled={sending} aria-busy={sending}>
        {sending ? c.sending : c.submit}
      </PrimaryAction>
    </form>
  );
}
