import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import vm from 'node:vm';

const base = process.env.SITE_TEST_URL || 'http://127.0.0.1:3100';
const business = JSON.parse(readFileSync(new URL('../content/business.json', import.meta.url), 'utf8'));
const canonicalOrigin = new URL(process.env.SITE_URL || business.productionUrl || base).origin;
const source = readFileSync(new URL('../lib/diyar-html.ts', import.meta.url), 'utf8');
const pages = ['', ...source.match(/export const diyarPages = \[([\s\S]*?)\] as const/)[1].matchAll(/"([^"]+)"/g)].map(p => typeof p === 'string' ? p : p[1]);
let server;
let output = '';
before(async () => {
  if (!process.env.SITE_TEST_URL) {
    server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3100'], { stdio: ['ignore', 'pipe', 'pipe'] });
    server.stdout.on('data', data => { output += data; });
    server.stderr.on('data', data => { output += data; });
  }
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if ((await fetch(base)).ok) return; } catch { /* Server is starting. */ }
    if (server?.exitCode != null) throw new Error(output);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error(`Demo did not start: ${output}`);
});
after(() => server?.kill('SIGTERM'));

function copyTokens(html) {
  const clean = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<!--[\s\S]*?-->/gi, '');
  return [
    ...clean.split(/<[^>]+>/g),
    ...[...clean.matchAll(/\b(?:alt|placeholder|aria-label)="([^"]*)"/g)].map(match => match[1]),
    ...[...clean.matchAll(/<meta name="description" content="([^"]*)"/g)].map(match => match[1]),
  ];
}

test('every page has translated Arabic copy, RTL, and matching language/navigation links', async () => {
  for (const page of pages) {
    const suffix = page ? `/${page}` : '';
    const ar = await fetch(`${base}/ar${suffix}`);
    const en = await fetch(`${base}/en${suffix}`);
    assert.equal(ar.status, 200, `Arabic ${page}`);
    assert.equal(en.status, 200, `English ${page}`);
    assert.equal(ar.headers.get('content-language'), 'ar');
    const arabic = await ar.text();
    const english = await en.text();
    assert.match(arabic, /<html lang="ar" dir="rtl">/);
    assert.match(english, /<html lang="en" dir="ltr">/);
    assert.notEqual(arabic, english);
    for (const html of [arabic, english]) {
      const desktopLinks = html.match(/<div class="nav-links">([\s\S]*?)<\/div>/)?.[1];
      const mobileLinks = html.match(/<div class="mobile-menu-links">([\s\S]*?)<\/div>/)?.[1];
      assert.ok(desktopLinks, `Missing navigation: ${page}`);
      assert.equal(mobileLinks, desktopLinks, `Mobile navigation differs: ${page}`);
      assert.match(html, /<details class="mobile-menu" data-mobile-menu(?:="")?><summary aria-label="[^"]+">/);
    }
    if (page === 'plan-your-trip') {
      assert.match(arabic, /<option selected(?:="")?>العربية<\/option>/);
      assert.match(english, /<option selected(?:="")?>English<\/option>/);
      assert.ok(arabic.includes('id="wa" dir="ltr"'));
    }
    assert.ok(arabic.includes(`href="/en${suffix}" lang="en"`), `Arabic switch: ${page}`);
    assert.ok(english.includes(`href="/ar${suffix}" lang="ar"`), `English switch: ${page}`);
    assert.ok(!arabic.includes('href="#"'), `Placeholder language link: ${page}`);
    for (const [, href] of arabic.matchAll(/href="(\/[^"#]*)"/g)) {
      assert.ok(href.startsWith('/ar') || href.startsWith('/en') || href.startsWith('/assets/'), `Nonlocalized link ${page}: ${href}`);
    }
    for (const token of copyTokens(arabic)) {
      const text = token.replace(/&[a-zA-Z0-9#]+;/g, '').replace(/hello@diyar\.jo|Switch to English|English|\[XX\]|\+966 5X XXX XXXX/g, '');
      assert.ok(!/[A-Za-z]/.test(text), `Untranslated copy ${page}: ${token.trim()}`);
    }
  }
});

test('legacy redirects stay on the current host', async () => {
  for (const [path, target] of [['/', '/ar'], ['/petra', '/en/petra']]) {
    const response = await fetch(base + path, { redirect: 'manual' });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), target);
  }
});

test('unknown locale and unknown content page return 404', async () => {
  for (const path of ['/fr', '/fr/petra', '/ar/unknown', '/en/unknown']) {
    assert.equal((await fetch(base + path)).status, 404, path);
  }
});

test('sitemap contains matching Arabic/English content alternatives', async () => {
  const sitemap = await (await fetch(base + '/sitemap.xml')).text();
  for (const page of pages.filter(Boolean)) {
    assert.ok(sitemap.includes(`/ar/${page}`));
    assert.ok(sitemap.includes(`/en/${page}`));
  }
});

test('WhatsApp draft uses page language and encodes user input without sending messages', () => {
  const script = readFileSync(new URL('../public/assets/js/diyar.js', import.meta.url), 'utf8');
  for (const locale of ['ar', 'en']) {
    let submit;
    let opened;
    const fields = {
      name: { value: 'نورة & <Test>' }, wa: { value: '+966 512345678' },
      dates: { value: 'أكتوبر' }, travelers: { value: '2' },
      escape: { value: locale === 'ar' ? 'رحلة عائلية (٥ أيام)' : 'Family Journey (5 days)' },
      lang: { value: locale === 'ar' ? 'العربية' : 'English' },
    };
    const context = {
      document: {
        documentElement: { lang: locale }, querySelectorAll: () => [],
        getElementById: id => id === 'planForm' ? { getAttribute: () => '962700000000', addEventListener: (_, handler) => { submit = handler; } } : fields[id],
      },
      window: { location: { assign: url => { opened = [url]; } } },
      matchMedia: () => ({ matches: true }),
      encodeURIComponent,
    };
    vm.runInNewContext(script, context);
    submit({ preventDefault() {} });
    const message = new URL(opened[0]).searchParams.get('text');
    assert.ok(message.includes('نورة & <Test>'));
    assert.ok(message.includes(fields.escape.value));
    assert.ok(message.includes(locale === 'ar' ? 'الاسم: ' : 'Name: '));
    assert.ok(message.startsWith(locale === 'ar' ? 'مرحباً ديار' : 'Hello Diyar'));
  }
});

test('metadata, semantics and connected localized schema cover all published pages', async () => {
  const { load } = await import('cheerio');
  const articles = JSON.parse(readFileSync(new URL('../content/articles.json', import.meta.url), 'utf8'));
  const paths = [...pages.map(page => page || 'home'), ...Object.keys(articles).map(slug => `journal/${slug}`)];
  const uniqueTitles = new Set();
  for (const locale of ['ar', 'en']) for (const key of paths) {
    const path = `/${locale}${key === 'home' ? '' : `/${key}`}`;
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const $ = load(await response.text());
    assert.equal($('h1').length, 1, path);
    assert.equal($('main').length, 1, path);
    let previous = 0;
    $('h1,h2,h3,h4,h5,h6').each((_, heading) => {
      const level = Number(heading.tagName.slice(1));
      assert.ok(level <= previous + 1, `Skipped heading level: ${path}`);
      previous = level;
    });
    assert.equal($('link[rel="canonical"]').attr('href'), canonicalOrigin + path);
    for (const language of ['ar', 'en', 'x-default']) {
      assert.equal($(`link[hreflang="${language}"]`).attr('href'), `${canonicalOrigin}/${language === 'x-default' ? 'ar' : language}${key === 'home' ? '' : `/${key}`}`);
    }
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content');
    assert.ok(title.length >= 50 && title.length <= 60, `Title length ${path}: ${title.length}`);
    assert.ok(description.length >= 150 && description.length <= 160, `Description length ${path}: ${description.length}`);
    assert.ok(!uniqueTitles.has(title), `Duplicate title: ${title}`); uniqueTitles.add(title);
    for (const property of ['og:type','og:title','og:description','og:image','og:url','og:site_name','og:locale','og:locale:alternate']) assert.ok($(`meta[property="${property}"]`).attr('content'), `${path}: ${property}`);
    for (const name of ['twitter:card','twitter:title','twitter:description','twitter:image']) assert.ok($(`meta[name="${name}"]`).attr('content'), `${path}: ${name}`);
    const schema = JSON.parse($('script[type="application/ld+json"]').text());
    const graph = schema['@graph'];
    assert.equal(schema['@context'], 'https://schema.org');
    const agency = graph.find(n => n['@type'] === 'TravelAgency');
    assert.equal(agency.name, locale === 'ar' ? 'ديار' : 'Diyar');
    assert.ok(!JSON.stringify(schema).includes('to be confirmed'));
    assert.ok(!JSON.stringify(schema).includes('962700000000'));
    assert.ok(!JSON.stringify(schema).includes('Jordan by Local'));
    const page = graph.find(n => n['@id'] === `${canonicalOrigin}${path}#webpage`);
    assert.equal(page.inLanguage, locale);
    assert.equal(page.publisher['@id'], agency['@id']);
    assert.ok(graph.some(n => n['@type'] === 'WebSite'));
    assert.ok(graph.some(n => n['@type'] === 'BreadcrumbList'));
    if ($('.faq-item').length) assert.equal(graph.find(n => n['@type'] === 'FAQPage').mainEntity.length, $('.faq-item').length);
    if (key.startsWith('journal/')) {
      const article = graph.find(n => n['@type'] === 'Article');
      assert.ok(article.articleBody.includes($('h1').text()));
      assert.equal(article.dateModified, $('time').last().attr('datetime'));
      assert.ok($('article .author-bio').length);
    }
    $('img').each((_, image) => {
      assert.ok($(image).attr('alt'), `Missing alt ${path}`);
      assert.ok($(image).attr('width') && $(image).attr('height'), `Missing dimensions ${path}`);
    });
    $('time').each((_, time) => assert.match($(time).attr('datetime'), /^\d{4}-\d{2}-\d{2}$/));
    assert.equal($('.reveal').length, 0, `Content hidden without JavaScript ${path}`);
  }
});

test('public content API agrees with rendered itinerary and FAQ and rejects unknown paths', async () => {
  const data = await (await fetch(base + '/api/content/ar/family-journey')).json();
  assert.equal(data.locale, 'ar');
  assert.equal(data.itinerary.length, 5);
  assert.ok(data.included.length > 0);
  assert.ok(data.structuredData['@graph'].some(n => n['@type'] === 'TouristTrip'));
  const faq = await (await fetch(base + '/api/content/en/private-jordan-trips')).json();
  assert.equal(faq.faq.length, 6);
  assert.match((await fetch(base + '/api/content/en/petra')).headers.get('x-robots-tag'), /noindex/);
  assert.equal((await fetch(base + '/api/content/en/secrets')).status, 404);
  assert.equal((await fetch(base + '/api/content/fr/petra')).status, 404);
});

test('AI files are curated, current and expose crawler choices without indexing API routes', async () => {
  const llms = await (await fetch(base + '/llms.txt')).text();
  assert.ok(llms.startsWith('# Diyar'));
  assert.ok(llms.includes('## Pricing and booking model'));
  assert.ok(llms.includes('/en/plan-your-trip'));
  assert.ok(!llms.includes('homepage only'));
  const robots = await (await fetch(base + '/robots.txt')).text();
  for (const bot of ['Googlebot', 'Bingbot', 'GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot']) assert.ok(robots.includes(`User-agent: ${bot}\nAllow: /\nDisallow: /api/`));
  assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
  const sitemap = await (await fetch(base + '/sitemap.xml')).text();
  assert.equal((sitemap.match(/<loc>/g) || []).length, 48);
  assert.ok(sitemap.includes('x-default'));
  assert.ok(!sitemap.includes('jordanbylocal.com'));
});

test('phone pattern is valid in modern HTML and requires actual digits', async () => {
  const { load } = await import('cheerio');
  const $ = load(await (await fetch(base + '/en/plan-your-trip')).text());
  const pattern = new RegExp(`^(?:${$('#wa').attr('pattern')})$`, 'v');
  for (const phone of ['+966 512345678', '(202) 555-0123', '0791234567']) assert.ok(pattern.test(phone), phone);
  for (const phone of ['-------', '123', '1234567890123456', 'phone-number']) assert.ok(!pattern.test(phone), phone);
});

test('homepage concierge has localized controls, truthful configuration and working handoff targets', async () => {
  const { load } = await import('cheerio');
  for (const locale of ['en', 'ar']) {
    const $ = load(await (await fetch(base + '/' + locale)).text());
    assert.equal($('#tripComposer').length, 1);
    assert.equal($('[data-journey]').length, 4);
    assert.equal($('#tripComposer [name="need"]').length, 6);
    assert.equal($('#tripComposer [name="days"]').length, 4);
    assert.equal($('main .page-updated').length, 0);
    assert.equal($('.footer .page-updated').length, 1);
    assert.equal($('.footer-op').length, 0);
    assert.equal($('#trust .trust-card').length, 0);
    const payload = JSON.parse($('#concierge-data').text());
    assert.equal(payload.locale, locale);
    assert.equal(payload.whatsapp, business.whatsapp);
    assert.equal(payload.trips.length, 4);
    assert.equal($('.hero-actions a').eq(1).attr('href'), 'https://wa.me/' + business.whatsapp + '?text=' + encodeURIComponent(locale === 'ar' ? 'مرحباً ديار، أود مناقشة رحلة خاصة في الأردن.' : 'Hello Diyar, I would like to discuss a private Jordan trip.'));
    assert.equal($('#escape a').eq(2).find('img').attr('src'), '/assets/img/wadirum-sunset.webp');
    assert.match($('#escape a').eq(2).attr('href'), /^#journey-/);
  }
});

test('production serves localized pages from the static response cache without losing composer URLs', async () => {
  const articles = JSON.parse(readFileSync(new URL('../content/articles.json', import.meta.url), 'utf8'));
  for (const locale of ['en', 'ar']) {
    const paths = [...pages.map(page => '/' + locale + (page ? '/' + page : '')), ...Object.keys(articles).map(slug => '/' + locale + '/journal/' + slug)];
    for (const path of paths) {
      const response = await fetch(base + path, { method: 'HEAD' });
      assert.equal(response.status, 200, path);
      assert.equal(response.headers.get('x-nextjs-cache'), 'HIT', `Page was rendered at request time: ${path}`);
      assert.equal(response.headers.get('content-language'), locale, path);
    }
    const plain = await (await fetch(base + '/' + locale)).text();
    const shared = await fetch(base + '/' + locale + '?who=1&days=2&pace=0&tier=1&need=1');
    assert.equal(shared.headers.get('x-nextjs-cache'), 'HIT');
    assert.equal(await shared.text(), plain, 'Preferences are restored in the browser; the shared URL must retain the same complete HTML');
  }
});
