"use client";

import { useSyncExternalStore, type ReactNode } from "react";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(max-width: 860px)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia("(max-width: 860px)").matches ? "mobile" : "desktop";
}

/** Desktop-first SSR snapshot avoids CLS on PC (mobile may swap once). */
function getServerSnapshot() {
  return "desktop" as const;
}

/**
 * Mounts only the active viewport tree after hydration.
 * Server + first desktop paint use desktop to keep CLS ~0 on PC.
 */
export function HomeShell({
  mobile,
  desktop,
}: {
  mobile: ReactNode;
  desktop: ReactNode;
}) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (mode === "mobile") {
    return <div className="home-mobile">{mobile}</div>;
  }

  return <>{desktop}</>;
}
