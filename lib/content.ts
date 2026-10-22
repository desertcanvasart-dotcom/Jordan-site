import { siteOrigin } from "./business";
import type { Locale } from "./i18n";

export const SITE_URL = siteOrigin();
export const OG_IMAGE = `${SITE_URL}/assets/og/wadirum-sunset.jpg`;

export const site = {
  name: "Diyar",
  arName: "ديار",
  alternateNames: ["Diyar", "ديار"],
  legalName: "Operating company name to be confirmed",
  foundingDate: "",
  founders: [
    {
      name: "Founder name to be confirmed",
      jobTitle: "Founder",
      sameAs: "",
      knowsAbout: ["Jordan private travel", "Worldwide family travel", "Luxury Jordan itineraries"],
    },
  ],
  logo: `${SITE_URL}/logo.svg`,
  phone: "+962 7 0000 0000",
  phoneHref: "tel:+962700000000",
  whatsapp: "962700000000",
  email: "hello@jordanbylocal.com",
  instagram: "#",
  facebook: "",
  linkedin: "",
  youtube: "",
  tripadvisor: "",
  priceRange: "$$$",
  address: {
    street: "Office address to be confirmed",
    locality: "Amman",
    region: "Amman Governorate",
    postalCode: "",
    country: "JO",
  },
  awards: [] as string[],
  accreditations: [] as string[],
  areaServed: ["Jordan", "Amman", "Petra", "Wadi Rum", "Dead Sea", "Jerash", "Aqaba", "Saudi Arabia", "United Arab Emirates"],
  knowsAbout: [
    "Jordan private tours",
    "Petra travel planning",
    "Wadi Rum luxury camps",
    "Dead Sea resorts",
    "Jordan family travel",
    "World traveler concierge",
    "Arabic-first travel planning",
  ],
  positioning:
    "Arabic-first premium Jordan travel concierge designing private Jordan journeys for families worldwide, couples, and luxury travelers.",
  llmsOffer:
    "Diyar designs private Jordan journeys around travel desire rather than generic destination lists. Launch journeys include a three-day weekend escape, a five-day family journey, a luxury desert and Dead Sea escape, and a seven-day full Jordan route covering Amman, Jerash, Petra, Wadi Rum, the Dead Sea, and optional Aqaba extensions.",
  llmsPricing:
    "The brand uses a consultation-led booking model. Travelers share dates, group size, comfort level, and preferences through WhatsApp or a short lead form. The team then prepares a private itinerary and quote. Published starting prices can be added later once supplier agreements and pricing policy are approved.",
};

export type Journey = {
  slug: string;
  duration: string;
  title: Record<Locale, string>;
  bestFor: Record<Locale, string>;
  pace: Record<Locale, string>;
  image: string;
};

export const journeys: Journey[] = [
  {
    slug: "weekend-escape",
    duration: "3 days",
    title: { ar: "عطلة نهاية الأسبوع", en: "Weekend Escape" },
    bestFor: { ar: "الإخوة العرب من الأزواج والعائلات", en: "Couples and families worldwide" },
    pace: { ar: "بحر ميت أو وادي رم بوتيرة هادئة", en: "Dead Sea or Wadi Rum at an easy pace" },
    image: "https://images.unsplash.com/photo-1548786811-dd6e453ccca7?auto=format&fit=crop&w=1100&q=82",
  },
  {
    slug: "family-journey",
    duration: "5 days",
    title: { ar: "رحلة عائلية", en: "Family Journey" },
    bestFor: { ar: "خصوصية، توقفات مريحة، وغرف عائلية", en: "Privacy, comfort stops, family rooms" },
    pace: { ar: "البتراء، وادي رم، والبحر الميت", en: "Petra, Wadi Rum, and the Dead Sea" },
    image: "https://images.unsplash.com/photo-1579606032821-4e6161c81bd3?auto=format&fit=crop&w=1100&q=82",
  },
  {
    slug: "luxury-desert-dead-sea",
    duration: "5-6 days",
    title: { ar: "رفاهية الصحراء والبحر الميت", en: "Luxury Desert & Dead Sea" },
    bestFor: { ar: "مخيمات فاخرة، منتجعات، ووصول خاص", en: "Luxury camps, resorts, VIP arrival" },
    pace: { ar: "تجربة قصيرة بمستوى راق", en: "A refined short escape" },
    image: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=1100&q=82",
  },
  {
    slug: "full-jordan-journey",
    duration: "7 days",
    title: { ar: "رحلة الأردن الكاملة", en: "Full Jordan Journey" },
    bestFor: { ar: "أول زيارة للأردن مع خط سير كامل", en: "First visits with the complete route" },
    pace: { ar: "عمّان، جرش، البتراء، وادي رم، العقبة", en: "Amman, Jerash, Petra, Wadi Rum, Aqaba" },
    image: "https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?auto=format&fit=crop&w=1100&q=82",
  },
];

export const copy = {
  ar: {
    metaTitle: "ديار | رحلات الأردن الخاصة",
    metaDescription:
      "رحلات أردن خاصة ومصممة للإخوة العرب وعائلاتهم: البتراء، وادي رم، البحر الميت، عمّان، جرش والعقبة مع تخطيط خاص ودعم واتساب.",
    nav: {
      escapes: "الرحلات",
      why: "لماذا نحن",
      proof: "الثقة",
      contact: "خطط رحلتك",
      language: "English",
    },
    hero: {
      kicker: "رحلات أردن خاصة للإخوة العرب",
      title: "الأردن، مخطط بعناية حولك.",
      text:
        "نصمم رحلات خاصة إلى البتراء ووادي رم والبحر الميت للعائلات والأزواج، مع سائقين موثوقين، إقامة مريحة، ودعم واتساب من أول رسالة حتى العودة.",
      primary: "خطط رحلتك",
      secondary: "راسلنا واتساب",
      chips: ["عطلة قصيرة", "رحلة عائلية", "رفاهية الصحراء", "الأردن الكامل"],
    },
    escape: {
      kicker: "اختر نوع الرحلة",
      heading: "ابدأ من أسلوب السفر، وليس من قائمة أماكن.",
      text:
        "الصفحة الرئيسية توجه المسافر حسب الرغبة: عطلة نهاية أسبوع، رحلة عائلية، تجربة فاخرة، أو خط سير كامل.",
      view: "اعرف المزيد",
    },
    why: {
      kicker: "لماذا تسافر معنا",
      heading: "راحة عائلية، خصوصية، وتفاصيل واضحة قبل الحجز.",
      points: [
        ["تخطيط خاص", "نقترح خط سير يناسب أعمار المسافرين، وقت الوصول، ومستوى الراحة المطلوب."],
        ["سائقون ومرشدون موثوقون", "تجربة خاصة من المطار وحتى آخر يوم، بدون مجموعات مزدحمة أو جدول مرهق."],
        ["إقامات مختارة", "منتجعات البحر الميت، مخيمات وادي رم، وفنادق عمّان حسب الميزانية ومستوى الخدمة."],
        ["دعم واتساب", "رسالة واحدة تكفي لتعديل الخطة، تأكيد المواعيد، أو طلب مساعدة أثناء الرحلة."],
        ["وضوح الدفع", "نوضح الوديعة، ما يشمله السعر، وسياسة الإلغاء قبل تأكيد الحجز."],
        ["خطة طوارئ", "رقم دعم مخصص أثناء الرحلة، مع بدائل إذا تغيّر الطقس أو الوقت."],
      ],
    },
    featured: {
      kicker: "رحلات مقترحة",
      heading: "أربع رحلات كبداية للبيع والإعلانات.",
      text: "هذه الرحلات هي أساس المرحلة الأولى، ويمكن تحويل كل واحدة منها إلى صفحة تفصيلية لاحقا.",
      bestFor: "مناسبة لـ",
      pace: "الوتيرة",
    },
    proof: {
      kicker: "الثقة قبل التوسع",
      heading: "نطلق بقسم ثقة واضح، ثم نضيف قصص العملاء عندما تصبح حقيقية.",
      text:
        "الخطة تنص على عدم إنشاء صفحة تقييمات ضعيفة قبل وجود ثلاث إلى خمس قصص موثقة. لذلك تعرض الصفحة الآن نظام الثقة: اسم الشركة المشغلة، شروط الدفع، الفريق، ووعود الدعم.",
      items: ["بيانات الترخيص والشركة المشغلة", "أسماء وصور الفريق عند الاعتماد", "شروط دفع وإلغاء منشورة", "توثيق أول رحلات العملاء بالصور والموافقة"],
    },
    cta: {
      kicker: "ابدأ التخطيط",
      heading: "أخبرنا من سيسافر ومستوى الراحة المطلوب.",
      text: "سنقترح رحلة أردن خاصة تناسب التواريخ، عدد المسافرين، والميزانية، ثم نكمل التفاصيل عبر واتساب.",
      name: "الاسم",
      whatsapp: "رقم واتساب",
      dates: "تواريخ السفر",
      travelers: "عدد المسافرين",
      comfort: "مستوى الراحة",
      submit: "إرسال الطلب",
      note: "الربط الفعلي للنموذج يضاف عند اختيار CRM أو بريد الاستقبال.",
    },
    footer: {
      tagline: "علامة أردن مستقلة، عربية أولا، مبنية لإطلاق رحلات خاصة للمسافرين من السعودية والإمارات.",
      company: "الشركة المشغلة",
      companyNote: "سيتم تحديث الاسم القانوني بعد اعتماده في مرحلة الإطلاق.",
    },
  },
  en: {
    metaTitle: "Diyar | Private Jordan Travel Packages",
    metaDescription:
      "Private Jordan travel packages for world travelers: Petra, Wadi Rum, Dead Sea, Amman, Jerash and Aqaba with private planning and WhatsApp support.",
    nav: {
      escapes: "Escapes",
      why: "Why us",
      proof: "Trust",
      contact: "Plan your trip",
      language: "العربية",
    },
    hero: {
      kicker: "Private Jordan trips for world travelers",
      title: "Jordan, beautifully planned around you.",
      text:
        "Private journeys to Petra, Wadi Rum, and the Dead Sea for families and couples, with trusted drivers, comfortable stays, and WhatsApp support from first message to final drop-off.",
      primary: "Plan Your Trip",
      secondary: "WhatsApp Us",
      chips: ["Weekend escape", "Family journey", "Luxury desert", "Full Jordan"],
    },
    escape: {
      kicker: "Choose your escape",
      heading: "Start with how you want to travel, not a list of places.",
      text:
        "The homepage routes visitors by desire: a short weekend, a family journey, a luxury escape, or the full Jordan route.",
      view: "View journey",
    },
    why: {
      kicker: "Why travel with us",
      heading: "Family comfort, privacy, and clear details before you book.",
      points: [
        ["Private planning", "We shape the route around ages, arrival time, desired comfort level, and pace."],
        ["Trusted drivers and guides", "Private service from airport arrival to the final day, without rushed group schedules."],
        ["Premium stays", "Dead Sea resorts, Wadi Rum camps, and Amman hotels selected by budget and service level."],
        ["WhatsApp support", "One thread for changes, confirmations, and help while traveling."],
        ["Payment clarity", "Deposits, inclusions, exclusions, and cancellation terms are clear before confirmation."],
        ["Emergency line", "A support number during the trip, with alternatives for weather or timing changes."],
      ],
    },
    featured: {
      kicker: "Featured journeys",
      heading: "Four launch journeys ready for sales and ads.",
      text: "These are the phase-one commercial anchors, ready to become detailed pages next.",
      bestFor: "Best for",
      pace: "Pace",
    },
    proof: {
      kicker: "Trust before scale",
      heading: "Launch with a clear trust system, then add client stories when they are real.",
      text:
        "The launch plan avoids a thin reviews page before three to five documented client stories exist. For now, the homepage shows the trust architecture: operating company, payment terms, team, and support promises.",
      items: ["Visible licensing and operating-company details", "Team names and faces once confirmed", "Published payment and cancellation terms", "First client journeys documented with permission"],
    },
    cta: {
      kicker: "Start planning",
      heading: "Tell us who is traveling and the comfort level you prefer.",
      text: "We will design a private Jordan journey around your dates, travelers, and budget, then continue the details on WhatsApp.",
      name: "Name",
      whatsapp: "WhatsApp number",
      dates: "Travel dates",
      travelers: "Travelers",
      comfort: "Comfort level",
      submit: "Send Request",
      note: "Form wiring can be connected once the CRM or inbox is selected.",
    },
    footer: {
      tagline: "A standalone, Arabic-first Jordan brand built to launch private trips for Saudi and UAE travelers.",
      company: "Operating company",
      companyNote: "Legal name to be updated after launch approval.",
    },
  },
} satisfies Record<Locale, Record<string, unknown>>;

export function t(locale: Locale) {
  return copy[locale];
}
