import translations from "./diyar-ar.json";
import type { DiyarPage } from "./diyar-html";

const arabic: Record<string, string> = translations;

const headings: Record<DiyarPage | "home", string> = {
  home: 'الأردن، <em>بتخطيط متقن</em> يناسبك.',
  "private-jordan-trips": 'رحلات خاصة في الأردن، <em>بتخطيط يناسبك.</em>',
  destinations: 'إلى أين تذهب في <em>الأردن.</em>',
  petra: 'البتراء',
  "wadi-rum": 'وادي رم',
  "dead-sea": 'البحر الميت',
  jerash: 'جرش',
  amman: 'عمّان',
  aqaba: 'العقبة',
  "weekend-escape": 'عطلة نهاية أسبوع <em>في الأردن.</em>',
  "family-journey": 'رحلة <em>عائلية.</em>',
  "full-jordan-journey": 'رحلة الأردن <em>المتكاملة.</em>',
  "luxury-desert-dead-sea": 'الصحراء الفاخرة <em>والبحر الميت.</em>',
  "family-travel": 'الأردن، <em>للعائلة كلها.</em>',
  "luxury-travel": 'الأردن، <em>في أبهى صورة.</em>',
  "about-trust": 'الفريق <em>وراء رحلتك.</em>',
  blog: 'أدلة <em>وقصص.</em>',
  privacy: 'سياسة الخصوصية',
  terms: 'شروط الخدمة',
  "cancellation-policy": 'سياسة الإلغاء',
  "plan-your-trip": 'لنخطط لها <em>معاً.</em>',
};

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function translateText(text: string): string {
  const value = text.trim();
  if (!value) return text;
  if (arabic[value] !== undefined) return text.replace(value, escapeHtml(arabic[value]));
  // The source uses entities between text fragments, e.g. "Arabic &amp; English".
  return text.split(/(&[a-zA-Z0-9#]+;)/g).map((part) => {
    if (part === "&amp;") return "و";
    if (/^&[a-zA-Z0-9#]+;$/.test(part)) return part;
    const key = part.trim();
    return arabic[key] !== undefined ? part.replace(key, escapeHtml(arabic[key])) : part;
  }).join("").replace(/ و (?=[\u0600-\u06ff])/g, " و");
}

/** Translate text and accessible copy, leaving markup, URLs and executable code intact. */
export function translateDiyarHtml(html: string, page: DiyarPage | "home") {
  const localized = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<!--[\s\S]*?-->|<[^>]+>|[^<]+/gi, (token) => {
    if (/^<(script|style)\b|^<!--/i.test(token)) return token;
    if (token.startsWith("<")) {
      return token.replace(/\b(alt|aria-label|placeholder|content)="([^"]*)"/g, (attribute, name: string, value: string) => {
        if (name === "content" && !/^<meta\b[^>]*name="description"/i.test(token)) return attribute;
        return `${name}="${translateText(value)}"`;
      });
    }
    return translateText(token);
  });
  // Translate headings as sentences, rather than inheriting English emphasis word order.
  return localized.replace(/(<h1\b[^>]*>)[\s\S]*?<\/h1>/, `$1${headings[page]}</h1>`);
}
