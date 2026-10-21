import { load, type CheerioAPI } from "cheerio";
import { business, pagePath } from "./business";
import { definition, editorial, type ArticleSlug, type PageContent, buildDocumentGraph } from "./structured-content";
import { jsonLdTag } from "./jsonld";
import type { Locale } from "./i18n";
import attractionFacts from "../content/attraction-facts.json";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const stylesheet = readFileSync(join(process.cwd(), "public/assets/css/diyar.css"), "utf8").replace(/url\(\.\.\/fonts\//g, "url(/assets/fonts/");

export function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
function rename($: CheerioAPI, selector: string, tag: string) {
  $(selector).each((_, node) => {
    const html = $.html(node);
    $(node).replaceWith(html.replace(/^<\w+/, `<${tag}`).replace(/<\/\w+>$/, `</${tag}>`));
  });
}
function plain($: CheerioAPI, selector: string) { return $(selector).text().replace(/\s+/g, " ").trim(); }
const cleanSummary = (text: string) => text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, "")}…` : text;

export function articleMarkup(slug: ArticleSlug, locale: Locale) {
  const article = editorial[slug];
  const copy = article[locale];
  const local = (en: string, ar: string) => locale === "ar" ? ar : en;
  return `<main id="main-content" tabindex="-1"><section class="section"><article class="container legal editorial-article">
    <nav class="crumb" aria-label="${local("Breadcrumb", "مسار التنقل")}"><a href="/${locale}">${local("Home", "الرئيسية")}</a><span>/</span><a href="/${locale}/blog">${local("Journal", "المجلة")}</a></nav>
    <header><h1>${escapeHtml(copy.heading)}</h1><p class="byline">${local("By", "إعداد")} <a href="/${locale}/about-trust">${business.brand[locale]}</a> · ${local("Published", "نشر في")} <time datetime="${article.published}">${article.published}</time> · ${local("Updated", "آخر تحديث")} <time datetime="${article.updated}">${article.updated}</time></p><p>${escapeHtml(copy.intro)}</p></header>
    <figure class="editorial-figure"><img src="/assets/img/${article.image}.webp" width="1200" height="800" alt="${local("Jordan journey planning", "تخطيط رحلة في الأردن")}"><figcaption>${local("A private route is shaped around your dates, group and preferences.", "نصمم المسار الخاص وفق مواعيدك ومجموعتك وتفضيلاتك.")}</figcaption></figure>
    ${copy.sections.map(s => `<section><h2>${escapeHtml(s.heading)}</h2><p>${escapeHtml(s.body)}</p></section>`).join("")}
    <footer class="author-bio"><h2>${local("About this guide", "عن هذا الدليل")}</h2><p>${local("Prepared for Diyar's private Jordan travel service. This guide describes planning choices and published sample routes; your confirmed proposal defines the services you book.", "أُعد هذا الدليل لخدمة رحلات ديار الخاصة في الأردن. يشرح خيارات التخطيط والمسارات المقترحة المنشورة؛ ويحدد عرضك المؤكد الخدمات التي تحجزها.")}</p></footer>
    <aside aria-label="${local("Related journeys", "رحلات ذات صلة")}"><h2>${local("Plan your next step", "خطوتك التالية")}</h2><p><a href="/${locale}/private-jordan-trips">${local("Compare Diyar's private Jordan routes", "قارن مسارات ديار الخاصة في الأردن")}</a> · <a href="/${locale}/plan-your-trip">${local("Share your trip preferences", "شارك تفضيلات رحلتك")}</a></p></aside>
  </article></section></main>`;
}

function applyVisibleModules($: CheerioAPI, key: string, locale: Locale) {
  const local = (en: string, ar: string) => locale === "ar" ? ar : en;
  const def = definition(key);
  if (!business.legalName) {
    $(".hero-trust > div").first().html(local("Private Jordan itinerary planning", "تخطيط مسارات خاصة في الأردن"));
    $(".trust-card").each((_, card) => {
      const heading = $(card).find("h3").text();
      if (/Licensed|مرخصة/.test(heading)) {
        $(card).find("h3").text(local("Operator transparency", "وضوح بيانات المشغل"));
        $(card).find("p").text(local("Legal operator and accreditation details must be confirmed before bookings open.", "يلزم تأكيد بيانات المشغل القانوني والاعتمادات قبل فتح الحجوزات."));
      }
    });
  }
  if (key === "petra" || key === "jerash") {
    const facts = attractionFacts[key];
    $("main").append(`<section class="section"><div class="container legal"><h2>${local("Heritage context and visitor information", "السياق التاريخي ومعلومات الزيارة")}</h2><p>${escapeHtml(facts.history[locale])}</p><dl><dt>${local("Reference coordinates", "الإحداثيات المرجعية")}</dt><dd dir="ltr">${facts.geo.latitude}, ${facts.geo.longitude}</dd></dl><p><a href="${facts.source}" rel="noreferrer">${local("Official heritage information", "المعلومات التراثية الرسمية")}</a></p><h3>${local("Published opening hours", "ساعات الزيارة المنشورة")}</h3><table class="hours-table"><caption>${local("Published schedules; confirm the applicable season before travel", "المواعيد المنشورة؛ تحقق من الفترة المطبقة قبل السفر")}</caption><thead><tr><th scope="col">${local("Period", "الفترة")}</th><th scope="col">${local("Hours", "الساعات")}</th></tr></thead><tbody>${facts.hours.map(h => `<tr><th scope="row">${escapeHtml(h.label[locale])}</th><td dir="ltr">${h.opens}–${h.closes}</td></tr>`).join("")}</tbody></table><p><a href="${facts.hoursSource}">${local("Check the official schedule", "راجع المواعيد الرسمية")}</a></p><p>${local("Admission requires a ticket or an eligible pass. Check current visitor arrangements before travel.", "يتطلب الدخول تذكرة أو تصريحاً صالحاً. تحقق من ترتيبات الزيارة الحالية قبل السفر.")} <a href="https://jordanpass.jo/Contents/Prices.aspx">${local("Official Jordan Pass information", "معلومات بطاقة جوردان باس الرسمية")}</a></p></div></section>`);
  }
  if (key === "blog") {
    $(".bgrid").html(Object.entries(editorial).map(([slug, article]) => `<article class="bcard"><div class="media"><img src="/assets/img/${article.image}.webp" alt="${escapeHtml(article[locale].heading)}" width="1200" height="800" loading="lazy"></div><div class="bcard-body"><h3><a href="/${locale}/journal/${slug}">${escapeHtml(article[locale].heading)}</a></h3><p>${escapeHtml(article[locale].intro)}</p><p class="bmeta">${business.brand[locale]} · <time datetime="${article.updated}">${article.updated}</time></p></div></article>`).join(""));
    $(".section-head .lead").first().text(local("Practical guides to the routes, planning process and written proposals used for Diyar's private Jordan journeys.", "أدلة عملية لمسارات ديار الخاصة في الأردن وخطوات التخطيط والعروض المكتوبة."));
    $(".bgrid").nextAll("p").remove();
  }
  if (business.legalName) {
    $("body").html($("body").html()!.replaceAll("[Operating Company Name]", escapeHtml(business.legalName)).replaceAll("[اسم الشركة المشغلة]", escapeHtml(business.legalName)));
  } else {
    $(".footer-op").text(local("Operating-company details are being verified before bookings open.", "نجري التحقق من بيانات الشركة المشغلة قبل فتح الحجوزات."));
  }
  if (key === "about-trust") {
    $(".hero-lede").text(local("Private Jordan journeys shaped around families worldwide, with clear planning and a proposal tailored to your group.", "رحلات خاصة في الأردن تناسب عائلات الخليج، مع تخطيط واضح وعرض مصمم وفق مجموعتكم."));
    $(".team").closest("section").remove();
    $(".prose").html(`<p>${escapeHtml(business.positioning[locale])}</p><p>${local("Our approach begins with your dates, party size, room preferences and pace. We build a private route, outline the included services and provide a written proposal for review.", "يبدأ نهجنا بمواعيدك وعدد المسافرين والغرف والوتيرة التي تفضلها. نبني مساراً خاصاً ونوضح الخدمات المشمولة ونقدم عرضاً مكتوباً للمراجعة.")}</p>`);
    const verified = `<section class="section"><div class="container legal"><h2>${local("Company and contact information", "بيانات الشركة والتواصل")}</h2><address>${business.legalName ? escapeHtml(business.legalName) : local("Legal operator details awaiting confirmation.", "بيانات المشغل القانوني بانتظار التأكيد.")}${business.address ? `<br>${escapeHtml(business.address.streetAddress[locale])}, ${escapeHtml(business.address.addressLocality[locale])}` : ""}</address>${business.foundingDate ? `<p>${local("Founded", "تأسست في")} <time datetime="${business.foundingDate}">${business.foundingDate}</time></p>` : ""}${[...business.founders, ...business.team].map(p => `<article><h3>${escapeHtml(p.name[locale])}</h3><p>${escapeHtml(p.jobTitle[locale])}</p><p>${escapeHtml(p.bio[locale])}</p></article>`).join("")}${business.memberships.length ? `<h3>${local("Memberships", "العضويات")}</h3><ul>${business.memberships.map(m => `<li><a href="${escapeHtml(m.url)}" rel="noreferrer">${escapeHtml(m.name[locale])}</a></li>`).join("")}</ul>` : ""}${business.awards.length ? `<h3>${local("Recognition", "التكريم")}</h3><ul>${business.awards.map(a => `<li>${escapeHtml(a[locale])}</li>`).join("")}</ul>` : ""}${business.press.map(p => `<p><a href="${escapeHtml(p.url)}">${escapeHtml(p.title[locale])}</a></p>`).join("")}</div></section>`;
    $("main").append(verified);
  }
  // Unknown phone and email values must not be presented as verified contact details.
  $("a[href^='https://wa.me/']").each((_, a) => {
    if (business.whatsapp) $(a).attr("href", `https://wa.me/${business.whatsapp}`);
    else { $(a).attr("href", pagePath(locale, "plan-your-trip")); $(a).text(local("Discuss your trip", "ناقش رحلتك")); }
  });
  $("a[href^='mailto:']").each((_, a) => {
    if (business.email) $(a).attr("href", `mailto:${business.email}`).text(business.email);
    else {
      const paragraph = $(a).closest("main p");
      if (paragraph.length) paragraph.html(`${local("Public contact details are awaiting confirmation.", "بيانات التواصل العامة بانتظار التأكيد.")} <a href="${pagePath(locale, "plan-your-trip")}">${local("Check trip inquiry availability", "تحقق من إتاحة استفسارات الرحلات")}</a>`);
      else $(a).remove();
    }
  });
  if (business.phone) $(".footer-col").last().append(`<a href="tel:${escapeHtml(business.phone.replace(/\s/g, ""))}" dir="ltr">${escapeHtml(business.phone)}</a>`);
  if (key === "plan-your-trip") {
    $("#planForm").attr("data-whatsapp", business.whatsapp || "").removeAttr("novalidate");
    $("#wa").attr({ autocomplete: "tel", pattern: String.raw`(?=(?:\D*\d){7,15}\D*$)\+?[\d\s\(\)\-]+` });
    $("#name").attr("autocomplete", "name");
    $("#planForm").append(`<p id="form-status" class="form-status" role="status" aria-live="polite"></p>`);
    $(".plan-form > p").first().text(business.whatsapp ? local("We continue on WhatsApp, in Arabic or English.", "نتابع معك على واتساب بالعربية أو الإنجليزية.") : local("Contact details are being verified. Trip inquiries will open when the operator's WhatsApp number is confirmed.", "نجري التحقق من بيانات التواصل. تفتح استفسارات الرحلات بعد تأكيد رقم واتساب الخاص بالمشغل."));
    if (!business.whatsapp) $("#planForm button[type='submit']").text(local("Check inquiry availability", "تحقق من إتاحة الاستفسارات")).attr("formnovalidate", "");
  }
  if (business.reviews.length) {
    $("main").append(`<section class="section"><div class="container"><h2>${local("Guest reviews", "تقييمات الضيوف")}</h2>${business.reviews.map(r => `<article><h3>${escapeHtml(r.author)}</h3><time datetime="${r.published}">${r.published}</time><p>${escapeHtml(r.body[locale])}</p><p>${r.rating}/5 · <a href="${escapeHtml(r.sourceUrl)}">${local("Original review", "التقييم الأصلي")}</a></p></article>`).join("")}</div></section>`);
  }
  if (def.type === "trip" || key === "plan-your-trip") $("main").append(`<section class="section pricing-note"><div class="container legal"><h2>${local("Pricing and booking", "الأسعار والحجز")}</h2><p>${escapeHtml(business.pricing[locale])}</p><p><a href="/${locale}/cancellation-policy">${local("Read the cancellation policy and booking conditions", "اقرأ سياسة الإلغاء وشروط الحجز")}</a></p></div></section>`);
}

export function enhanceDocument(html: string, key: string, locale: Locale, origin: string) {
  const $ = load(html);
  const def = definition(key);
  $("body").addClass(`page-${def.type}`);
  applyVisibleModules($, key, locale);
  $("html").attr({ lang: locale, dir: locale === "ar" ? "rtl" : "ltr" });
  $("main").attr({ id: "main-content", tabindex: "-1" });
  $("body").prepend(`<a class="skip-link" href="#main-content">${locale === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}</a>`);
  rename($, ".nav-wrap", "header");
  rename($, ".crumb:not(nav)", "nav");
  $(".crumb").attr("aria-label", locale === "ar" ? "مسار التنقل" : "Breadcrumb");
  $(".journey a").each((_, link) => {
    const name = $(link).closest(".journey").find("h3").first().text().trim();
    if (name && /See (this )?journey|اكتشف (هذه )?الرحلة/.test($(link).text())) {
      $(link).text(locale === "ar" ? `اكتشف ${name}` : `Explore ${name}`);
    }
  });
  $(".faq-item h3").each((_, question) => { $(question).text($(question).text().replace(/[?؟]$/, "") + (locale === "ar" ? "؟" : "?")); });
  rename($, ".plan-media", "figure"); rename($, ".plan-media-cap", "figcaption");
  rename($, ".plan-media-cap h3", "h2"); rename($, ".footer h4", "h2");
  $(".footer-col").last().find("a[href^='mailto:'], a[href^='tel:']").wrapAll("<address></address>");
  rename($, ".faq .faq-item", "article");
  $("svg").attr({ "aria-hidden": "true", focusable: "false" });
  $(".reveal").removeClass("reveal");
  $("img").each((_, img) => {
    const src = $(img).attr("src") || "";
    $(img).attr({ width: "1200", height: "800", decoding: "async" });
    if (!$(img).closest(".hero, .editorial-article header").length) $(img).attr("loading", "lazy");
    const base = src.replace(/(?:-\d+)?\.(?:jpg|webp)$/, "");
    if (/^\/assets\/img\//.test(src)) $(img).attr({
      src: `${base}.webp`,
      srcset: [320, 640, 960, 1200].map(width => `${base}${width === 1200 ? "" : `-${width}`}.webp ${width}w`).join(", "),
      sizes: "(max-width: 680px) 100vw, (max-width: 1040px) 50vw, 600px",
    });
  });
  $("[style*='.jpg']").each((_, el) => { $(el).attr("style", $(el).attr("style")!.replace(/\.jpg/g, ".webp")); });
  $(".hero-card").each((_, el) => {
    const style = $(el).attr("style") || "";
    const heroImage = style.match(/--hero-img:url\(([^)]+)\)/)?.[1];
    if (heroImage) $(el).attr("style", `${style};--hero-img-mobile:url(${heroImage.replace(/\.webp$/, "-640.webp")})`);
  });
  const url = `${origin}${pagePath(locale, key)}`;
  const title = def.title[locale];
  const rawDescription = def.type === "article" ? editorial[key.slice(8) as ArticleSlug][locale].description : def.description?.[locale] || plain($, ".hero-lede");
  const description = cleanSummary(rawDescription);
  const image = `${origin}/assets/og/${def.image}.jpg`;
  $("title").text(title);
  $("meta[name='description']").attr("content", description);
  $("meta[property^='og:'], meta[name^='twitter:'], link[rel='canonical'], link[hreflang], script[type='application/ld+json']").remove();
  $("head").append(`<link rel="canonical" href="${escapeHtml(url)}"><link rel="alternate" hreflang="ar" href="${origin}${pagePath("ar", key)}"><link rel="alternate" hreflang="en" href="${origin}${pagePath("en", key)}"><link rel="alternate" hreflang="x-default" href="${origin}${pagePath("ar", key)}">`);
  const tags: Record<string, string> = {
    "og:type": def.type === "article" ? "article" : "website", "og:title": title, "og:description": description,
    "og:image": image, "og:image:width": "1200", "og:image:height": "630", "og:image:alt": locale === "ar" ? "ديار — رحلات خاصة في الأردن" : "Diyar — Private Jordan journeys",
    "og:url": url, "og:site_name": business.brand[locale], "og:locale": locale === "ar" ? "ar_JO" : "en_US", "og:locale:alternate": locale === "ar" ? "en_US" : "ar_JO",
    "twitter:card": "summary_large_image", "twitter:title": title, "twitter:description": description, "twitter:image": image,
  };
  for (const [name, value] of Object.entries(tags)) $("head").append(`<meta ${name.startsWith("og:") ? "property" : "name"}="${name}" content="${escapeHtml(value)}">`);
  if (def.type === "article") $("head").append(`<meta property="article:published_time" content="${editorial[key.slice(8) as ArticleSlug].published}"><meta property="article:modified_time" content="${def.updated}">`);
  const hero = def.type === "article" ? `/assets/img/${def.image}.webp` : ($(".hero-card").attr("style") || "").match(/url\(([^)]+)\)/)?.[1];
  if (hero) {
    $("head").append(`<link rel="preload" as="image" href="${hero.replace(/\.webp$/, "-640.webp")}" media="(max-width: 680px)" fetchpriority="high"><link rel="preload" as="image" href="${hero}" media="(min-width: 681px)" fetchpriority="high">`);
  }
  $("link[href='/assets/css/diyar.css']").replaceWith(`<style id="site-styles">${stylesheet}</style>`);
  const fonts = locale === "ar" ? ["tajawal-400-arabic.woff2", "tajawal-700-arabic.woff2"] : ["mulish-400-800-latin.woff2", "marcellus-400-latin.woff2"];
  $("head").prepend(fonts.map(font => `<link rel="preload" href="/assets/fonts/${font}" as="font" type="font/woff2" crossorigin>`).join(""));
  $("head").append('<link rel="icon" href="/assets/logo.svg" type="image/svg+xml">');
  $("script[src]").attr("defer", "");
  $("a.lang, .footer a[hreflang]").attr("href", pagePath(locale === "ar" ? "en" : "ar", key));
  $("main").append(`<p class="page-updated container">${locale === "ar" ? "آخر تحديث للصفحة" : "Page last updated"}: <time datetime="${def.updated}">${def.updated}</time></p>`);
  const content: PageContent = {
    key, locale, url, title, description, heading: plain($, "h1"), updated: def.updated, image,
    text: plain($, "main"),
    sections: $("main section").toArray().map(s => ({ heading: $(s).find("h2").first().text().trim(), text: $(s).find("p").map((_, p) => $(p).text().trim()).get().join("\n") })).filter(s => s.heading),
    faq: $(".faq-item").toArray().map(q => ({ question: $(q).find("h3").text().trim(), answer: $(q).find("p").text().trim() })),
    itinerary: $(".tl").toArray().map(t => ({ name: $(t).find("h3").text().trim(), description: $(t).find("p").text().trim() })),
    included: $(".incl > div").first().find("li").map((_, li) => $(li).text().trim()).get(),
    attractions: $(".seelist li").map((_, li) => $(li).text().trim()).get(),
  };
  $("head").append(jsonLdTag(buildDocumentGraph(content)));
  return { html: $.html(), content };
}
