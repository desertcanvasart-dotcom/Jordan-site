import { diyarResponse, isDiyarPage } from "@/lib/diyar-html";
import { isLocale } from "@/lib/i18n";

export async function GET(request: Request, { params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale, page } = await params;
  if (!isLocale(locale) || !isDiyarPage(page)) return new Response("Not found", { status: 404 });
  return diyarResponse(page, locale, request);
}
