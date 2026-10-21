import { business, pagePath, siteOrigin } from "@/lib/business";
import { pageDefinitions, editorial } from "@/lib/structured-content";
import { locales } from "@/lib/i18n";
import { escapeHtml } from "@/lib/document";
export function GET(request: Request) {
  const origin = siteOrigin(request);
  const entries = [...Object.entries(pageDefinitions).map(([key, p]) => ({ key, updated: p.updated })), ...Object.entries(editorial).map(([slug, a]) => ({ key: `journal/${slug}`, updated: a.updated }))];
  const urls = entries.flatMap(p => locales.map(locale => `<url><loc>${escapeHtml(origin + pagePath(locale, p.key))}</loc><lastmod>${p.updated}</lastmod>${[...locales, "x-default"].map(lang => `<xhtml:link rel="alternate" hreflang="${lang}" href="${escapeHtml(origin + pagePath(lang === "x-default" ? business.defaultLocale as "ar" | "en" : lang as "ar" | "en", p.key))}"/>`).join("")}</url>`));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join("")}</urlset>`, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
