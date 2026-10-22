"use client";

import { useMobileLayout } from "@/components/MobileLayoutProvider";

export function MobileLayoutSwitcher() {
  const { version, setVersion, ready } = useMobileLayout();

  if (!ready) return null;

  return (
    <div
      className="layout-switcher"
      role="group"
      aria-label="Verze webu"
      title="V1 plný web · V2 rychlá cesta k rezervaci"
    >
      <button
        type="button"
        className={`layout-switcher__btn${version === "v1" ? " is-active" : ""}`}
        onClick={() => setVersion("v1")}
        aria-pressed={version === "v1"}
      >
        V1
      </button>
      <button
        type="button"
        className={`layout-switcher__btn${version === "v2" ? " is-active" : ""}`}
        onClick={() => setVersion("v2")}
        aria-pressed={version === "v2"}
      >
        V2
      </button>
    </div>
  );
}
