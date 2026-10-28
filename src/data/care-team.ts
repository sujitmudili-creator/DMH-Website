import { routes } from "@/lib/routes";

// Placeholder content for "Talk to our care team", "Request a callback" and "Book a lab test" (W8.x, W9.x).
// Replace the number, hours and the request functions with the real API.

export const careLine = {
  display: "+91 95 7000 9000",
  tel: "tel:+919570009000",
  copy: "+91 95 7000 9000",
  whatsapp: "https://wa.me/919570009000",
};

/** Callbacks are only placed inside these hours (24h clock, end inclusive). */
export const callbackHours = { from: 8, to: 22, label: "We call between 8 AM and 10 PM" };

/** The signed-in user's number, used to prefill the callback form. */
export const userPhone = "98765 43210";
export const countryCode = "+91";

export const defaultCallbackTime = { time: "5:20", meridiem: "PM" as const };

export const careOptions = {
  title: "Talk to our care team",
  subtitle: "Choose how you would like to reach us",
  call: { label: "Call us", hint: "Speak to our care team now", icon: "/icons/icon-call-22.svg" },
  number: { hint: "Call from your phone, or copy the number" },
  whatsapp: { label: "Chat on WhatsApp", hint: "Message us and we will reply", icon: "/icons/icon-message-22.svg" },
  callback: { label: "Request a callback", hint: "We will call you back", icon: "/icons/icon-clock-22.svg" },
  faqs: { label: "FAQs", hint: "Answers to common questions", icon: "/icons/icon-note-22.svg", href: routes.help },
  copied: "Number copied",
};

export const callbackCopy = {
  title: "Request a callback",
  subtitle: "Our care team will call you on this number",
  phoneLabel: "Phone number*",
  timeLabel: "Preferred time*",
  outsideHours: "We call between 8 AM and 10 PM. Please pick another time.",
  badTime: "Enter a time like 5:20",
  badPhone: "Enter a 10-digit mobile number",
  noteLabel: "What do you need help with? (optional)",
  notePlaceholder: "Booking, service or payment",
  submit: "Request callback",
  sending: "Requesting…",
  requestedTitle: "Callback requested",
  requested: (phone: string) => `Our care team will call you on ${phone} shortly.`,
  done: "Done",
  failedTitle: "We couldn't request a callback",
  failedBody: "Please try again, or call us right away.",
  tryAgain: "Try again",
  callUs: "Call us",
};

export const labTestCopy = {
  title: "Book a lab test",
  subtitle: "Tell us a few details and we will call you to fix a time",
  nameLabel: "Patient name*",
  namePlaceholder: "Full name",
  ageLabel: "Age*",
  genderLabel: "Gender*",
  genders: ["Male", "Female", "Other"] as const,
  submit: "Request callback",
  talkNow: "Want to talk now?",
  callUs: "Call us",
  errors: { name: "Enter the patient's name", age: "Enter age", gender: "Choose one" },
};

export type CallbackRequest = {
  phone: string;
  time: string;
  note?: string;
  labTest?: { name: string; age: number; gender: string };
};

/** Mock API. Fails when the browser is offline so the error state (W8.09) can be seen. */
export async function requestCallback(req: CallbackRequest): Promise<void> {
  await new Promise((r) => setTimeout(r, 700));
  if (typeof navigator !== "undefined" && !navigator.onLine) throw new Error("offline");
  void req;
}
