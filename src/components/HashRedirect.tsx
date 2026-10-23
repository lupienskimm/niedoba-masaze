"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { services } from "@/content/services";

const SERVICE_IDS = new Set<string>(services.map((s) => s.id));

/** Turns leftover /sluzby#id bookmarks into /sluzby/id and strips other hashes. */
export function HashRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const raw = window.location.hash.replace(/^#/, "").trim();
    if (!raw) return;

    if (
      (pathname === "/sluzby" || pathname === "/sluzby/") &&
      SERVICE_IDS.has(raw)
    ) {
      router.replace(`/sluzby/${raw}`);
      return;
    }

    const clean = `${pathname}${window.location.search}`;
    window.history.replaceState(null, "", clean);
  }, [pathname, router]);

  return null;
}
