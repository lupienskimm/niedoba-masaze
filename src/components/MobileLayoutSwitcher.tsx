"use client";

import {
  LAYOUT_LABELS,
  LAYOUT_VERSIONS,
  useMobileLayout,
} from "@/components/MobileLayoutProvider";

/** Desktop only — mobile always uses the V2-style home */
export function MobileLayoutSwitcher() {
  const { version, setVersion, ready } = useMobileLayout();

  if (!ready) return null;

  return (
    <div
      className="layout-switcher"
      role="group"
      aria-label="Verze homepage (PC)"
    >
      {LAYOUT_VERSIONS.map((v) => (
        <button
          key={v}
          type="button"
          className={`layout-switcher__btn${version === v ? " is-active" : ""}`}
          onClick={() => setVersion(v)}
          aria-pressed={version === v}
          title={LAYOUT_LABELS[v].title}
        >
          {LAYOUT_LABELS[v].short}
        </button>
      ))}
    </div>
  );
}
