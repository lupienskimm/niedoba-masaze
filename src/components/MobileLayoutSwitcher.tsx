"use client";

import {
  LAYOUT_LABELS,
  LAYOUT_VERSIONS,
  useMobileLayout,
} from "@/components/MobileLayoutProvider";

export function MobileLayoutSwitcher() {
  const { version, setVersion, ready } = useMobileLayout();

  if (!ready) return null;

  return (
    <div
      className="layout-switcher"
      role="group"
      aria-label="Verze homepage"
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
