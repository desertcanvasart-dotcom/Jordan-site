import { load } from "cheerio";
import { renderDiyarTemplate, isDiyarPage } from "./diyar-html";
import { articleMarkup, enhanceDocument } from "./document";
import { isArticle } from "./structured-content";
import type { Locale } from "./i18n";

export function isContentKey(key: string) { return key === "home" || isDiyarPage(key) || key.startsWith("journal/") && isArticle(key.slice(8)); }
export async function loadPublicContent(key: string, locale: Locale, origin: string) {
  if (key.startsWith("journal/") && isArticle(key.slice(8))) {
    const $ = load(await renderDiyarTemplate("blog", locale));
    $("main").replaceWith(articleMarkup(key.slice(8) as Parameters<typeof articleMarkup>[0], locale));
    return enhanceDocument($.html(), key, locale, origin);
  }
  if (key === "home" || isDiyarPage(key)) return enhanceDocument(await renderDiyarTemplate(key, locale), key, locale, origin);
  throw new Error("Unknown public content");
}
