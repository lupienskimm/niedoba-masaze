"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site } from "@/content/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-logo" onClick={() => setOpen(false)}>
          <Image
            src="/logos/mark.svg"
            alt=""
            width={44}
            height={45}
            className="site-logo__mark"
            priority
          />
          <Image
            src="/logos/wordmark.svg"
            alt={site.name}
            width={200}
            height={29}
            className="site-logo__word"
            priority
          />
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-toggle__label">{open ? "Zavřít" : "Menu"}</span>
        </button>

        <nav
          id="site-nav"
          className={`site-nav${open ? " is-open" : ""}`}
          aria-label="Hlavní navigace"
        >
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`site-nav__link${active ? " is-active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/objednani"
            className="btn btn--primary site-nav__cta"
            onClick={() => setOpen(false)}
          >
            Objednat
          </Link>
        </nav>
      </div>
    </header>
  );
}
