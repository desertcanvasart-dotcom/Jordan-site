import { site, t } from "@/lib/content";
import { localeHref, oppositeLocale, type Locale } from "@/lib/i18n";

export default function Header({ locale }: { locale: Locale }) {
  const c = t(locale);
  const other = oppositeLocale(locale);

  return (
    <header className="site-header" id="site-header">
      <div className="shell header-grid">
        <a className="brand" href={localeHref(locale, "/")} aria-label={locale === "ar" ? site.arName : site.name}>
          <span>{locale === "ar" ? site.arName : site.name}</span>
          <small>Jordan Travel Concierge</small>
        </a>

        <nav className="nav" aria-label="Primary">
          <a href="#escapes">{c.nav.escapes}</a>
          <a href="#why">{c.nav.why}</a>
          <a href="#proof">{c.nav.proof}</a>
          <a href="#contact">{c.nav.contact}</a>
        </nav>

        <div className="header-actions">
          <a className="lang" href={localeHref(other, "/")}>
            {c.nav.language}
          </a>
          <a className="header-cta" href={`https://wa.me/${site.whatsapp}`}>
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
