import { isLocale } from "@/lib/i18n";
import { isArticle } from "@/lib/structured-content";
import { siteOrigin } from "@/lib/business";
import { loadPublicContent } from "@/lib/content-service";
export async function GET(request: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isArticle(slug)) return new Response("Not found", { status: 404 });
  const { html } = await loadPublicContent(`journal/${slug}`, locale, siteOrigin(request));
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Content-Language": locale } });
}
