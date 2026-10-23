"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { nav, site } from "@/content/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className={`site-header${open ? " is-menu-open" : ""}`}>
        <div className="site-header__inner">
          <Link href="/" className="site-logo" onClick={() => setOpen(false)}>
            <Image
              src="/logos/mark.svg"
              alt=""
              width={44}
              height={45}
              className="site-logo__mark"
            />
            <Image
              src="/logos/wordmark.svg"
              alt={site.name}
              width={200}
              height={29}
              className="site-logo__word"
            />
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav-toggle__label">
              {open ? "Zavřít" : "Menu"}
            </span>
          </button>

          <nav className="site-nav site-nav--desktop" aria-label="Hlavní navigace">
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
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/objednani" className="btn btn--primary site-nav__cta">
              Objednat
            </Link>
          </nav>
        </div>
      </header>

      <div
        id="site-nav"
        className={`site-nav-overlay${open ? " is-open" : ""}`}
        aria-hidden={!open}
      >
        <nav className="site-nav-overlay__inner" aria-label="Mobilní navigace">
          {nav.map((item, i) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`site-nav-overlay__link${active ? " is-active" : ""}`}
                style={{ "--i": i } as CSSProperties}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/objednani"
            className="btn btn--primary site-nav-overlay__cta"
            style={{ "--i": nav.length } as CSSProperties}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            Objednat
          </Link>
        </nav>
      </div>
    </>
  );
}
