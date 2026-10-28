// Placeholder profile content (W10–W14 / M10–M14). Replace with the account API.
import { external, routes } from "@/lib/routes";

/** "Today" in the Figma prototype (Wed, 28 Oct 2026); splits Upcoming from Past. Replace with the real date. */
export const today = "2026-10-28";

/** Demo account used when the page is opened with ?demo=1 (screenshots, fresh browsers). */
export const demoUser = { name: "Rahul Sharma", phone: "+91 98765 43210" };

/** Personal details (W11.02) beyond the session's name/phone. */
export const genders = ["Male", "Female", "Other"] as const;
export const demoDetails = { email: "rahul.sharma@gmail.com", gender: "Male" as (typeof genders)[number] };

export type MenuItem = { label: string; href: string; icon: string; iconInk: string; external?: boolean };

/** Desktop dropdown (W11.01) rows, in order. Log out is added by the menu itself (it opens a confirm). */
export const profileMenu: MenuItem[] = [
  { label: "Personal details", href: routes.personalDetails, icon: "/icons/profile/user-22.svg", iconInk: "/icons/profile/user-22-ink.svg" },
  { label: "Saved addresses", href: routes.addresses, icon: "/icons/profile/location-22.svg", iconInk: "/icons/profile/location-22-ink.svg" },
  { label: "My bookings", href: routes.bookings, icon: "/icons/profile/calendar-22.svg", iconInk: "/icons/profile/calendar-22-ink.svg" },
  { label: "Help and support", href: routes.help, icon: "/icons/profile/headset-22.svg", iconInk: "/icons/profile/headset-22-ink.svg" },
];

/** Mobile profile page (M11.01) groups. */
export const profileSections: { title: string; items: MenuItem[] }[] = [
  { title: "Account", items: [profileMenu[0], profileMenu[1]] },
  { title: "Activity", items: [profileMenu[2]] },
  {
    title: "Support",
    items: [
      profileMenu[3],
      { label: "Terms and conditions", href: external.terms, icon: "/icons/icon-note-22.svg", iconInk: "/icons/icon-note-22.svg", external: true },
      { label: "Privacy policy", href: external.privacy, icon: "/icons/profile/shield-tick-22.svg", iconInk: "/icons/profile/shield-tick-22.svg", external: true },
    ],
  },
];

export const profileQuickActions = [
  { label: "My bookings", href: routes.bookings, icon: "/icons/profile/calendar-bulk-28.svg" },
  { label: "Need help?", href: routes.careTeam, icon: "/icons/profile/headset-bulk-28.svg" },
];

/** Help and support (W14.02) questions. Only the first answer is in the Figma; the others are placeholders. */
export const helpFaqs = [
  { q: "How do I pay for a visit?", a: "You pay after your visit by UPI, card or cash. Nothing is charged when you book." },
  {
    q: "Who comes to my home?",
    a: "A verified and trained nurse or doctor from our partner hospitals. You see their name and photo before the visit.",
  },
  {
    q: "Can I book again from a past visit?",
    a: "Yes. Open My bookings, go to Past and tap Book again. You only pick a new slot.",
  },
];
