// Placeholder saved addresses (W13.x / M13.x). Replace with the addresses API.

export const addressLabels = ["Home", "Work", "Hotel", "Other"] as const;
export type AddressLabel = (typeof addressLabels)[number];

export type SavedAddress = {
  id: string;
  /** Myself → one of the labels (Other needs `name`). Someone else → free `name` (optional). */
  contact: "myself" | "someone";
  label: AddressLabel;
  name: string;
  house: string;
  area: string;
  landmark: string;
  city: string;
  pincode: string;
  receiverName: string;
  receiverPhone: string; // "+91 98765 43210"
  lastBooked?: string; // "14 Oct"
};

export const seedAddresses: SavedAddress[] = [
  {
    id: "home",
    contact: "myself",
    label: "Home",
    name: "",
    house: "B 42",
    area: "Sector 15",
    landmark: "Near Sector 15 metro",
    city: "Noida",
    pincode: "201301",
    receiverName: "Rahul Sharma",
    receiverPhone: "+91 98765 43210",
    lastBooked: "14 Oct",
  },
  {
    id: "work",
    contact: "myself",
    label: "Work",
    name: "",
    house: "Plot 7",
    area: "Sector 62",
    landmark: "",
    city: "Noida",
    pincode: "201309",
    receiverName: "Rahul Sharma",
    receiverPhone: "+91 98765 43210",
    lastBooked: "22 Sep",
  },
];

/** Card title: the label, or the custom name for Other / someone else. */
export function addressTitle(a: SavedAddress) {
  if (a.contact === "someone") return a.name.trim() || `${a.receiverName.split(" ")[0]}'s address`;
  return a.label === "Other" ? a.name.trim() || "Other" : a.label;
}

/** "B 42, Sector 15, Near Sector 15 metro, Noida 201301". */
export const addressLine = (a: SavedAddress) =>
  [a.house, a.area, a.landmark, `${a.city} ${a.pincode}`.trim()].filter((s) => s.trim()).join(", ");

/** Short form for confirmations: "B 42, Sector 15, Noida". */
export const addressShort = (a: SavedAddress) => [a.house, a.area, a.city].filter((s) => s.trim()).join(", ");

/** Card icon: home for Home, location pin for everything else (as in W13.02). */
export const addressIcon = (a: SavedAddress) =>
  a.contact === "myself" && a.label === "Home" ? "/icons/auth/home-link-22.svg" : "/icons/auth/location-link-22.svg";
