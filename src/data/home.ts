import type { Crop } from "@/components/ui/CropImg";
import { external, routes } from "@/lib/routes";

// Placeholder content for the Home page (W1.01 / M1.01). Keep copy, numbers and images here, not in components.

/** All six service icons live in one 3D sprite; crop = icon position inside it. */
const SPRITE = { width: "527.5%", height: "268.22%" };
export const serviceTiles: { label: string; href?: string; external?: boolean; crop: Crop }[] = [
  { label: "Doctor", crop: { ...SPRITE, left: "-47.29%", top: "-17.37%" } },
  { label: "Nurse", href: routes.category("nurse"), crop: { ...SPRITE, left: "-214.13%", top: "-17.37%" } },
  { label: "Lab test", href: routes.labTest, crop: { ...SPRITE, left: "-386.33%", top: "-17.37%" } },
  { label: "Wellness IV", crop: { ...SPRITE, left: "-47.29%", top: "-134.45%" } },
  { label: "Vaccination", crop: { ...SPRITE, left: "-214.13%", top: "-141.67%" } },
  { label: "Health plan", href: external.healthPlan, external: true, crop: { ...SPRITE, left: "-386.33%", top: "-141.67%" } },
];

export const stats = [
  { icon: "/icons/icon-like-tag.svg", value: "4.9", label: "Service rating" },
  { icon: "/icons/icon-profile-2user.svg", value: "10k+", label: "Families served" },
  { icon: "/icons/icon-calendar-tick.svg", value: "23k+", label: "Visits completed" },
];

/** Partner logos; widths are for the 52px row (home) — the footer uses the same crops at 28px. */
export const partners: { name: string; src: string; w: number; crop?: Crop }[] = [
  { name: "Max Healthcare", src: "/img/partner-max.png", w: 108, crop: { left: "4.39%", top: "18.8%", width: "91.57%", height: "62.4%" } },
  { name: "Medanta", src: "/img/partner-narayana.png", w: 108 },
  { name: "Apollo", src: "/img/partner-apollo.png", w: 69, crop: { left: "14.44%", top: "0%", width: "73.63%", height: "100%" } },
  { name: "Fortis Hospitals", src: "/img/partner-fortis.png", w: 94, crop: { left: "0%", top: "-40.38%", width: "100%", height: "180.77%" } },
];

export const howWeWork: { title: string; body: string; src: string; crop?: Crop }[] = [
  {
    title: "Meet your healthcare professional",
    body: "A qualified professional is assigned to your visit.",
    src: "/img/step-professional.png",
    crop: { left: "-12.5%", top: "-2.06%", width: "132.87%", height: "132.87%" },
  },
  {
    title: "Care that puts hygiene first",
    body: "Our team follows appropriate hygiene practices during every visit.",
    src: "/img/team-photo-sprite.jpg",
    crop: { left: "-208.33%", top: "-112.5%", width: "416.67%", height: "416.67%" },
  },
  {
    title: "The right supplies for your care",
    body: "Essential medical supplies for your scheduled service.",
    src: "/img/kit-dressing.jpg",
  },
  {
    title: "Care, right where you need it",
    body: "Receive professional healthcare in the comfort of your home.",
    src: "/img/step-home.jpg",
  },
];

export const kit = [
  { label: "BP monitor and pulse oximeter", src: "/img/kit-bp.jpg" },
  { label: "Sterile dressing kit", src: "/img/kit-dressing.jpg" },
  { label: "Gloves, masks and sanitiser", src: "/img/kit-ppe.jpg" },
  { label: "Glucometer and thermometer", src: "/img/kit-glucometer.jpg" },
  { label: "IV drip kit", src: "/img/kit-iv-drip.jpg" },
];

// Figma repeats ICU and Ambulance as filler cards; each is listed once here.
export const notCovered = [
  { label: "Emergency", src: "/img/not-covered-emergency.jpg" },
  { label: "ICU", src: "/img/not-covered-icu.jpg" },
  { label: "Ambulance", src: "/img/not-covered-ambulance.jpg" },
];

export const videos = [
  { title: "Family story 1", poster: "/img/video-1.jpg" },
  { title: "Family story 2", poster: "/img/video-2.jpg" },
  { title: "Family story 3", poster: "/img/video-3.jpg" },
  { title: "Family story 4", poster: "/img/video-4.jpg" },
  { title: "Family story 5", poster: "/img/video-5.jpg" },
];

export const faqs = ["Which service do I need?", "How soon can someone come?", "What does a visit cost?"];

/** Care-team avatars in "Talk to us": same crops as the How we work photos. */
export const careTeamAvatars = howWeWork.filter((_, i) => i !== 2).map(({ src, crop }) => ({ src, crop }));
