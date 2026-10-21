import { journeys, OG_IMAGE, site, SITE_URL, t } from "./content";
import { localeHref, type Locale } from "./i18n";

const agencyId = `${SITE_URL}/#travelagency`;
const websiteId = `${SITE_URL}/#website`;

function absolute(path: string) {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path}`;
}

function sameAs() {
  return [site.instagram, site.facebook, site.linkedin, site.youtube, site.tripadvisor].filter(
    (url): url is string => Boolean(url && url !== "#")
  );
}

export function organizationRef() {
  return { "@id": agencyId };
}

export function buildSiteJsonLd(locale: Locale) {
  const name = locale === "ar" ? site.arName : site.name;
  const description = locale === "ar" ? t(locale).metaDescription : site.positioning;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": agencyId,
        name,
        alternateName: site.alternateNames,
        url: SITE_URL,
        logo: absolute(site.logo),
        image: OG_IMAGE,
        description,
        ...(site.foundingDate ? { foundingDate: site.foundingDate } : {}),
        founder: site.founders.map((founder) => ({
          "@type": "Person",
          name: founder.name,
          jobTitle: founder.jobTitle,
          worksFor: { "@id": agencyId },
          knowsAbout: founder.knowsAbout,
          ...(founder.sameAs ? { sameAs: founder.sameAs } : {}),
        })),
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.locality,
          addressRegion: site.address.region,
          postalCode: site.address.postalCode,
          addressCountry: site.address.country,
        },
        telephone: site.phone,
        email: site.email,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: site.phone,
            email: site.email,
            availableLanguage: ["Arabic", "English"],
            areaServed: ["SA", "AE", "JO"],
          },
          {
            "@type": "ContactPoint",
            contactType: "WhatsApp travel concierge",
            url: `https://wa.me/${site.whatsapp}`,
            availableLanguage: ["Arabic", "English"],
          },
        ],
        sameAs: sameAs(),
        award: site.awards,
        knowsAbout: site.knowsAbout,
        areaServed: site.areaServed,
        priceRange: site.priceRange,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name,
        url: SITE_URL,
        inLanguage: locale,
        publisher: { "@id": agencyId },
      },
    ],
  };
}

export function buildHomeJsonLd(locale: Locale) {
  const c = t(locale);
  const url = absolute(localeHref(locale, "/"));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: c.metaTitle,
        description: c.metaDescription,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        about: { "@id": agencyId },
        publisher: { "@id": agencyId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: OG_IMAGE,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: locale === "ar" ? "الرئيسية" : "Home",
            item: url,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${url}#featured-journeys`,
        name: locale === "ar" ? "رحلات الأردن المقترحة" : "Featured Jordan journeys",
        itemListElement: journeys.map((journey, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "TouristTrip",
            name: journey.title[locale],
            description: `${journey.bestFor[locale]}. ${journey.pace[locale]}`,
            duration: journey.duration,
            image: journey.image,
            provider: { "@id": agencyId },
            areaServed: {
              "@type": "Country",
              name: locale === "ar" ? "الأردن" : "Jordan",
            },
            touristType: locale === "ar" ? "مسافرون من الخليج" : "world travelers",
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url,
              description:
                locale === "ar"
                  ? "السعر النهائي يتطلب استشارة حسب التواريخ وعدد المسافرين ومستوى الراحة."
                  : "Final pricing requires consultation based on dates, travelers, and comfort level.",
            },
          },
        })),
      },
    ],
  };
}
