import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dir, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  return buildPageMetadata(rawLocale as Locale);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div lang={locale} dir={dir(locale)} className={`locale locale-${locale}`}>
      {children}
    </div>
  );
}
