import { isLocale } from "@/lib/i18n";
import { diyarResponse } from "@/lib/diyar-html";

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return new Response("Not found", { status: 404 });
  }

  return diyarResponse();
}
