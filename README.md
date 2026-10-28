# Dr. Morepen Home — website front end

**Live preview:** https://dmh-website-2ixn.onrender.com (Render free plan; the first load after it sleeps can take about a minute)

Next.js 15 (App Router) + Tailwind CSS v4 + TypeScript. Built from the Figma file
[claude reference DMH website](https://www.figma.com/design/CqJk10UtnsmFF60Wy9GAbA/claude-reference-DMH-website?node-id=0-1)
(a copy of the DMH WebApp "Development" page, 28 Oct 2026).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Scope

One responsive page per page type, desktop 1440 and mobile 393 from the same code. States that the
Figma shows as separate screens (errors, empty, filled, pop ups) are built as UI state on that page.
`docs/figma-screens.txt` lists every Figma screen with its node id.

## Conventions

- **Tokens** live in `src/app/globals.css` (`@theme`). Figma variable → class: `text/primary` → `text-ink`,
  `text/secondary` → `text-ink-2`, `surface/card` → `bg-card`, `border/card` → `border-line`,
  `border/field` → `border-field`, `brand/primary` → `bg-brand`, `brand/tint` → `bg-tint`, and so on (see the
  comment at the top of the file). Never put raw hex in components; add a token.
- **Type**: `font-display` = Instrument Sans (headings), default = Inter. Sizes `text-d40 h32 h24 h20 h18 b16 b14 b12`
  carry their line height; set weight with `font-medium` / `font-semibold`.
- **Layout**: `page` = 1120 content (home, listings), `page-narrow` = 960 (checkout, profile). Gutters 16 mobile,
  32 tablet. Breakpoint `md` (768) switches mobile → desktop layout; `lg` (1024) for wide two-column layouts.
- **Clickable things** get the `state` class (or `state-dark` on dark fills) — the Figma "State layer": hover 4%/10%
  ink, pressed 8%/20%, no hover on touch.
- **Shell**: Home uses `SiteHeader variant="hero"` + `MobileHeroHeader`. Every other page uses `PageShell`
  (desktop nav + mobile `MobileAppBar` with back, title, actions).
- **Links** come from `src/lib/routes.ts`; each route notes its Figma screen id. External links (health plan, terms,
  privacy) open in a new tab.
- **Content** (services, prices, coupons, the ₹49 tax, bookings…) is placeholder data in `src/data/*`. Replace with
  API calls; components only read from there.
- **Images and icons** are the exact Figma exports in `public/img` and `public/icons`. `CropImg` reproduces Figma's
  image crops (offset + scale inside a clipped frame), used for sprites such as the 3D service icons.
- **Loading** states (Figma section 20) are `loading.tsx` skeletons per route.

## Pages

| Route | Figma screens |
|---|---|
| `/` | W1.01 / M1.01 Home (+ W20.01 skeleton) |
| `/services/[category]` | W1.02, W1.03 list view, W7.02 ratings (`?reviews=<slug>`) |
| `/services/[category]/[slug]` | W1.04–W1.07 service detail pop up (add-ons, how it works, reviews) |
| `/search` + nav search dropdown | W6.02–W6.06 |
| `/checkout` | W1.08, W1.15, W1.18, W2.05–W2.11, W3.04, W3.07–W3.09 |
| `/checkout/slot`, `/checkout/coupons` | W1.16–W1.17, W3.02–W3.06 |
| `/booking/confirmed` | W1.19 |
| `/login`, `/login/verify` | W1.09, W1.10, W4.02–W4.05 (`?next=` returns to where the user came from) |
| `/onboarding/details`, `/onboarding/address`, `/onboarding/location` | W1.11–W1.14, W5.03–W5.06 |
| `/location` | W5.02 Choose location |
| `/care-team`, `/care-team/callback`, `/care-team/callback/requested`, `/lab-test` | W8.02–W8.11, W9.02–W9.03 |
| `/profile`, `/profile/details`, `/profile/help` | W10.01, W11.01–W11.03, W14.02–W14.03 (desktop nav opens the menu as a dropdown) |
| `/profile/bookings` | W12.02–W12.09 (`?tab=past|cancelled`) |
| `/profile/bookings/[id]`, `/profile/bookings/[id]/rate` | W17.02–W17.07, W18.02–W18.11 |
| `/profile/addresses`, `/profile/addresses/new`, `/profile/addresses/[id]/edit` | W13.02–W13.08 |
| `/professionals/[id]` | W19.02 |
| not-found, error boundary, offline toast, `loading.tsx` per route | W15.01–W15.04, W20.x |

## Demo states (placeholder data, no backend)

- `/checkout?demo=guest|choose|ready|repeat|coupon|failed|slot-taken|expired|empty`
- `?demo=1` on profile pages signs in the demo user, `?demo=0` signs out.
- OTP: `1234` is correct, `0000` = expired, 3 wrong tries = locked for 10 min (rules in `src/data/auth.ts`).
- Cart, session, location, addresses and ratings live in localStorage until APIs exist (`src/lib/*`).

## Figma inconsistencies found while building

- Phone: checkout shows +91 98765 76542, confirmation says +91 98765 43210 (code uses the session phone).
- W3.07 still says "Save up to ₹150 more" after removing a service (cart ₹899, FIRSTVISIT needs ₹999+).
- Nurse listing says "6 services" on desktop; mobile and search have 7. Mobile tile typo "Procuderes at home".
- Professional profile: 4.9 / 234 reviews in the header vs 4.8 / 112 in the reviews card; rating bars not to scale.
- W12.05 is filtered to 14 Oct but shows a 4 Oct booking.
- OTP has 4 boxes (not 6). Mobile home search placeholder is white on white (built as grey).
- Several close buttons are 73 px pills with 40 px hit areas (built as 40 px round buttons).
- Some images are reused for the wrong service (e.g. Blood sugar test uses the wound-dressing photo).
- Missing links in Figma (Share, add-on "View details", banner "Book a visit" on the category page) — see the code comments.
