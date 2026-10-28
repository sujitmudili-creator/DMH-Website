// Copy and rules for Booking details (W17.x, W18.x) and Rate your visit (W18.03–W18.10).
// Replace with values from the bookings API / CMS.

/** Late cancellation: a fee applies when cancelling within this many minutes of the slot. */
export const lateCancellation = { minutes: 30, fee: 500 };

/** Label under the stars, index = stars − 1 (W18.09 → W18.03). */
export const ratingLabels = ["Very bad", "Bad", "Average", "Good", "Excellent"] as const;

/** Ratings at or below this show the "could be better / went wrong" tags and the low-rating thank you. */
export const lowRatingMax = 3;

export const ratingPrompts = {
  high: { question: "What went well?", tags: ["On time", "Gentle and caring", "Clean and hygienic", "Explained everything", "Kept me informed"] },
  mid: { question: "What could be better?", tags: ["Arrived late", "Felt rushed", "Not hygienic", "Did not explain", "Something else"] },
  low: { question: "What went wrong?", tags: ["Arrived late", "Felt rushed", "Not hygienic", "Did not explain", "Something else"] },
} as const;

export function ratingPrompt(stars: number) {
  if (stars >= 4) return ratingPrompts.high;
  if (stars === 3) return ratingPrompts.mid;
  return ratingPrompts.low;
}

/** Thank-you pop up after submitting (W18.06 / W18.10). `{name}` = professional's first name. */
export const ratingThanks = {
  high: { title: "We're glad your visit went well", body: "We will share your feedback with {name} and our care team." },
  low: { title: "Thanks for rating your visit", body: "It helps us improve. We'll share it with {name} and our care team." },
};

/** Placeholder submit. Replace with POST /bookings/:id/rating. */
export async function submitRating(input: { bookingId: string; stars: number; tags: string[]; note: string }) {
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true, bookingId: input.bookingId };
}
