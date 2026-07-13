import { site } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${site.name}

${site.positioning}

## Core pages

- Home Arabic (/ar): Arabic-first homepage for private Jordan journeys, routing visitors by travel desire.
- Home English (/en): English version of the homepage for private Jordan travel packages.
- Plan Your Trip (/ar#contact and /en#contact): Short lead form and WhatsApp path for consultation-led trip planning.

## What we offer

${site.llmsOffer}

The launch focus is Jordan only. Japan is intentionally held for a future separate brand. The Jordan site is designed for Saudi and UAE travelers who want private planning, family comfort, trusted drivers and guides, premium stays, WhatsApp support, and clear payment and cancellation expectations.

## Pricing and booking model

${site.llmsPricing}

## Brand context

Jordan by Local is the provisional consumer-facing brand name. The operating company name, office address, accreditations, founder details, and final domain must be confirmed before public launch and then updated in visible content and structured data.

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
