"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

/**
 * Mobile floating Zavolat / Objednat — shows after hero CTAs scroll under the header.
 */
export function MobileQuickBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    let observer: IntersectionObserver | null = null;

    const setup = () => {
      observer?.disconnect();
      if (!mq.matches) {
        setVisible(false);
        return;
      }
      const target = document.querySelector("[data-hero-ctas]");
      if (!target) {
        setVisible(false);
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => {
          setVisible(!entry.isIntersecting);
        },
        {
          root: null,
          // Treat as gone once it sits under the floating header
          rootMargin: "-88px 0px 0px 0px",
          threshold: 0,
        },
      );
      observer.observe(target);
    };

    setup();
    mq.addEventListener("change", setup);
    window.addEventListener("resize", setup);
    return () => {
      observer?.disconnect();
      mq.removeEventListener("change", setup);
      window.removeEventListener("resize", setup);
    };
  }, []);

  return (
    <div
      className={`mobile-quickbar${visible ? " is-visible" : ""}`}
      aria-hidden={!visible}
    >
      <a
        href={`tel:${site.phoneRaw}`}
        className="btn btn--ghost mobile-quickbar__btn"
        tabIndex={visible ? 0 : -1}
      >
        Zavolat
      </a>
      <Link
        href="/objednani"
        className="btn btn--primary mobile-quickbar__btn"
        tabIndex={visible ? 0 : -1}
      >
        Objednat
      </Link>
    </div>
  );
}
