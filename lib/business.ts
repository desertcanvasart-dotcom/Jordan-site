import data from "../content/business.json";
import type { Locale } from "./i18n";

export type PersonProfile = { name: Record<Locale, string>; jobTitle: Record<Locale, string>; bio: Record<Locale, string>; knowsAbout: Record<Locale, string[]>; sameAs: string[] };
export type Business = Omit<typeof data, "founders" | "team" | "address" | "memberships" | "reviews" | "awards" | "press" | "productionUrl" | "legalName" | "foundingDate" | "phone" | "whatsapp" | "email" | "priceRange"> & {
  productionUrl: string | null; legalName: string | null; foundingDate: string | null;
  phone: string | null; whatsapp: string | null; email: string | null; priceRange: string | null;
  founders: PersonProfile[]; team: PersonProfile[];
  address: null | { streetAddress: Record<Locale, string>; addressLocality: Record<Locale, string>; addressRegion: Record<Locale, string>; postalCode: string; addressCountry: string };
  memberships: { name: Record<Locale, string>; url: string; identifier?: string }[];
  awards: Record<Locale, string>[];
  press: { title: Record<Locale, string>; url: string }[];
  reviews: { author: string; published: string; body: Record<Locale, string>; rating: number; sourceUrl: string }[];
};
export const business = data as Business;
export function siteOrigin(request?: Request) {
  const configured = process.env.SITE_URL || business.productionUrl;
  if (configured) return new URL(configured).origin;
  if (request) {
    const url = new URL(request.url);
    const host = request.headers.get("host");
    if (host && /^(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(host)) url.host = host;
    return url.origin;
  }
  return "http://127.0.0.1:3000";
}
export function pagePath(locale: Locale, page: string) { return `/${locale}${page === "home" ? "" : `/${page}`}`; }
