import { isLocale, locales } from "@/lib/i18n";
import { isArticle, editorial } from "@/lib/structured-content";
import { siteOrigin } from "@/lib/business";
import { loadPublicContent } from "@/lib/content-service";
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap(locale => Object.keys(editorial).map(slug => ({ locale, slug })));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isArticle(slug)) return new Response("Not found", { status: 404 });
  const { html } = await loadPublicContent(`journal/${slug}`, locale, siteOrigin());
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Content-Language": locale } });
}
