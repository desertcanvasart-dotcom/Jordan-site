import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import Interactions from "@/components/Interactions";
import { buildSiteJsonLd } from "@/lib/schema";
import { defaultLocale, dir, isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata(defaultLocale);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2e3f32",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const localeHeader = (await headers()).get("x-site-locale") ?? defaultLocale;
  const locale: Locale = isLocale(localeHeader) ? localeHeader : defaultLocale;

  return (
    <html lang={locale} dir={dir(locale)}>
      <body>
        <JsonLd id="site-jsonld" data={buildSiteJsonLd(locale)} />
        {children}
        <Interactions />
      </body>
    </html>
  );
}
