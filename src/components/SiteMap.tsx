"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

type SiteMapProps = {
  size?: "large" | "mini";
};

export function SiteMap({ size = "large" }: SiteMapProps) {
  const isMini = size === "mini";
  const ref = useRef<HTMLDivElement>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowMap(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`site-map${isMini ? " site-map--mini" : " site-map--large"}`}
    >
      <div className="site-map__frame">
        <div className="site-map__viewport">
          {showMap ? (
            <iframe
              title={`Mapa – ${site.address}`}
              src={site.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="site-map__placeholder" aria-hidden />
          )}
        </div>

        {!isMini && (
          <div className="site-map__card">
            <p className="site-map__card-label">Provozovna</p>
            <p className="site-map__card-address">{site.address}</p>
            <a
              href={site.mapLinkUrl}
              className="btn btn--primary site-map__card-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Otevřít v Mapách
            </a>
          </div>
        )}

        {isMini && (
          <a
            href={site.mapLinkUrl}
            className="site-map__mini-hit"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Otevřít mapu: ${site.address}`}
          />
        )}
      </div>
    </div>
  );
}
