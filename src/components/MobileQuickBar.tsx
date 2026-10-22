"use client";

import Link from "next/link";
import { useMobileLayout } from "@/components/MobileLayoutProvider";
import { site } from "@/content/site";

export function MobileQuickBar() {
  const { version, ready } = useMobileLayout();

  if (!ready || version !== "v2") return null;

  return (
    <div className="mobile-quickbar">
      <a href={`tel:${site.phoneRaw}`} className="btn btn--ghost mobile-quickbar__btn">
        Zavolat
      </a>
      <Link href="/objednani" className="btn btn--primary mobile-quickbar__btn">
        Objednat
      </Link>
    </div>
  );
}
