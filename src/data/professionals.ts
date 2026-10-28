// Placeholder professional profiles (W19.02 / M19.02). Replace with the professionals API.

export type ProfessionalReview = {
  id: string;
  name: string; // "Neha S."
  date: string; // "Sep 2026"
  rating: number; // 1–5
  text: string;
};

export type Professional = {
  id: string;
  name: string;
  firstName: string;
  pronoun: "her" | "him" | "them";
  role: string; // "Verified & trained nurse" (booking cards)
  badge: string; // "Verified nurse"
  photo: string; // 192×192 export, shown at 96
  thumb: string; // 96×96 export, shown at 48
  stats: { experience: string; rating: string; ratingCount: string; visits: string };
  about: { label: string; value: string }[];
  reviewSummary: {
    average: string;
    count: number;
    /** Number of reviews per star, 5 → 1. */
    breakdown: [number, number, number, number, number];
  };
  reviews: ProfessionalReview[];
};

export const reviewFilters = ["Most relevant", "All", "Positive", "Critical", "With photos"] as const;
export type ReviewFilter = (typeof reviewFilters)[number];

export const professionals: Professional[] = [
  {
    id: "sunita-rawat",
    name: "Sunita Rawat",
    firstName: "Sunita",
    pronoun: "her",
    role: "Verified & trained nurse",
    badge: "Verified nurse",
    photo: "/img/booking/pro-sunita-rawat-192.png",
    thumb: "/img/booking/pro-sunita-rawat.png",
    stats: { experience: "5+ yrs", rating: "4.9", ratingCount: "234 Reviews", visits: "320" },
    about: [
      { label: "Qualification", value: "GNM, Diploma in Nursing" },
      { label: "Joined on", value: "March 2023" },
      { label: "Languages", value: "Hindi, English" },
    ],
    reviewSummary: { average: "4.8", count: 112, breakdown: [98, 9, 3, 1, 1] },
    reviews: [
      {
        id: "r1",
        name: "Neha S.",
        date: "Sep 2026",
        rating: 5,
        text: "The nurse was gentle with my father and explained how to keep the dressing dry between visits.",
      },
      {
        id: "r2",
        name: "Rahul M.",
        date: "Sep 2026",
        rating: 5,
        text: "On time, carried everything needed and the wound has healed well. Booking a follow up was easy.",
      },
      {
        id: "r3",
        name: "Priya K.",
        date: "Aug 2026",
        rating: 5,
        text: "Very careful and clean. The visit started 10 minutes late, but the care itself was excellent.",
      },
      {
        id: "r4",
        name: "Amit V.",
        date: "Aug 2026",
        rating: 4,
        text: "Professional and polite. Took a little longer than expected, but she made sure my mother was comfortable.",
      },
      {
        id: "r5",
        name: "Kavita D.",
        date: "Jul 2026",
        rating: 5,
        text: "Changed the dressing quickly and showed us what to watch for. We have booked her again.",
      },
      {
        id: "r6",
        name: "Sanjay P.",
        date: "Jul 2026",
        rating: 3,
        text: "Care was good, but she arrived 20 minutes after the slot and we were not told in advance.",
      },
    ],
  },
];

export const getProfessional = (id: string) => professionals.find((p) => p.id === id);
