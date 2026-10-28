// Shared state for the log in → details → address → map flow. Placeholder: kept in sessionStorage so a
// refresh mid-flow keeps what was typed. Replace with the real profile / address APIs.

export type OnboardingDraft = {
  name?: string;
  email?: string;
  gender?: string;
  house?: string;
  area?: string;
  landmark?: string;
  city?: string;
  pincode?: string;
  label?: string;
};

const DRAFT = "dmh.onboarding";

export function readDraft(): OnboardingDraft {
  try {
    return JSON.parse(window.sessionStorage.getItem(DRAFT) ?? "{}") as OnboardingDraft;
  } catch {
    return {};
  }
}

export function writeDraft(patch: OnboardingDraft) {
  try {
    window.sessionStorage.setItem(DRAFT, JSON.stringify({ ...readDraft(), ...patch }));
  } catch {}
}

/** Only same-site paths are accepted as a `next` target. */
export function safeNext(next: string | string[] | undefined, fallback: string): string {
  const v = Array.isArray(next) ? next[0] : next;
  return v && v.startsWith("/") && !v.startsWith("//") ? v : fallback;
}

/** Builds `path?key=value…`, skipping empty values. */
export function withQuery(path: string, query: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) if (v) q.set(k, v);
  const s = q.toString();
  return s ? `${path}?${s}` : path;
}

/** "9876543210" → "98765 43210". */
export function formatPhone(digits: string) {
  return digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;
}
