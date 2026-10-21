import { isLocale } from "@/lib/i18n";
import { siteOrigin } from "@/lib/business";
import { loadPublicContent, isContentKey } from "@/lib/content-service";
import { buildDocumentGraph } from "@/lib/structured-content";
export async function GET(request: Request, { params }: { params: Promise<{ locale: string; path: string[] }> }) {
  const { locale, path } = await params;
  const key = path.join("/");
  if (!isLocale(locale) || !isContentKey(key)) return Response.json({ error: "Not found" }, { status: 404 });
  const { content } = await loadPublicContent(key, locale, siteOrigin(request));
  return Response.json({ ...content, structuredData: buildDocumentGraph(content) }, { headers: { "X-Robots-Tag": "noindex, nofollow" } });
}
