import type { Metadata } from "next";
import { OG_IMAGE, site, SITE_URL, t } from "./content";
import { localeHref, type Locale } from "./i18n";

export function buildPageMetadata(locale: Locale, path = "/"): Metadata {
  const c = t(locale);
  const canonicalPath = localeHref(locale, path);
  const canonical = `${SITE_URL}${canonicalPath}`;
  const alternatePath = path === "/" ? "" : path;

  return {
    metadataBase: new URL(SITE_URL),
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: canonicalPath,
      languages: {
        ar: `/ar${alternatePath}`,
        en: `/en${alternatePath}`,
        "x-default": `/ar${alternatePath}`,
      },
    },
    openGraph: {
      type: "website",
      title: c.metaTitle,
      description: c.metaDescription,
      url: canonical,
      siteName: site.name,
      locale: locale === "ar" ? "ar_JO" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_JO"],
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: locale === "ar" ? "البتراء في الأردن" : "Petra in Jordan",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: c.metaTitle,
      description: c.metaDescription,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
