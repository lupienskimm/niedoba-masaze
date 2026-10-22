import Link from "next/link";
import { SiteMap } from "@/components/SiteMap";
import { nav, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <p className="site-footer__brand">{site.name}</p>
          <p className="site-footer__wish">{site.wish}</p>
        </div>
        <div>
          <p className="site-footer__heading">Kontakt</p>
          <ul className="site-footer__list">
            <li>{site.address}</li>
            <li>
              <a href={`tel:${site.phoneRaw}`}>{site.phoneDisplay}</a>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
          </ul>
        </div>
        <div>
          <p className="site-footer__heading">Navigace</p>
          <ul className="site-footer__list">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="site-footer__map-col">
          <p className="site-footer__heading">Kde nás najdete</p>
          <SiteMap size="mini" />
          <p className="site-footer__map-note">{site.openingHoursShort}</p>
          <p className="muted site-footer__map-note">{site.openingNote}</p>
        </div>
      </div>

      <div className="site-footer__legal">
        <p>{site.businessNote}</p>
        <div className="site-footer__legal-right">
          <p>© 2026 {site.name}</p>
          <a
            href="https://azervera.cz"
            className="site-footer__credit"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="site-footer__credit-text">
              Build &amp; Designed by AZERVERA
            </span>
            <span
              className="site-footer__credit-logo"
              role="img"
              aria-label="AZERVERA"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
