import { journeys, site } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  const journeyLines = journeys
    .map(
      (journey) =>
        `- ${journey.title.en} (${journey.duration}): ${journey.bestFor.en}. Pace: ${journey.pace.en}. Arabic title: ${journey.title.ar}.`
    )
    .join("\n");

  const body = `# ${site.name} - Full AI Context

${site.positioning}

## Primary audience

The primary audience is Arabic-speaking Gulf travelers, especially Saudi and UAE families and couples considering private Jordan trips. English is supported as a secondary language.

## Current site scope

Phase 1 currently ships the homepage only, in Arabic and English. The launch plan calls for ten bilingual pages: Home, Private Jordan Trips, Weekend Escape, Family Journey, Full Jordan Journey, Luxury Desert & Dead Sea Escape, Family Travel, Luxury Travel, About & Trust, and Plan Your Trip / Contact. Destination pages and guide content are phase 2.

## Featured launch journeys

${journeyLines}

## What we offer

${site.llmsOffer}

Services include private itinerary planning, trusted guides and drivers, hotel and camp coordination, family pacing, premium stay selection, WhatsApp support, payment clarity, and emergency support during travel.

## Pricing and booking

${site.llmsPricing}

## Trust model

The brand should not publish a thin reviews page before real documented client stories exist. Until three to five client stories with permission and photos are available, trust should be built through operating-company transparency, team names and faces, clear payment terms, cancellation terms, contact details, and visible support promises.

## Known placeholders to verify before launch

- Final brand name and domain
- Legal operating company name
- Office address
- Founder and team biographies
- Licensing, accreditations, memberships, awards, and press mentions
- Final WhatsApp number, email, and social profiles
- Pricing display policy and first 90-day paid media budget

## Contact

Email: ${site.email}
Phone: ${site.phone}
WhatsApp: https://wa.me/${site.whatsapp}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
