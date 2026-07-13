import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import { journeys, site, t } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { buildHomeJsonLd } from "@/lib/schema";

function Arrow() {
  return (
    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomePage({ locale }: { locale: Locale }) {
  const c = t(locale);

  return (
    <>
      <JsonLd id={`home-jsonld-${locale}`} data={buildHomeJsonLd(locale)} />
      <Header locale={locale} />
      <main id="top">
        <section className="hero">
          <div className="hero-media" aria-hidden="true" />
          <div className="shell hero-inner">
            <div className="hero-copy">
              <div className="kicker reveal">
                <i>01</i>
                <span>{c.hero.kicker}</span>
                <b />
              </div>
              <h1 className="reveal" data-delay="1">{c.hero.title}</h1>
              <p className="reveal" data-delay="2">{c.hero.text}</p>
              <div className="hero-actions reveal" data-delay="3">
                <a className="pill-cta" href="#contact">
                  {c.hero.primary}
                  <span><Arrow /></span>
                </a>
                <a className="ghost-cta" href={`https://wa.me/${site.whatsapp}`}>
                  {c.hero.secondary}
                </a>
              </div>
              <div className="hero-chips reveal" data-delay="4">
                {c.hero.chips.map((chip) => (
                  <a href="#escapes" key={chip}>{chip}</a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section intro-band" id="escapes">
          <div className="shell section-head">
            <div className="kicker reveal">
              <i>02</i>
              <span>{c.escape.kicker}</span>
              <b />
            </div>
            <div className="section-title-row">
              <h2 className="display reveal" data-delay="1">{c.escape.heading}</h2>
              <p className="reveal" data-delay="2">{c.escape.text}</p>
            </div>
          </div>

          <div className="shell desire-grid">
            {journeys.map((journey, index) => (
              <a className="desire-card reveal" href="#contact" data-delay={(index % 4) + 1} key={journey.slug}>
                <figure
                  className="desire-image"
                  role="img"
                  aria-label={`${journey.title[locale]} - ${journey.pace[locale]}`}
                  style={{ backgroundImage: `url('${journey.image}')` }}
                >
                  <figcaption className="sr-only">
                    {journey.title[locale]} - {journey.pace[locale]}
                  </figcaption>
                </figure>
                <div className="desire-body">
                  <span>{journey.duration}</span>
                  <h3>{journey.title[locale]}</h3>
                  <p>{journey.bestFor[locale]}</p>
                  <em>
                    {c.escape.view}
                    <Arrow />
                  </em>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="section why" id="why">
          <div className="shell split">
            <div className="section-head sticky-head">
              <div className="kicker reveal">
                <i>03</i>
                <span>{c.why.kicker}</span>
                <b />
              </div>
              <h2 className="display reveal" data-delay="1">{c.why.heading}</h2>
            </div>
            <div className="why-grid">
              {c.why.points.map(([title, text], index) => (
                <article className="why-card reveal" data-delay={(index % 3) + 1} key={title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section featured">
          <div className="shell section-head">
            <div className="kicker reveal">
              <i>04</i>
              <span>{c.featured.kicker}</span>
              <b />
            </div>
            <div className="section-title-row">
              <h2 className="display reveal" data-delay="1">{c.featured.heading}</h2>
              <p className="reveal" data-delay="2">{c.featured.text}</p>
            </div>
          </div>

          <div className="shell journey-list">
            {journeys.map((journey, index) => (
              <article className="journey-row reveal" data-delay={(index % 4) + 1} key={journey.slug}>
                <span className="journey-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{journey.title[locale]}</h3>
                <p><strong>{c.featured.bestFor}:</strong> {journey.bestFor[locale]}</p>
                <p><strong>{c.featured.pace}:</strong> {journey.pace[locale]}</p>
                <span className="duration">{journey.duration}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section proof" id="proof">
          <div className="shell proof-grid">
            <div>
              <div className="kicker kicker-light reveal">
                <i>05</i>
                <span>{c.proof.kicker}</span>
                <b />
              </div>
              <h2 className="display reveal" data-delay="1">{c.proof.heading}</h2>
              <p className="reveal" data-delay="2">{c.proof.text}</p>
            </div>
            <div className="proof-panel reveal" data-delay="3">
              {c.proof.items.map((item) => (
                <article className="proof-item" key={item}>
                  <span />
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="shell contact-grid">
            <div className="contact-copy">
              <div className="kicker reveal">
                <i>06</i>
                <span>{c.cta.kicker}</span>
                <b />
              </div>
              <h2 className="display reveal" data-delay="1">{c.cta.heading}</h2>
              <p className="reveal" data-delay="2">{c.cta.text}</p>
              <a className="pill-cta dark reveal" data-delay="3" href={`https://wa.me/${site.whatsapp}`}>
                {c.hero.secondary}
                <span><Arrow /></span>
              </a>
            </div>

            <form className="lead-form reveal" data-delay="2">
              <label>
                <span>{c.cta.name}</span>
                <input name="name" autoComplete="name" />
              </label>
              <label>
                <span>{c.cta.whatsapp}</span>
                <input name="whatsapp" autoComplete="tel" />
              </label>
              <label>
                <span>{c.cta.dates}</span>
                <input name="dates" />
              </label>
              <label>
                <span>{c.cta.travelers}</span>
                <input name="travelers" inputMode="numeric" />
              </label>
              <label className="full">
                <span>{c.cta.comfort}</span>
                <select name="comfort" defaultValue="">
                  <option value="" disabled />
                  <option>Comfort</option>
                  <option>Premium</option>
                  <option>Luxury</option>
                </select>
              </label>
              <button type="button">
                {c.cta.submit}
                <Arrow />
              </button>
              <p>{c.cta.note}</p>
              <p className="updated">
                Last updated: <time dateTime="2026-07-13">July 13, 2026</time>
              </p>
            </form>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
