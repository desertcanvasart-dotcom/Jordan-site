import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { buildHomeJsonLd, buildSiteJsonLd } from "./schema";
import { OG_IMAGE, SITE_URL, t } from "./content";
import { defaultLocale, isLocale, localeHref, type Locale } from "./i18n";

function jsonLdScript(id: string, data: Record<string, unknown>) {
  return `<script id="${id}" type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

function headInjection(locale: Locale, path: string) {
  const copy = t(locale);
  const canonical = `${SITE_URL}${path}`;

  return `
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" hreflang="ar" href="${SITE_URL}/ar" />
  <link rel="alternate" hreflang="en" href="${SITE_URL}/en" />
  <link rel="alternate" hreflang="x-default" href="${SITE_URL}/ar" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${copy.metaTitle}" />
  <meta property="og:description" content="${copy.metaDescription}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="Jordan by Local" />
  <meta property="og:locale" content="${locale === "ar" ? "ar_JO" : "en_US"}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${copy.metaTitle}" />
  <meta name="twitter:description" content="${copy.metaDescription}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  ${jsonLdScript("site-jsonld", buildSiteJsonLd(locale))}
  ${jsonLdScript("home-jsonld", buildHomeJsonLd(locale))}
`;
}

export async function renderStaticHome(rawLocale?: string) {
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const path = rawLocale && isLocale(rawLocale) ? localeHref(locale, "/") : "/";
  const source = await readFile(join(process.cwd(), "reference-homepage.html"), "utf8");
  const withLocale = source.replace(/<html\s+lang="[^"]*"/, `<html lang="${locale}"`);
  const withTitle = withLocale
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t(locale).metaTitle}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${t(locale).metaDescription}" />`);

  return withTitle.replace("</head>", `${headInjection(locale, path)}</head>`);
}
