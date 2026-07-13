import { site, t } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export default function Footer({ locale }: { locale: Locale }) {
  const c = t(locale);

  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div>
          <a className="footer-brand" href="#top">
            {locale === "ar" ? site.arName : site.name}
          </a>
          <p>{c.footer.tagline}</p>
        </div>

        <div>
          <h3>{c.footer.company}</h3>
          <p>
            <strong>{site.legalName}</strong>
            <br />
            {c.footer.companyNote}
          </p>
        </div>

        <div>
          <h3>Contact</h3>
          <address>
            <span>{site.address.street}</span>
            <span>{site.address.locality}, {site.address.country}</span>
            <a href={`https://wa.me/${site.whatsapp}`}>WhatsApp: {site.phone}</a>
            <a href={site.phoneHref}>{site.phone}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </address>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>{"©"} {new Date().getFullYear()} {site.name}</span>
        <span>Arabic-first Jordan travel brand. Phase 1 homepage.</span>
      </div>
    </footer>
  );
}
