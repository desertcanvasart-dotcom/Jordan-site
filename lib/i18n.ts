export const locales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export function isLocale(value: string | undefined): value is Locale {
  return value === "ar" || value === "en";
}

export function localeHref(locale: Locale, href: string) {
  if (href.startsWith("http")) return href;
  if (href.startsWith("#")) return href;
  return `/${locale}${href === "/" ? "" : href}`;
}

export function oppositeLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

export function dir(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}
