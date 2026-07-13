import { renderStaticHome } from "@/lib/static-home";
import { isLocale } from "@/lib/i18n";

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(await renderStaticHome(locale), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
