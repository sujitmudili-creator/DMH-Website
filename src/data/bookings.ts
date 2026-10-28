// Placeholder bookings for "My bookings" (W12.x / M12.x) and Booking details (W17.x, W18.x).
// Replace with the bookings API. Dates are local (Asia/Kolkata); "today" in the Figma is Wed, 28 Oct 2026.

export type BookingStatus = "upcoming" | "past" | "cancelled";

export type BookingProfessional = {
  id: string;
  name: string;
  role: string; // "Verified & trained nurse"
  photo: string; // 64×64 export, shown at 32
};

export type BookingAddress = {
  label: string; // "Home", "Work"
  line: string; // "B 42, Sector 15, Noida"
};

export type Booking = {
  id: string;
  service: string; // card title, e.g. "Wound dressing & care"
  serviceCount: number; // "2 services"
  /** ISO local date-time of the visit slot. */
  date: string;
  status: BookingStatus;
  /** Header label: Confirmed / Completed / Cancelled. */
  statusLabel: string;
  /** null while the care team is still assigning someone. */
  professional: BookingProfessional | null;
  address: BookingAddress;
  price: number; // ₹, what is or was charged
  priceNote: string; // "Pay after your visit", "Paid after visit", "Late cancellation fee", "Not charged"
  /** Past visits: stars given (1–5), or null when not rated yet. */
  rating?: number | null;
  /** Booking details page (W17.x, W18.x). */
  patient?: { name: string; gender: string };
  items?: BookingItem[];
  taxes?: number; // ₹
  /** Cancelled bookings: late cancellation fee charged (₹); 0 or missing when cancelled in time. */
  cancellationFee?: number;
};

export type BookingItem = { name: string; image: string; price: number; mrp: number };

const woundAndTetanus: BookingItem[] = [
  { name: "Wound dressing & care", image: "/img/step-home.jpg", price: 899, mrp: 1199 },
  { name: "Tetanus injection at home", image: "/img/services/injections.jpg", price: 799, mrp: 999 },
];
const rahul = { name: "Rahul Sharma", gender: "Male" };

const sunita: BookingProfessional = {
  id: "sunita-rawat",
  name: "Sunita Rawat",
  role: "Verified & trained nurse",
  photo: "/img/profile/pro-sunita.png",
};

const home: BookingAddress = { label: "Home", line: "B 42, Sector 15, Noida" };
const work: BookingAddress = { label: "Work", line: "Plot 7, Sector 62, Noida" };

export const bookings: Booking[] = [
  {
    id: "DMH-24816",
    service: "Wound dressing & care",
    serviceCount: 2,
    date: "2026-10-28T17:00",
    status: "upcoming",
    statusLabel: "Confirmed",
    professional: sunita,
    address: home,
    price: 1747,
    priceNote: "Pay after your visit",
    patient: rahul,
    items: woundAndTetanus,
    taxes: 49,
  },
  {
    id: "DMH-24871",
    service: "Injection at home",
    serviceCount: 1,
    date: "2026-11-01T10:00",
    status: "upcoming",
    statusLabel: "Confirmed",
    professional: null,
    address: home,
    price: 799,
    priceNote: "Pay after your visit",
    patient: rahul,
    items: [{ name: "Injection at home", image: "/img/services/injections.jpg", price: 750, mrp: 999 }],
    taxes: 49,
  },
  {
    id: "DMH-24533",
    service: "Wound dressing & care",
    serviceCount: 2,
    date: "2026-10-14T17:00",
    status: "past",
    statusLabel: "Completed",
    professional: sunita,
    address: home,
    price: 1747,
    priceNote: "Paid after visit",
    rating: null,
    patient: rahul,
    items: woundAndTetanus,
    taxes: 49,
  },
  {
    id: "DMH-24410",
    service: "IV drips",
    serviceCount: 1,
    date: "2026-10-04T10:00",
    status: "past",
    statusLabel: "Completed",
    professional: sunita,
    address: home,
    price: 1499,
    priceNote: "Paid after visit",
    rating: 5,
    patient: rahul,
    items: [{ name: "IV drips", image: "/img/services/iv-drips.jpg", price: 1450, mrp: 1799 }],
    taxes: 49,
  },
  {
    id: "DMH-24790",
    service: "Wound dressing & care",
    serviceCount: 2,
    date: "2026-10-26T11:00",
    status: "cancelled",
    statusLabel: "Cancelled",
    professional: sunita,
    address: home,
    price: 500,
    priceNote: "Late cancellation fee",
    patient: rahul,
    items: woundAndTetanus,
    cancellationFee: 500,
  },
  {
    id: "DMH-24102",
    service: "Catheter care",
    serviceCount: 1,
    date: "2026-09-22T18:30",
    status: "cancelled",
    statusLabel: "Cancelled",
    professional: null,
    address: work,
    price: 999,
    priceNote: "Not charged",
    patient: rahul,
    items: [{ name: "Catheter care", image: "/img/services/catheter-care.jpg", price: 950, mrp: 1199 }],
    cancellationFee: 0,
  },
];

export const getBooking = (id: string) => bookings.find((b) => b.id === id);

export const bookingsByStatus = (status: BookingStatus) => bookings.filter((b) => b.status === status);

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-28T17:00" → "Wed, 28 Oct". Parsed by hand so server and client agree regardless of time zone. */
export function formatBookingDay(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${DAYS[day]}, ${d} ${MONTHS[m - 1]}`;
}

/** "2026-10-28T17:00" → "5:00 PM". */
export function formatBookingTime(iso: string) {
  const [h, min] = iso.slice(11, 16).split(":").map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(min).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/** Card header: "Wed, 28 Oct · 5:00 PM". */
export const formatBookingSlot = (iso: string) => `${formatBookingDay(iso)} · ${formatBookingTime(iso)}`;

/** "₹1,747" (Indian grouping). */
export const formatRupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
