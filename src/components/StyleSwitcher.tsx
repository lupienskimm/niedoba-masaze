"use client";

import { themes } from "@/content/site";
import { useTheme } from "@/lib/theme";

export function StyleSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="style-switcher" role="group" aria-label="Přepínač stylů">
      <p className="style-switcher__label">Styl webu</p>
      <div className="style-switcher__row">
        {themes.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`style-switcher__btn${theme === t.id ? " is-active" : ""}`}
            onClick={() => setTheme(t.id)}
            aria-pressed={theme === t.id}
            title={t.hint}
          >
            <span className="style-switcher__name">{t.label}</span>
            <span className="style-switcher__hint">{t.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
