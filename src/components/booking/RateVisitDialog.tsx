"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { FloatingClose } from "@/components/care-team/CareParts";
import { Modal } from "@/components/ui/Modal";
import { lowRatingMax, ratingLabels, ratingPrompt, ratingThanks, submitRating } from "@/data/booking-details";
import { routes } from "@/lib/routes";
import { DashedDivider } from "./BookingParts";
import { StarRating } from "./StarRating";
import { saveBookingRating } from "./useBookingRating";

/** Desktop close: white 40px circle, Shadow/Floating, "add" icon turned 45°. Mobile uses FloatingClose above the sheet. */
function DesktopClose({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className="state hidden size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-card shadow-floating md:flex"
    >
      <img src="/icons/icon-add-20.svg" alt="" className="size-5 -rotate-45" />
    </button>
  );
}

/**
 * Rate your visit pop up (W18.03–W18.05, W18.08, W18.09) → Thank you (W18.06, or W18.10 for low ratings).
 * Desktop: 480 dialog over the blurred booking page. Mobile: bottom sheet with a floating close.
 */
export function RateVisitDialog({
  bookingId,
  professionalName,
  professionalFirstName,
  serviceName,
  initialStars,
}: {
  bookingId: string;
  professionalName: string;
  professionalFirstName: string;
  serviceName: string;
  initialStars: number;
}) {
  const router = useRouter();
  const [stars, setStars] = useState(initialStars);
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const noteId = useId();

  const prompt = ratingPrompt(stars || 5);
  const close = () => router.push(routes.booking(bookingId), { scroll: false });

  function pickStars(n: number) {
    // The tag list changes between "went well" and "went wrong"; drop picks that no longer apply.
    const next = ratingPrompt(n);
    setTags((t) => t.filter((tag) => (next.tags as readonly string[]).includes(tag)));
    setStars(n);
  }

  function toggle(tag: string) {
    setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]));
  }

  async function submit() {
    setSending(true);
    try {
      await submitRating({ bookingId, stars, tags, note: note.trim() });
      saveBookingRating(bookingId, stars);
      setDone(true);
    } finally {
      setSending(false);
    }
  }

  const thanks = stars <= lowRatingMax ? ratingThanks.low : ratingThanks.high;

  return (
    <Modal open onClose={close} width={480} className="max-md:overflow-visible">
      <FloatingClose onClick={close} />
      {done ? (
        <div className="flex flex-col items-center gap-6 p-6" role="status">
          <div className="flex w-full items-center gap-2 md:pl-12">
            <div className="flex flex-1 justify-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-success-tint">
                <img src="/icons/icon-tick-circle-32.svg" alt="" className="size-8" />
              </span>
            </div>
            <DesktopClose onClick={close} />
          </div>
          <div className="flex flex-col gap-2 text-center">
            <h2 autoFocus tabIndex={-1} className="font-display text-h20 font-semibold outline-none md:text-h24">
              {thanks.title}
            </h2>
            <p className="text-b14 text-ink-2">{thanks.body.replace("{name}", professionalFirstName)}</p>
          </div>
          <button type="button" onClick={close} className="state-dark flex h-13 w-full cursor-pointer items-center justify-center rounded-lg bg-brand text-b16 font-semibold text-on-dark">
            Okay
          </button>
        </div>
      ) : (
        <form
          className="flex flex-col items-center gap-6 p-6 max-md:px-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (stars && !sending) submit();
          }}
        >
          <div className="flex w-full items-start gap-2 md:pl-12">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-1 text-center">
                {/* Takes the dialog's initial focus so the first star doesn't show a focus ring on open. */}
                <h2 autoFocus tabIndex={-1} className="font-display text-h20 font-semibold outline-none md:text-h24">
                  Rate your visit
                </h2>
                <p className="text-b14 text-ink-2">
                  {professionalName} · {serviceName}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <StarRating value={stars} size={40} onSelect={pickStars} />
                <p className="text-b14 font-semibold" aria-live="polite">
                  {stars ? ratingLabels[stars - 1] : "Tap a star to rate"}
                </p>
              </div>
            </div>
            <DesktopClose onClick={close} />
          </div>

          <DashedDivider className="w-full" />

          <fieldset className="flex w-full flex-col gap-4">
            <legend className="mb-4 text-b14 font-semibold">{prompt.question}</legend>
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map((tag) => {
                const on = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(tag)}
                    className={`state flex h-9 cursor-pointer items-center rounded-full border px-4 text-b12 font-medium ${
                      on ? "border-choice-selected bg-tint text-brand" : "border-field bg-card text-ink-2"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="flex w-full flex-col gap-4">
            <label htmlFor={noteId} className="text-b14 font-medium">
              Tell us more (optional)
            </label>
            <textarea
              id={noteId}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Share anything we should know"
              maxLength={500}
              className="h-24 w-full resize-none rounded-lg border border-field bg-card px-4 pt-3 pb-4 text-b16 outline-none placeholder:text-ink-2 focus:border-field-selected"
            />
          </div>

          <button
            type="submit"
            disabled={!stars || sending}
            className="state-dark flex h-13 w-full cursor-pointer items-center justify-center rounded-lg bg-brand text-b16 font-semibold text-on-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "Submitting…" : "Submit"}
          </button>
        </form>
      )}
    </Modal>
  );
}
