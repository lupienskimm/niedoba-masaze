"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FooterHours } from "@/components/FooterHours";
import { SiteMap } from "@/components/SiteMap";
import { nav, site } from "@/content/site";

export function Footer() {
  const pathname = usePathname();
  const hideFooterMap = pathname.startsWith("/kontakt");

  return (
    <footer className="site-footer">
      <div
        className={`site-footer__grid${hideFooterMap ? " site-footer__grid--no-map" : ""}`}
      >
        <div>
          <p className="site-footer__brand">{site.name}</p>
          <FooterHours />
        </div>
        <div>
          <p className="site-footer__heading">Kontakt</p>
          <ul className="site-footer__list">
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
        {!hideFooterMap && (
          <div className="site-footer__map-col">
            <p className="site-footer__heading">Kde mě najdete</p>
            <SiteMap size="mini" />
          </div>
        )}
      </div>

      <p className="site-footer__wish">{site.wish}</p>

      <div className="site-footer__legal">
        <p className="site-footer__copy">© 2026 {site.name}</p>
        <p className="site-footer__business">{site.businessNote}</p>
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
    </footer>
  );
}
