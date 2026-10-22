import { diyarResponse, isDiyarPage, diyarPages } from "@/lib/diyar-html";
import { isLocale, locales } from "@/lib/i18n";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap(locale => diyarPages.map(page => ({ locale, page })));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale, page } = await params;
  if (!isLocale(locale) || !isDiyarPage(page)) return new Response("Not found", { status: 404 });
  return diyarResponse(page, locale);
}
