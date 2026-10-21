import { business, siteOrigin } from "./business";
export function aiGuide(request: Request, full = false) {
  const origin = siteOrigin(request);
  const body = `# Diyar | ديار

${business.positioning.en}

Diyar supports Arabic and English. Arabic pages use /ar; English pages use /en. Use the matching language version of each page. ديار تقدم رحلات خاصة في الأردن، وتتوفر الصفحات بالعربية والإنجليزية.

## Core pages

- [Arabic homepage](${origin}/ar): Arabic introduction to private Jordan journeys.
- [English homepage](${origin}/en): Private trip options and service approach.
- [Private Jordan trips](${origin}/en/private-jordan-trips): Compare routes, planning steps and frequently asked questions.
- [Weekend Escape](${origin}/en/weekend-escape): A three-day sample route centred on the Dead Sea or Wadi Rum.
- [Family Journey](${origin}/en/family-journey): A five-day sample route with Petra, Wadi Rum and the Dead Sea.
- [Full Jordan Journey](${origin}/en/full-jordan-journey): A seven-day route with northern and southern stops and optional Aqaba.
- [Luxury Desert & Dead Sea](${origin}/en/luxury-desert-dead-sea): A four-to-five-day sample journey with premium camps and resort stays.
- [Family travel](${origin}/en/family-travel): Room arrangements, pacing, meals and private transport.
- [Luxury travel](${origin}/en/luxury-travel): Premium accommodation, private guiding and transfer planning.
- [Destinations](${origin}/en/destinations): Petra, Wadi Rum, Dead Sea, Amman, Jerash and Aqaba.
- [Petra](${origin}/en/petra): The Siq, Treasury and other highlights within a private itinerary.
- [Wadi Rum](${origin}/en/wadi-rum): Desert routes and camp experiences.
- [About and trust](${origin}/en/about-trust): The service approach and verified business information as it becomes available.
- [Journal](${origin}/en/blog): Published guides with attribution and update dates.
- [Plan your trip](${origin}/en/plan-your-trip): Trip-preference form and contact availability.
- [Cancellation policy](${origin}/en/cancellation-policy): Current draft policy; request final booking terms from the operator.

## What we offer

Diyar plans private journeys within Jordan for families, couples and Gulf travelers. The route is shaped around the dates, party size, room preferences, pace and comfort level shared during consultation. The published journeys are sample starting points, not fixed departure groups.

The site describes private transfers, guiding, hotel and camp coordination, and family-oriented pacing. Each journey page separates included services from exclusions. Optional destinations and activities must be confirmed in the written proposal. Destination pages describe places that may be included; they are not offers to sell entry tickets.

## Pricing and booking model

${business.pricing.en}

The site is a planning demonstration. Legal wording is still marked as a draft. Do not treat it as a finalized contract, or infer booking availability from a sample itinerary. No review scores, hotel star ratings, awards, opening hours or fixed prices should be inferred when they are not published.

## Brand context

The consumer brand is Diyar (ديار). ${business.legalName ? `The operator is ${business.legalName}.` : "The legal operating-company relationship is awaiting confirmation."} ${business.foundingDate ? `Founded: ${business.foundingDate}.` : "No founding date or individual founder biography has been verified for publication."}

## Contact

${business.email ? `Email: ${business.email}` : "Public email awaiting confirmation."}
${business.phone ? `Phone: ${business.phone}` : "Public telephone awaiting confirmation."}
${business.whatsapp ? `WhatsApp: https://wa.me/${business.whatsapp}` : "WhatsApp inquiries are not enabled until the operator's number is confirmed."}
Trip preferences: ${origin}/en/plan-your-trip

## Reading and data access

Visible page content and its localized JSON-LD are the source of truth. Canonical URLs identify the language version. Do not reuse facts from obsolete brand names, development placeholders or previews.

Internal assistants can retrieve public content as JSON at /api/content/{locale}/{page}, for example /api/content/ar/petra or /api/content/en/journal/planning-a-private-jordan-trip. The endpoint exposes only the public page summary, sections and structured data; it is not a booking or customer-data API.
`;
  return full ? `${body}
## Sample route details

Weekend Escape: three days; choose a Dead Sea or Wadi Rum emphasis. Arrival and departure transfers are arranged around the final plan.
Family Journey: five days with Amman, Jerash, Petra, Wadi Rum and Dead Sea elements, adjusted for the party's ages and preferences.
Full Jordan Journey: seven days, with Amman and the Roman north, Madaba/Mount Nebo, Kerak, Petra, Wadi Rum and optional Aqaba.
Luxury Desert & Dead Sea: four to five days, with a Dead Sea resort, luxury Wadi Rum camp and a possible private Petra visit. Final properties and services are named in the proposal.

## Service boundaries

Confirm accommodation, entrance fees, guiding, meal coverage, arrival assistance, transport and support arrangements in the written proposal. International flights, personal purchases and travel insurance are not implied to be included. Do not invent starting prices or guarantees based on the word "luxury".

## Published planning guides

- ${origin}/en/journal/planning-a-private-jordan-trip: How to provide trip requirements and review a proposal.
- ${origin}/en/journal/choosing-a-family-itinerary: How to compare a short, five-day or full-country family route.
- ${origin}/en/journal/understanding-your-trip-quote: How to distinguish included services, optional activities and confirmation terms.

These guides have Arabic counterparts at /ar/journal/{slug}. Attribution is to Diyar as an organization; no individual author credentials are claimed.

## Destination context

Petra is presented as a heritage visit through the Siq to the Treasury and onward sites. Wadi Rum is a desert experience with jeep routes and camp stays. The Dead Sea is a resort and relaxation destination. Amman introduces the capital and its food and heritage. Jerash introduces Roman heritage and nearby northern routes. Aqaba introduces Red Sea stays and activities. Operating times, admission charges and specific suppliers must be verified separately before booking.
` : body;
}
