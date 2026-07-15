import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const diyarPages = [
  "private-jordan-trips",
  "destinations",
  "petra",
  "wadi-rum",
  "dead-sea",
  "jerash",
  "amman",
  "aqaba",
  "weekend-escape",
  "family-journey",
  "full-jordan-journey",
  "luxury-desert-dead-sea",
  "family-travel",
  "luxury-travel",
  "about-trust",
  "blog",
  "privacy",
  "terms",
  "cancellation-policy",
  "plan-your-trip",
] as const;

export type DiyarPage = (typeof diyarPages)[number];

const pageFiles = {
  home: "index.html",
  "private-jordan-trips": "private-jordan-trips.html",
  destinations: "destinations.html",
  petra: "petra.html",
  "wadi-rum": "wadi-rum.html",
  "dead-sea": "dead-sea.html",
  jerash: "jerash.html",
  amman: "amman.html",
  aqaba: "aqaba.html",
  "weekend-escape": "weekend-escape.html",
  "family-journey": "family-journey.html",
  "full-jordan-journey": "full-jordan-journey.html",
  "luxury-desert-dead-sea": "luxury-desert-dead-sea.html",
  "family-travel": "family-travel.html",
  "luxury-travel": "luxury-travel.html",
  "about-trust": "about-trust.html",
  blog: "blog.html",
  privacy: "privacy.html",
  terms: "terms.html",
  "cancellation-policy": "cancellation-policy.html",
  "plan-your-trip": "plan-your-trip.html",
} satisfies Record<DiyarPage | "home", string>;

const htmlRoutes = new Map<string, string>([
  ["index", ""],
  ...diyarPages.map((page) => [page, page] as const),
]);

const oldFooterColumns = `<div class="footer-col"><h4>Journeys</h4><a href="weekend-escape.html">Weekend Escape</a><a href="family-journey.html">Family Journey</a><a href="luxury-desert-dead-sea.html">Luxury Desert &amp; Dead Sea</a><a href="full-jordan-journey.html">Full Jordan</a></div><div class="footer-col"><h4>Explore</h4><a href="destinations.html">Destinations</a><a href="private-jordan-trips.html">Private Jordan trips</a><a href="family-travel.html">Family travel</a><a href="luxury-travel.html">Luxury travel</a><a href="blog.html">Journal</a><a href="about-trust.html">About &amp; trust</a></div>`;

const newFooterColumns = `<div class="footer-col"><h4>Journeys</h4><a href="private-jordan-trips.html">Private Jordan trips</a><a href="family-travel.html">Family travel</a><a href="luxury-travel.html">Luxury travel</a></div><div class="footer-col"><h4>Explore</h4><a href="destinations.html">Destinations</a><a href="blog.html">Journal</a><a href="about-trust.html">About &amp; trust</a></div>`;

const textEncodingFixes = [
  ["\ufeff", ""],
  ["\u00e2\u20ac\u201d", "\u2014"],
  ["\u00e2\u20ac\u201c", "\u2013"],
  ["\u00e2\u20ac\u2122", "\u2019"],
  ["\u00c2\u00b7", "\u00b7"],
  ["\u00c2\u00a9", "\u00a9"],
  ["\u00c3\u00a9", "\u00e9"],
  [
    "\u00d8\u00a7\u00d9\u201e\u00d8\u00b9\u00d8\u00b1\u00d8\u00a8\u00d9\u0160\u00d8\u00a9",
    "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
  ],
  ["\u00d8\u00b9", "\u0639"],
] as const;

function cleanTextEncoding(html: string) {
  return textEncodingFixes.reduce((text, [from, to]) => text.replaceAll(from, to), html);
}

function cleanHtml(html: string) {
  let output = cleanTextEncoding(html)
    .replaceAll(oldFooterColumns, newFooterColumns)
    .replace(/href="assets\//g, 'href="/assets/')
    .replace(/src="assets\//g, 'src="/assets/')
    .replace(/url\(assets\//g, "url(/assets/")
    .replaceAll("https://wa.me/962000000000", "https://wa.me/962700000000");

  for (const [fileStem, route] of htmlRoutes) {
    output = output.replaceAll(`href="${fileStem}.html"`, `href="/${route}"`);
  }

  return output;
}

export async function renderDiyarPage(page: DiyarPage | "home" = "home") {
  const html = await readFile(join(process.cwd(), "Diyar", pageFiles[page]), "utf8");
  return cleanHtml(html);
}

export async function diyarResponse(page: DiyarPage | "home" = "home") {
  return new Response(await renderDiyarPage(page), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
