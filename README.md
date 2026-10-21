# Diyar Jordan travel site

## Run and verify

Use Node 22.14 or newer. Run `npm ci`, then `npm run dev`. `npm run build` and `npm run start` run the production site. Arabic is at `/ar`, English at `/en`; legacy unprefixed content URLs redirect to the matching English page, and `/` redirects to the Arabic homepage.

- `npm run lint`
- `npm run test:localization` builds, starts a temporary production server on port 3100 and tests all 48 language versions, metadata, semantics, linked schemas, public content feeds, crawler files, navigation and safe WhatsApp draft composition. The tests send no messages.
- `SITE_TEST_URL=http://127.0.0.1:3000 node --test tests/localization.test.mjs` tests an already running production server.
- `npm run prepare:assets` rebuilds responsive WebP images, 1200×630 branded share cards and the logo from the existing images. Fonts are self-hosted WOFF2 with their OFL licences.
- `npm run check:launch` requires confirmed business facts and recorded launch validations. It intentionally fails while those are missing.

## Public content and metadata

`content/pages.json` defines the page types, localized titles and descriptions, images and actual editorial update dates. `content/articles.json` holds the bilingual guide content and publication dates. These repository-backed records are the content store; there is no external hosted CMS account connected yet. `lib/content-service.ts` is the adapter boundary for a future CMS.

The existing HTML templates remain in `Diyar/`. `lib/diyar-localization.ts` and `lib/diyar-ar.json` translate the shared templates. Update the translation key when changing English template text, and run tests to catch untranslated copy. Arabic uses Tajawal and right-to-left placement. Mobile navigation is a native disclosure with Escape and outside-click dismissal.

`lib/document.ts` enriches the rendered HTML itself, rather than relying on React layouts that do not run for route handlers. It applies semantic markup, visible dated content, contact configuration, canonical/hreflang and social metadata, responsive images, accessibility refinements, and JSON-LD in the head. Visible content and structured data are extracted from the same final document.

`lib/structured-content.ts` builds a connected graph with TravelAgency, WebSite, page, breadcrumb, trip, attraction/destination, article and FAQ entities where applicable. Founders, memberships, awards and reviews render only when real records are supplied. No hotel detail pages exist, so no invented hotel ratings or property claims are emitted. SearchAction is omitted because the site has no search.

Schema.org TouristTrip does not define `duration` or `includedServices` properties. Sample duration and inclusions are represented by a related CreativeWork (`timeRequired` and `text`); day labels are kept on ordered list entries, while recognized stops link to the actual destination/attraction entities. Alternative or unspecified stops remain at country level rather than being invented as named places. Petra's coordinates and heritage note use UNESCO; its date-bounded hours use Visit Petra. Jerash's reference point and heritage context use the Jordan Tourism Board, while its visible seasonal hours table links to Jordan Pass. The Jordan Pass table overlaps April between seasons, so it is not converted into a falsely precise machine schedule. Sources and verification dates are stored in `content/attraction-facts.json`.

## Internal AI content access

`GET /api/content/{locale}/{page}` returns public-only structured content, for example `/api/content/ar/petra`, `/api/content/en/home` or `/api/content/en/journal/planning-a-private-jordan-trip`. It returns title, description, sections, dates, itinerary, inclusions, FAQs and the matching schema graph. Unknown locale/path combinations return 404. No customer data, credentials or draft business records are exposed. Responses include `X-Robots-Tag: noindex, nofollow`, and every allowed crawler is explicitly blocked from API/admin/studio routes.

`/llms.txt` and `/llms-full.txt` are curated editorial guides to the current Diyar site. They explain sample routes, the consultation pricing model and the difference between the planning demo and confirmed bookable services. They are not sitemap dumps.

The sitemap reads public content records and includes all 48 canonical language URLs with their real update dates and ar/en/x-default alternatives. Speculative weekly change frequencies have been removed.

## Business facts and launch configuration

Fill `content/business.json` with verified public information. Set `SITE_URL` or `productionUrl` to the confirmed HTTPS origin. Until configured, local metadata uses the request's local origin; no guessed production domain is published. Confirm whether Diyar is operated by Edom Tours before adding that legal relationship. Commercial registration and tourism licensing must be stated accurately and linked to their evidence.

The business record accepts founder/team biographies with credentials, a complete bilingual postal address, public contacts, social profiles, memberships, awards, press links and consented reviews. Only configure facts approved for publication. Empty arrays mean no verified records are available, not that records should be fabricated. Reviews need author, date, body, rating and a source URL.

Placeholder phone/email links are removed from the public document. WhatsApp inquiries remain unavailable until a real operator number is supplied. The form uses native validation and an accessible status message; confirmed WhatsApp drafts open in the same tab so blocked pop-up windows do not lose requests. The legal templates remain explicitly marked as drafts and require operator/legal review before bookings open.

## Audits and launch verification

Use Lighthouse against a production server with mobile throttling, not `next dev`. Save the JSON report and review every failed audit. Scores are laboratory measurements and are not evidence of real-user Core Web Vitals. Record actual audits in `content/launch-verification.json`; do not set a check to passed without dated evidence.

Before public launch, complete Rich Results Test and Schema.org validation against final content, PageSpeed/field measurement on the deployed origin, manual VoiceOver/NVDA testing, preview checks on real sharing platforms, Search Console/Bing submissions and external AI summary checks. These require the confirmed production domain and, in several cases, owner accounts or real-user traffic. Robots rules express crawler preferences; they do not replace authentication for any future private admin routes.

GitHub Actions runs lint, build and the site tests. No deployment is configured by this task. Remaining development-only audit findings should be assessed separately; do not downgrade Next or force dependency fixes to silence them.

### Homepage concierge controls

The homepage uses server-rendered native controls and `public/assets/js/concierge.js`.
Selections use validated `who`, `days`, `pace`, `tier` and repeated `need` query parameters.
The full inquiry form preserves those selections in the WhatsApp draft. Merely changing
preferences or clicking the full-form link does not send a message.

`content/concierge.json` holds optional approved facts:

- `person`: `{ "name": "…", "image": "/assets/…" }` — use a consented real portrait.
- `workingHours`: `{ "weekdays": [0,1,2,3,4], "start": 9, "end": 18 }` — weekdays use Sunday=0; timezone is Asia/Amman.
- `replyMinutes`: a measured typical reply time; leave null until supported.
- `prices`: trip slug → `boutique` / `luxury` → `{ "amount": 1880, "currency": "USD", "basis": { "en": "per person, …", "ar": "للشخص، …" } }`. Amounts require a confirmed trip/tier, occupancy basis and inclusions before publication. This example is a format, not a published price.
- `hotelOptions`: trip slug → tier → `{ "name": "…", "image": "/assets/…" }`. Publish confirmed examples with appropriately licensed images.
- `driveMinutes`: keys such as `amman-petra`, with reviewed planning estimates. No time is shown for an unconfigured leg.
- `refundBands`: approved `{ "minDays": 30, "percent": 50 }` bands, sorted at runtime. Empty bands show the written-policy explanation; no percentage is invented.

The seasonal helper deliberately uses sourced qualitative climate guidance, not unverified
monthly temperature numbers, school calendars or assumed Eid dates. The desert photograph
is a destination photograph, not a claim that a particular camp is included. The English
and Arabic positioning remain intentionally different (homepage review item 10).
