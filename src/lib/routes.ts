// One route per page type. Screen ids from the Figma file are noted so links match the prototype.
export const routes = {
  home: "/", // W1.01 / M1.01
  category: (slug: string) => `/services/${slug}`, // W1.02 Nurse at home (grid), W1.03 list view
  service: (category: string, slug: string) => `/services/${category}/${slug}`, // W1.04 Service detail
  checkout: "/checkout", // W1.08 guest, W1.18 ready to confirm
  checkoutSlot: "/checkout/slot", // W1.16 Pick a slot, W1.17 Pick a date
  coupons: "/checkout/coupons", // W3.02
  bookingConfirmed: "/booking/confirmed", // W1.19
  login: "/login", // W1.09 Phone number
  verify: "/login/verify", // W1.10 Verify code
  yourDetails: "/onboarding/details", // W1.11 Your details
  address: "/onboarding/address", // W1.12 Address
  visitLocation: "/onboarding/location", // W1.13 Set visit location (map)
  chooseLocation: "/location", // W5.02 Choose location
  search: "/search", // W6.02–W6.06
  careTeam: "/care-team", // W8.02
  callback: "/care-team/callback", // W8.05
  callbackRequested: "/care-team/callback/requested", // W8.08
  labTest: "/lab-test", // W9.02
  profile: "/profile", // W10.01 logged out, W11.01 menu
  personalDetails: "/profile/details", // W11.02
  bookings: "/profile/bookings", // W12.02
  booking: (id: string) => `/profile/bookings/${id}`, // W17.x, W18.02
  rateVisit: (id: string) => `/profile/bookings/${id}/rate`, // W18.03
  addresses: "/profile/addresses", // W13.02
  addAddress: "/profile/addresses/new", // W13.06
  editAddress: (id: string) => `/profile/addresses/${id}/edit`, // W13.04
  help: "/profile/help", // W14.02
  professional: (id: string) => `/professionals/${id}`, // W19.02
} as const;

export const external = {
  healthPlan: "https://morepenhome.com/",
  terms: "https://www.drmorepenhome.com/terms-and-condition-dr-morepen-home",
  privacy: "https://www.drmorepenhome.com/privacy-policy-dr-morepen-home",
} as const;
