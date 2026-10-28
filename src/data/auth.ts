// Placeholder content for log in, onboarding and location (Figma W1.09–W1.14, W4.x, W5.x, W20.12/16/17).
// Replace the demo rules with the real OTP and geocoding APIs.

export const login = {
  countryCode: "+91",
  phoneLength: 10,
  phonePlaceholder: "98765 43210",
};

/**
 * OTP demo rules. Figma shows 4 boxes, so the demo code is "1234". Anything else is "wrong";
 * after `maxAttempts` wrong tries the code locks for `lockSeconds` (W4.05 "Try again in 09:59").
 * A code older than `expirySeconds` is "expired" (W4.04). Resend unlocks after `resendSeconds` (W4.02 "0:30").
 */
export const otp = {
  length: 4,
  demoCode: "1234",
  maxAttempts: 3,
  lockSeconds: 600,
  expirySeconds: 300,
  resendSeconds: 30,
  verifyMs: 1200,
};

export const genders = ["Male", "Female", "Other"] as const;
export const addressLabels = ["Home", "Work", "Other"] as const;

export type Place = {
  title: string;
  line: string;
  area: string;
  city: string;
  pincode: string;
  served: boolean;
};

/** Address the "Use my current location" / map pin resolves to (W1.13 address card). */
export const detectedPlace: Place = {
  served: true,
  title: "Sector 15",
  line: "B Block, Sector 15, Noida, Uttar Pradesh 201301",
  area: "Sector 15",
  city: "Noida",
  pincode: "201301",
};

/** Search results (W1.14). `served: false` opens W5.05 "We don't serve this area yet". */
export const places: Place[] = [
  { title: "Sector 18 Market", line: "Sector 18, Noida, Uttar Pradesh 201301", area: "Sector 18", city: "Noida", pincode: "201301", served: true },
  { title: "Sector 18 Metro Station", line: "Sector 18, Noida, Uttar Pradesh 201301", area: "Sector 18", city: "Noida", pincode: "201301", served: true },
  { title: "Atta Market", line: "Sector 18, Noida, Uttar Pradesh 201301", area: "Sector 18", city: "Noida", pincode: "201301", served: true },
  { title: "Sector 18, Noida", line: "Uttar Pradesh 201301", area: "Sector 18", city: "Noida", pincode: "201301", served: true },
  { title: "Sector 15", line: "B Block, Sector 15, Noida, Uttar Pradesh 201301", area: "Sector 15", city: "Noida", pincode: "201301", served: true },
  { title: "Sector 62", line: "Sector 62, Noida, Uttar Pradesh 201309", area: "Sector 62", city: "Noida", pincode: "201309", served: true },
  { title: "Cyber City", line: "DLF Cyber City, Gurugram, Haryana 122002", area: "DLF Cyber City", city: "Gurugram", pincode: "122002", served: true },
  { title: "Meerut Cantt", line: "Meerut Cantonment, Meerut, Uttar Pradesh 250001", area: "Meerut Cantonment", city: "Meerut", pincode: "250001", served: false },
  { title: "Sonipat", line: "Sonipat, Haryana 131001", area: "Sonipat", city: "Sonipat", pincode: "131001", served: false },
];

/**
 * Labels drawn on the placeholder map (W1.13 / M1.12), in the map's base 393×758 coordinates (mobile scale;
 * desktop draws it at 1.95×). Dragging the map picks the label nearest the pin as the visit place.
 */
export const mapLabels: { text: string; x: number; y: number; place: Omit<Place, "served"> }[] = [
  { text: "Sector 15", x: 30, y: 150, place: { title: "Sector 15", line: "B Block, Sector 15, Noida, Uttar Pradesh 201301", area: "Sector 15", city: "Noida", pincode: "201301" } },
  { text: "Sector 16", x: 290, y: 120, place: { title: "Sector 16", line: "A Block, Sector 16, Noida, Uttar Pradesh 201301", area: "Sector 16", city: "Noida", pincode: "201301" } },
  { text: "Central Park", x: 160, y: 150, place: { title: "Central Park", line: "Central Park, Sector 16, Noida, Uttar Pradesh 201301", area: "Sector 16", city: "Noida", pincode: "201301" } },
  { text: "Sector 14", x: 40, y: 470, place: { title: "Sector 14", line: "C Block, Sector 14, Noida, Uttar Pradesh 201301", area: "Sector 14", city: "Noida", pincode: "201301" } },
  { text: "Sector 18", x: 300, y: 400, place: { title: "Sector 18", line: "Sector 18, Noida, Uttar Pradesh 201301", area: "Sector 18", city: "Noida", pincode: "201301" } },
];

export type SavedAddress = {
  id: string;
  label: "Home" | "Work" | "Other";
  line: string;
  short: string;
  full: string;
  phone: string;
  lastBooked: string;
};

/** W5.02 "Your saved addresses". */
export const savedAddresses: SavedAddress[] = [
  {
    id: "home",
    label: "Home",
    line: "B 42, Sector 15, Near Sector 15 metro, Noida 201301",
    short: "Sector 15",
    full: "Sector 15, Noida",
    phone: "+91 98765 43210",
    lastBooked: "Last booked on 14 Oct",
  },
  {
    id: "work",
    label: "Work",
    line: "Plot 7, Sector 62, Noida 201309",
    short: "Sector 62",
    full: "Sector 62, Noida",
    phone: "+91 98765 43210",
    lastBooked: "Last booked on 22 Sep",
  },
];
