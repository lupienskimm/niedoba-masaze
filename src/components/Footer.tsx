import Link from "next/link";
import { nav, site } from "@/content/site";
import { StyleSwitcher } from "./StyleSwitcher";

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
        <div>
          <p className="site-footer__heading">Otevírací doba</p>
          <p>{site.openingHoursFull}</p>
          <p className="muted">{site.openingNote}</p>
        </div>
      </div>

      <StyleSwitcher />

      <div className="site-footer__legal">
        <p>{site.businessNote}</p>
        <p>© 2026 {site.name}</p>
      </div>
    </footer>
  );
}
