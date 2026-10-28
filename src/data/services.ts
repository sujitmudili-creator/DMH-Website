import { routes } from "@/lib/routes";

// Placeholder catalogue for service listing (W1.02/W1.03), service detail (W1.04–W1.07), ratings (W7.02)
// and search (W6.02–W6.06). Replace with API data; components only read from here.

const IMG = {
  wound: "/img/step-home.jpg", // same Figma image as the Home "Care, right where you need it" step
  iv: "/img/services/iv-drips.jpg",
  injections: "/img/services/injections.jpg",
  catheter: "/img/services/catheter-care.jpg",
  diabetes: "/img/services/diabetes-support.png",
  chronic: "/img/services/chronic-care.jpg",
};

export type Review = {
  name: string;
  date: string;
  rating: number;
  text: string;
  photos?: boolean;
};

export type RatingSummary = {
  average: number;
  /** Short count label, e.g. "3.1K". */
  count: string;
  /** Reviews per star, 5 → 1. */
  stars: { star: number; count: number; label: string }[];
};

export type AddOn = {
  id: string;
  name: string;
  rating: number;
  reviews: string;
  price: number;
  mrp: number;
  image: string;
};

export type Step = { title: string; body: string; image: string };
export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  category: string;
  group: string;
  name: string;
  rating: number;
  /** Reviews label as shown on cards, e.g. "3.1K". */
  reviews: string;
  price: number;
  mrp: number;
  unit: string;
  points: [string, string];
  image: string;
  description: string;
  addOns: string[];
  trust: string;
  included: string[];
  excluded: string[];
  goodToKnow: string[];
  steps: Step[];
  faqs: Faq[];
  /** Related services for search results. */
  related: string[];
  /** Extra search words. */
  keywords: string[];
  /** Search suggestion subtitle when no price is shown ("Post surgery care"). */
  searchNote?: string;
};

export type ServiceGroup = { id: string; title: string };

/** Sidebar (desktop) and tiles (mobile): each entry scrolls to a group or opens a service. */
export type SubCategory = {
  /** Figma's mobile tile spells "Procuderes at home"; fixed here. */
  label: string;
  image: string;
  target: { group: string } | { service: string };
};

export type Category = {
  slug: string;
  name: string;
  /** Thumbnail in search suggestions. */
  image: string;
  groups: ServiceGroup[];
  subcategories: SubCategory[];
};

export const categories: Category[] = [
  {
    slug: "nurse",
    name: "Nurse at home",
    image: IMG.chronic,
    groups: [
      { id: "procedures", title: "Procedures at home" },
      { id: "ongoing", title: "Ongoing care" },
    ],
    subcategories: [
      { label: "Procedures at home", image: IMG.catheter, target: { group: "procedures" } },
      { label: "Ongoing care", image: IMG.catheter, target: { group: "ongoing" } },
      { label: "Elder care", image: IMG.chronic, target: { service: "chronic-disease-support" } },
      { label: "Wound dressing", image: IMG.wound, target: { service: "wound-dressing" } },
      { label: "Injection at home", image: IMG.injections, target: { service: "injections" } },
      { label: "Energy B12 IV", image: IMG.iv, target: { service: "iv-drips" } },
    ],
  },
];

export const addOns: AddOn[] = [
  { id: "blood-sugar-test", name: "Blood sugar test", rating: 4.8, reviews: "2.4K", price: 199, mrp: 399, image: IMG.wound },
  { id: "tetanus-injection", name: "Tetanus injection at home", rating: 4.8, reviews: "1.1K", price: 799, mrp: 999, image: IMG.injections },
];

/** "Why families choose us" photo tiles (same for every nurse service). */
export const whyTiles = {
  professionals: { label: "Trained medical professionals", src: "/img/services/why-professionals.jpg" },
  sterile: { label: "Sterile tools for every treatment", src: "/img/services/why-sterile.jpg" },
  kit: { label: "Everything in one kit", src: "/img/services/why-kit.jpg" },
  scrubs: { label: "Fresh standard scrubs", src: "/img/services/why-scrubs.jpg" },
  nurse: "/img/services/why-nurse.png",
};

export const trustPoints = [
  { icon: "/icons/services/medal-star-20-white.svg", label: (s: Service) => s.trust },
  { icon: "/icons/services/star-20-white.svg", label: () => "4.9 average rating" },
  { icon: "/icons/services/users-20-white.svg", label: () => "Served 10K+ families" },
  { icon: "/icons/services/shield-tick-20-white.svg", label: () => "Background verified" },
];

const visitSteps = (third: Step): Step[] => [
  { title: "Book a slot", body: "Pick a date, a time and the patient", image: "/img/services/step-1.jpg" },
  { title: "Nurse arrives", body: "A verified nurse comes with a sterile kit", image: "/img/services/step-2.jpg" },
  third,
  { title: "Notes shared", body: "You get a short summary after every visit", image: "/img/services/step-4.jpg" },
];

const careStep = (title: string, body: string): Step => ({ title, body, image: "/img/services/step-3.jpg" });

const commonFaqs: Faq[] = [
  { q: "Can I book daily visits for a week?", a: "Yes. Pick the first slot at checkout and tell us how many days; we keep the same nurse where we can." },
];

export const services: Service[] = [
  {
    slug: "wound-dressing",
    category: "nurse",
    group: "procedures",
    name: "Wound dressing & care",
    rating: 4.9,
    reviews: "3.1K",
    price: 899,
    mrp: 1199,
    unit: "Per visit",
    points: ["Cleaning and a sterile dressing", "Healing checked every visit"],
    image: IMG.wound,
    description:
      "A trained nurse visits your home to clean and dress wounds from surgery, injuries or burns. Each visit uses a fresh sterile kit, and the nurse notes how the wound is healing so your doctor can see progress between check ups.",
    addOns: ["blood-sugar-test", "tetanus-injection"],
    trust: "Trained in wound care",
    included: [
      "Wound cleaned with sterile supplies",
      "Fresh dressing as your doctor advises",
      "Healing checked and noted at every visit",
      "Tips to keep the wound clean between visits",
    ],
    excluded: ["Prescription medicines and creams", "A doctor consultation (book Doctor at home)"],
    goodToKnow: ["Keep the doctor’s prescription ready", "Tell us about any allergies when you book"],
    steps: visitSteps(careStep("Wound is dressed", "Cleaned, dressed and checked for healing")),
    faqs: [
      { q: "How long does a dressing visit take?", a: "Most visits take 20 to 30 minutes, depending on the size of the wound." },
      ...commonFaqs,
      { q: "What if the wound looks infected?", a: "The nurse will tell you and share notes with your doctor the same day. If it looks urgent, call 112." },
    ],
    related: ["diabetes-support", "catheter-care"],
    keywords: ["dressing", "wound", "bandage", "burn"],
  },
  {
    slug: "iv-drips",
    category: "nurse",
    group: "procedures",
    name: "IV drips",
    rating: 4.9,
    reviews: "2.3K",
    price: 1499,
    mrp: 1999,
    unit: "Per visit",
    points: ["A trained nurse watches the drip", "Fluids as your doctor prescribes"],
    image: IMG.iv,
    description:
      "A trained nurse sets up the IV line at home and stays until the drip is done. Fluids and medicines are given exactly as your doctor prescribes.",
    addOns: ["blood-sugar-test", "tetanus-injection"],
    trust: "Trained in IV care",
    included: ["IV line set up with sterile supplies", "Nurse stays for the whole drip", "Vitals checked before and after"],
    excluded: ["IV fluids and medicines", "A doctor consultation (book Doctor at home)"],
    goodToKnow: ["Keep the doctor’s prescription and fluids ready", "A drip usually takes 1 to 2 hours"],
    steps: visitSteps(careStep("Drip is given", "The nurse watches the drip until it is done")),
    faqs: [
      { q: "How long does an IV drip visit take?", a: "Most drips take 1 to 2 hours. The nurse stays until it is done." },
      ...commonFaqs,
    ],
    related: ["injections", "chronic-disease-support"],
    keywords: ["iv", "drip", "fluids", "b12", "energy"],
  },
  {
    slug: "post-surgery-wound-care",
    category: "nurse",
    group: "procedures",
    name: "Post surgery wound care",
    rating: 4.8,
    reviews: "640",
    price: 1099,
    mrp: 1399,
    unit: "Per visit",
    points: ["Dressing and stitch care after surgery", "Signs of infection checked every visit"],
    image: IMG.iv,
    description:
      "After surgery, a trained nurse cleans and dresses the wound at home, checks the stitches and watches for signs of infection.",
    addOns: ["blood-sugar-test", "tetanus-injection"],
    trust: "Trained in post surgery care",
    included: ["Stitch line cleaned and dressed", "Signs of infection checked", "Notes shared with your family"],
    excluded: ["Stitch removal without a doctor’s note", "Prescription medicines and creams"],
    goodToKnow: ["Keep the discharge summary ready", "Tell us the date of surgery when you book"],
    steps: visitSteps(careStep("Wound is dressed", "Cleaned, dressed and checked for healing")),
    faqs: [
      { q: "How soon after surgery can I book?", a: "As soon as you are home. Share the discharge summary when you book." },
      ...commonFaqs,
    ],
    related: ["wound-dressing", "catheter-care"],
    keywords: ["surgery", "stitch", "post", "operation", "wound"],
    searchNote: "Post surgery care",
  },
  {
    slug: "injections",
    category: "nurse",
    group: "procedures",
    name: "Doctor prescribed injections",
    rating: 4.9,
    reviews: "950",
    price: 799,
    mrp: 999,
    unit: "Per visit",
    points: ["Injections given on schedule", "Keep your prescription ready"],
    image: IMG.injections,
    description:
      "A trained nurse gives injections at home on the schedule your doctor sets, with a fresh sterile kit at every visit.",
    addOns: ["blood-sugar-test", "tetanus-injection"],
    trust: "Trained in injections",
    included: ["Injection given with sterile supplies", "Site checked for reactions", "Next dose reminder"],
    excluded: ["Injection medicines", "A doctor consultation (book Doctor at home)"],
    goodToKnow: ["Keep the doctor’s prescription and medicine ready", "Tell us about any allergies when you book"],
    steps: visitSteps(careStep("Injection is given", "Given on schedule and checked for reactions")),
    faqs: [{ q: "Do you bring the medicine?", a: "No. Keep the prescribed medicine ready; the nurse brings everything else." }, ...commonFaqs],
    related: ["iv-drips", "diabetes-support"],
    keywords: ["injection", "shot", "vaccine", "tetanus", "insulin"],
  },
  {
    slug: "catheter-care",
    category: "nurse",
    group: "procedures",
    name: "Catheter care",
    rating: 4.8,
    reviews: "780",
    price: 999,
    mrp: 1299,
    unit: "Per visit",
    points: ["Insertion, change or removal", "Hygiene care to prevent infection"],
    image: IMG.catheter,
    description:
      "A trained nurse inserts, changes or removes a urinary catheter at home and shows your family how to keep it clean.",
    addOns: ["blood-sugar-test", "tetanus-injection"],
    trust: "Trained in catheter care",
    included: ["Catheter inserted, changed or removed", "Hygiene care around the catheter", "Tips for the family"],
    excluded: ["Catheter and urine bag", "A doctor consultation (book Doctor at home)"],
    goodToKnow: ["Keep the catheter kit your doctor advised ready", "Tell us the last change date"],
    steps: visitSteps(careStep("Catheter care done", "Changed with sterile supplies and checked")),
    faqs: [{ q: "How often should a catheter be changed?", a: "Usually every 2 to 4 weeks, or as your doctor advises." }, ...commonFaqs],
    related: ["post-surgery-wound-care", "chronic-disease-support"],
    keywords: ["catheter", "urine", "foley"],
  },
  {
    slug: "diabetes-support",
    category: "nurse",
    group: "ongoing",
    name: "Diabetes support",
    rating: 4.8,
    reviews: "1.8K",
    price: 999,
    mrp: 1299,
    unit: "Per visit",
    points: ["Blood sugar checks and insulin help", "Foot and skin checks at every visit"],
    image: IMG.diabetes,
    description:
      "A trained nurse checks blood sugar, helps with insulin and looks after feet and skin, so small problems are caught early.",
    addOns: ["blood-sugar-test", "tetanus-injection"],
    trust: "Trained in diabetes care",
    included: ["Blood sugar checked and noted", "Insulin given as prescribed", "Foot and skin checks"],
    excluded: ["Insulin and medicines", "A doctor consultation (book Doctor at home)"],
    goodToKnow: ["Keep the glucometer and insulin ready", "Share the last sugar readings"],
    steps: visitSteps(careStep("Sugar is checked", "Readings noted and insulin given if prescribed")),
    faqs: [{ q: "Can the nurse adjust the insulin dose?", a: "No. The nurse follows your doctor’s plan and shares readings with them." }, ...commonFaqs],
    related: ["chronic-disease-support", "injections"],
    keywords: ["diabetes", "sugar", "insulin", "glucose", "foot"],
  },
  {
    slug: "chronic-disease-support",
    category: "nurse",
    group: "ongoing",
    name: "Chronic disease support",
    rating: 4.9,
    reviews: "1.2K",
    price: 1299,
    mrp: 1699,
    unit: "Per visit",
    points: ["Vitals and medicines at home", "Family updated after every visit"],
    image: IMG.chronic,
    description:
      "Regular nurse visits for long term conditions: vitals, medicines on time and a short update for the family after every visit.",
    addOns: ["blood-sugar-test", "tetanus-injection"],
    trust: "Trained in elder care",
    included: ["Vitals checked and noted", "Medicines given on time", "Family updated after the visit"],
    excluded: ["Medicines", "A doctor consultation (book Doctor at home)"],
    goodToKnow: ["Keep the current prescriptions ready", "Tell us about any recent hospital stay"],
    steps: visitSteps(careStep("Care is given", "Vitals, medicines and a quick check up")),
    faqs: [{ q: "Can I book the same nurse every time?", a: "We try to send the same nurse for ongoing care. Ask when you book." }, ...commonFaqs],
    related: ["diabetes-support", "catheter-care"],
    keywords: ["elder", "chronic", "bp", "vitals", "old age", "care"],
  },
];

/** Ratings for each service (W1.06 Reviews, W7.02 Ratings). Same sample reviews for every service. */
const sampleReviews: Review[] = [
  { name: "Neha S.", date: "Sep 2026", rating: 5, text: "The nurse was gentle with my father and explained how to keep the dressing dry between visits." },
  { name: "Rahul M.", date: "Sep 2026", rating: 5, text: "On time, carried everything needed and the wound has healed well. Booking a follow up was easy." },
  { name: "Priya K.", date: "Aug 2026", rating: 5, text: "Very careful and clean. The visit started 10 minutes late, but the care itself was excellent." },
  { name: "Amit G.", date: "Aug 2026", rating: 4, text: "Good care and clear notes after each visit. I would like an earlier morning slot.", photos: true },
  { name: "Sunita R.", date: "Jul 2026", rating: 5, text: "Same nurse came every day for a week. My mother felt comfortable with her." },
  { name: "Vikram T.", date: "Jul 2026", rating: 3, text: "The care was fine, but the nurse had to call twice to find our building." },
];

const wd = { average: 4.9, count: "3.1K", stars: [
  { star: 5, count: 2600, label: "2.6K" },
  { star: 4, count: 340, label: "340" },
  { star: 3, count: 90, label: "90" },
  { star: 2, count: 40, label: "40" },
  { star: 1, count: 30, label: "30" },
] } satisfies RatingSummary;

export function ratingFor(service: Service): RatingSummary {
  return service.slug === "wound-dressing" ? wd : { ...wd, average: service.rating, count: service.reviews };
}

export function reviewsFor(service: Service): Review[] {
  // Same sample reviews for every service until the API is wired.
  return service ? sampleReviews : [];
}

/** Search (W6.02): recent searches shown before the user types, and popular services. */
export const defaultRecentSearches = ["Wound dressing", "Injection at home", "IV drips"];

export const popularSearches: { label: string; note: string; image: string; href: string }[] = [
  { label: "Wound dressing & care", note: "Nurse at home · ₹899", image: IMG.wound, href: routes.service("nurse", "wound-dressing") },
  { label: "Injection at home", note: "Nurse at home · ₹799", image: IMG.injections, href: routes.service("nurse", "injections") },
  { label: "Elder care", note: "Nurse at home", image: IMG.chronic, href: routes.service("nurse", "chronic-disease-support") },
  { label: "Catheter care", note: "Nurse at home · ₹999", image: IMG.catheter, href: routes.service("nurse", "catheter-care") },
  { label: "Post surgery care", note: "Nurse at home", image: IMG.catheter, href: routes.service("nurse", "post-surgery-wound-care") },
];

// ---------- lookups ----------

/** Element id of a group section on the category page (sidebar and tiles scroll to it). */
export const groupAnchor = (id: string) => `group-${id}`;

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getService = (category: string, slug: string) =>
  services.find((s) => s.category === category && s.slug === slug);
export const servicesIn = (category: string, group?: string) =>
  services.filter((s) => s.category === category && (!group || s.group === group));
export const getAddOn = (id: string) => addOns.find((a) => a.id === id);

export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Search: services and categories whose name or keywords contain the query. */
export function searchCatalogue(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return { services: [] as Service[], categories: [] as Category[] };
  const words = q.split(/\s+/);
  const score = (s: Service) => {
    const name = s.name.toLowerCase();
    if (name.startsWith(q)) return 3;
    if (name.includes(q)) return 2;
    if (words.every((w) => name.includes(w) || s.keywords.some((k) => k.includes(w) || w.includes(k)))) return 1;
    return 0;
  };
  const matched = services
    .map((s) => ({ s, n: score(s) }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)
    .map((x) => x.s);
  const cats = categories.filter(
    (c) => c.name.toLowerCase().includes(q) || matched.some((s) => s.category === c.slug),
  );
  return { services: matched, categories: cats };
}

/** Results page (W6.04): best match plus related services. */
export function searchResults(query: string) {
  const { services: matched } = searchCatalogue(query);
  const best = matched[0];
  if (!best) return null;
  const relatedSlugs = [...matched.slice(1).map((s) => s.slug), ...best.related];
  const related = [...new Set(relatedSlugs)]
    .filter((slug) => slug !== best.slug)
    .map((slug) => services.find((s) => s.slug === slug)!)
    .filter(Boolean)
    .slice(0, 4);
  return { best, related };
}
