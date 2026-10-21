import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { isLocale, oppositeLocale, type Locale } from "./i18n";
import { translateDiyarHtml } from "./diyar-localization";
import { siteOrigin } from "./business";
import { enhanceDocument } from "./document";

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

export function isDiyarPage(value: string): value is DiyarPage {
  return (diyarPages as readonly string[]).includes(value);
}

export async function renderDiyarTemplate(page: DiyarPage | "home" = "home", locale: Locale = "en") {
  const html = await readFile(join(process.cwd(), "Diyar", pageFiles[page]), "utf8");
  let output = cleanHtml(html);
  if (locale === "ar") output = translateDiyarHtml(output, page);
  output = output.replace(/<html[^>]*>/, `<html lang="${locale}" dir="${locale === "ar" ? "rtl" : "ltr"}">`);
  // Localize only known page links; assets, anchors and external destinations stay intact.
  output = output.replace(/href="\/([^"]*)"/g, (attribute, path: string) => {
    if (path === "" || isDiyarPage(path)) return `href="/${locale}${path ? `/${path}` : ""}"`;
    return attribute;
  });
  const other = oppositeLocale(locale);
  const switchHref = `/${other}${page === "home" ? "" : `/${page}`}`;
  const switchLabel = locale === "ar" ? "English" : "العربية";
  output = output.replace(/<a class="lang"[^>]*>[\s\S]*?<\/a>/, `<a class="lang" href="${switchHref}" lang="${other}" hreflang="${other}" aria-label="${locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}">${switchLabel}</a>`);
  output = output.replace(/<a href="#">العربية<\/a>/g, `<a href="${switchHref}" lang="${other}" hreflang="${other}">${switchLabel}</a>`);
  // Keep the phone number visually ordered inside the RTL form.
  output = output.replace(/id="wa"/g, 'id="wa" dir="ltr"');
  output = output.replace(/(<select id="lang"[^>]*>)([\s\S]*?)(<\/select>)/, (_match, open: string, options: string, close: string) => {
    const label = locale === "ar" ? "العربية" : "English";
    return `${open}${options.replace(`<option>${label}</option>`, `<option selected>${label}</option>`)}${close}`;
  });
  const menuLinks = output.match(/<div class="nav-links">([\s\S]*?)<\/div>/)?.[1];
  if (menuLinks) {
    const label = locale === "ar" ? "قائمة التنقل" : "Navigation menu";
    const menu = `<details class="mobile-menu" data-mobile-menu><summary aria-label="${label}"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></summary><div class="mobile-menu-links">${menuLinks}</div></details>`;
    output = output.replace("</nav>", `${menu}</nav>`);
  }
  return output;
}

export async function renderDiyarPage(page: DiyarPage | "home" = "home", locale: Locale = "en", origin = siteOrigin()) {
  return enhanceDocument(await renderDiyarTemplate(page, locale), page, locale, origin).html;
}

export async function diyarResponse(page: DiyarPage | "home" = "home", locale: Locale = "en", request?: Request) {
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  if (request && !/^\/(ar|en)(\/|$)/.test(new URL(request.url).pathname)) {
    return new Response(null, { status: 308, headers: { Location: `/${page === "home" ? "ar" : locale}${page === "home" ? "" : `/${page}`}` } });
  }
  return new Response(await renderDiyarPage(page, locale, siteOrigin(request)), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Language": locale,
    },
  });
}
