import pages from "../content/pages.json";
import articles from "../content/articles.json";
import { business, pagePath } from "./business";
import type { Locale } from "./i18n";
import attractionFacts from "../content/attraction-facts.json";

export type PageDefinition = { type: string; updated: string; image: string; title: Record<Locale, string>; description?: Record<Locale, string>; days?: number; stops?: string[] };
export const pageDefinitions: Record<string, PageDefinition> = pages;
export const editorial = articles;
export type ArticleSlug = keyof typeof articles;
export const isArticle = (slug: string): slug is ArticleSlug => Object.hasOwn(articles, slug);
export function definition(key: string): PageDefinition {
  if (key.startsWith("journal/") && isArticle(key.slice(8))) {
    const article = articles[key.slice(8) as ArticleSlug];
    return { type: "article", updated: article.updated, image: article.image, title: { ar: article.ar.title, en: article.en.title } };
  }
  return pageDefinitions[key];
}
export const placeNames: Record<string, Record<Locale, string>> = {
  amman: { en: "Amman", ar: "عمّان" }, petra: { en: "Petra", ar: "البتراء" },
  jerash: { en: "Jerash", ar: "جرش" }, "wadi-rum": { en: "Wadi Rum", ar: "وادي رم" },
  "dead-sea": { en: "Dead Sea", ar: "البحر الميت" }, aqaba: { en: "Aqaba", ar: "العقبة" },
};
export type PageContent = {
  key: string; locale: Locale; url: string; title: string; description: string; heading: string;
  updated: string; image: string; text: string;
  sections: { heading: string; text: string }[];
  faq: { question: string; answer: string }[];
  itinerary: { name: string; description: string }[];
  included: string[]; attractions: string[];
};

export function buildDocumentGraph(content: PageContent) {
  const { key, locale, url, title, description, image } = content;
  const origin = new URL(url).origin;
  const def = definition(key);
  const agencyId = `${origin}/#travelagency`;
  const websiteId = `${origin}/#website`;
  const entityId = `${url}#entity`;
  const ref = { "@id": agencyId };
  const local = (en: string, ar: string) => locale === "ar" ? ar : en;
  const agency: Record<string, unknown> = {
    "@type": "TravelAgency", "@id": agencyId, name: business.brand[locale],
    alternateName: business.alternateNames, url: `${origin}${pagePath(locale, "home")}`,
    logo: `${origin}/assets/logo.svg`, image, description: business.positioning[locale],
    knowsAbout: business.knowsAbout[locale], areaServed: business.areaServed[locale],
    ...(business.legalName ? { legalName: business.legalName } : {}),
    ...(business.foundingDate ? { foundingDate: business.foundingDate } : {}),
    ...(business.phone ? { telephone: business.phone } : {}),
    ...(business.email ? { email: business.email } : {}),
    ...(business.priceRange ? { priceRange: business.priceRange } : {}),
    ...(business.socialProfiles.length ? { sameAs: business.socialProfiles } : {}),
    ...(business.awards.length ? { award: business.awards.map(a => a[locale]) } : {}),
    ...(business.memberships.length ? { memberOf: business.memberships.map(m => ({ "@type": "Organization", name: m.name[locale], url: m.url, ...(m.identifier ? { identifier: m.identifier } : {}) })) } : {}),
  };
  if (business.address) agency.address = {
    "@type": "PostalAddress", ...business.address,
    streetAddress: business.address.streetAddress[locale], addressLocality: business.address.addressLocality[locale], addressRegion: business.address.addressRegion[locale],
  };
  if (business.phone || business.email || business.whatsapp) agency.contactPoint = [{
    "@type": "ContactPoint", contactType: local("Travel planning", "تخطيط السفر"),
    availableLanguage: ["ar", "en"], ...(business.phone ? { telephone: business.phone } : {}),
    ...(business.email ? { email: business.email } : {}), ...(business.whatsapp ? { url: `https://wa.me/${business.whatsapp}` } : {}),
  }];
  const people = [...business.founders, ...business.team].map((person, i) => ({
    "@type": "Person", "@id": `${origin}/#person-${i + 1}`, name: person.name[locale],
    jobTitle: person.jobTitle[locale], description: person.bio[locale], worksFor: ref,
    knowsAbout: person.knowsAbout[locale], ...(person.sameAs.length ? { sameAs: person.sameAs } : {}),
  }));
  if (business.founders.length) agency.founder = people.slice(0, business.founders.length).map(p => ({ "@id": p["@id"] }));
  const graph: Record<string, unknown>[] = [agency, {
    "@type": "WebSite", "@id": websiteId, name: business.brand[locale], url: origin,
    inLanguage: ["ar", "en"], publisher: ref,
  }, ...people, {
    "@type": def.type === "about" ? "AboutPage" : def.type === "contact" ? "ContactPage" : def.type.includes("index") || def.type === "collection" ? "CollectionPage" : "WebPage",
    "@id": `${url}#webpage`, url, name: title, description, inLanguage: locale,
    dateModified: content.updated, isPartOf: { "@id": websiteId }, about: ref, publisher: ref,
    primaryImageOfPage: { "@type": "ImageObject", url: image, width: 1200, height: 630 },
    ...(def.type === "article" || def.type === "trip" || def.type === "destination" || def.type === "attraction" ? { mainEntity: { "@id": entityId } } : {}),
  }];
  const breadcrumb = [{ "@type": "ListItem", position: 1, name: local("Home", "الرئيسية"), item: `${origin}${pagePath(locale, "home")}` }];
  if (key.startsWith("journal/")) breadcrumb.push({ "@type": "ListItem", position: 2, name: local("Journal", "المجلة"), item: `${origin}${pagePath(locale, "blog")}` });
  if (key !== "home") breadcrumb.push({ "@type": "ListItem", position: breadcrumb.length + 1, name: content.heading, item: url });
  graph.push({ "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: breadcrumb });
  if (def.type === "trip") graph.push({
    "@type": "TouristTrip", "@id": entityId, name: content.heading, description, url, image, provider: ref,
    touristType: local("Families, couples and private travelers", "العائلات والأزواج والمسافرون في رحلات خاصة"),
    tripOrigin: ["amman", "aqaba"].map(slug => ({
      "@type": "Place", name: placeNames[slug][locale],
      description: local("Possible arrival point; confirmed in the final itinerary", "نقطة وصول محتملة؛ تؤكد في البرنامج النهائي"),
    })),
    itinerary: { "@type": "ItemList", itemListElement: content.itinerary.map((day, i) => {
      const text = `${day.name} ${day.description}`;
      const matches = Object.entries(placeNames).filter(([, name]) => text.includes(name[locale]));
      // A day label such as "Arrival & unwind" is not the name of a physical place.
      // Where the sample gives alternatives, keep the destination at country level.
      const stop = matches.length === 1 ? matches[0] : null;
      return {
        "@type": "ListItem", position: i + 1, name: day.name,
        item: stop ? {
          "@type": ["petra", "jerash"].includes(stop[0]) ? "TouristAttraction" : "TouristDestination",
          "@id": `${origin}${pagePath(locale, stop[0])}#entity`,
          name: stop[1][locale], description: day.description,
          url: `${origin}${pagePath(locale, stop[0])}`,
        } : { "@type": "Country", name: local("Jordan", "الأردن"), description: day.description },
      };
    }) },
    subjectOf: { "@type": "CreativeWork", name: local("Sample itinerary and included services", "البرنامج المقترح والخدمات المشمولة"), timeRequired: `P${content.itinerary.length || def.days}D`, text: content.included.join("; "), inLanguage: locale },
    offers: { "@type": "Offer", url: `${origin}${pagePath(locale, "plan-your-trip")}`, seller: ref, description: business.pricing[locale] },
  });
  if (def.type === "destination" || def.type === "attraction") graph.push({
    "@type": def.type === "attraction" ? "TouristAttraction" : "TouristDestination", "@id": entityId,
    name: content.heading, description, url, image, publicAccess: true,
    ...(key === "petra" || key === "jerash" ? {
      geo: { "@type": "GeoCoordinates", ...attractionFacts[key].geo },
      isAccessibleForFree: false,
      sameAs: attractionFacts[key].source,
      photo: [{ "@type": "ImageObject", url: `${origin}/assets/img/${key}.webp` }],
    } : {}),
    ...(key === "petra" ? { openingHoursSpecification: attractionFacts.petra.hours.map(h => ({
      "@type": "OpeningHoursSpecification", opens: h.opens, closes: h.closes,
      validFrom: h.validFrom, validThrough: h.validThrough,
    })) } : {}),
    ...(def.type === "destination" ? { includesAttraction: content.attractions.map(name => ({ "@type": "TouristAttraction", name })) } : { subjectOf: { "@type": "CreativeWork", name: content.heading, text: content.sections.map(s => s.text).join("\n"), inLanguage: locale } }),
    // Opening times, fees and coordinates require source-verified destination records.
  });
  if (def.type === "article") {
    const article = articles[key.slice(8) as ArticleSlug];
    graph.push({ "@type": "Article", "@id": entityId, headline: content.heading, description, url, image,
      author: ref, publisher: ref, datePublished: article.published, dateModified: article.updated,
      inLanguage: locale, articleBody: content.text, mainEntityOfPage: { "@id": `${url}#webpage` },
      about: { "@type": "Country", name: local("Jordan", "الأردن") },
      mentions: Object.entries(placeNames).filter(([, name]) => content.text.includes(name[locale])).map(([slug, name]) => ({ "@type": "Place", name: name[locale], url: `${origin}${pagePath(locale, slug)}` })),
    });
  }
  if (content.faq.length) graph.push({ "@type": "FAQPage", "@id": `${url}#faq`, inLanguage: locale,
    mainEntity: content.faq.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  });
  if (business.reviews.length) {
    agency.aggregateRating = { "@type": "AggregateRating", ratingValue: business.reviews.reduce((sum, r) => sum + r.rating, 0) / business.reviews.length, reviewCount: business.reviews.length, bestRating: 5, worstRating: 1 };
    agency.review = business.reviews.map(r => ({ "@type": "Review", author: { "@type": "Person", name: r.author }, datePublished: r.published, reviewBody: r.body[locale], url: r.sourceUrl, reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 } }));
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
