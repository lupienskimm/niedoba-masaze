"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Renders only mobile OR desktop home trees so hidden variants
 * do not download images / JS for the other viewport.
 */
export function HomeShell({
  mobile,
  desktop,
}: {
  mobile: ReactNode;
  desktop: ReactNode;
}) {
  const [mode, setMode] = useState<"mobile" | "desktop" | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const sync = () => setMode(mq.matches ? "mobile" : "desktop");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // SSR + first paint: prefer mobile markup (smaller) until measured
  if (mode === null || mode === "mobile") {
    return <div className="home-mobile">{mobile}</div>;
  }

  return <>{desktop}</>;
}
