import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SiteMap } from "@/components/SiteMap";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Kontakt",
};

export default function ContactPage() {
  return (
    <>
      <PageHero title="KONTAKT" />

      <section className="section">
        <div className="wrap contact-layout">
          <div className="contact-layout__info">
            <div>
              <p className="section__eyebrow">Otevírací doba</p>
              <h2 className="section__title" style={{ fontSize: "1.5rem" }}>
                {site.openingHoursFull}
              </h2>
              <p className="muted">{site.openingNote}</p>
            </div>
            <div className="contact-stack">
              <p className="section__eyebrow">Kontakt</p>
              <p>
                <strong>Provozovna:</strong> {site.address}
              </p>
              <p>
                <strong>E-mail:</strong>{" "}
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
              <p>
                <strong>Telefon:</strong>{" "}
                <a href={`tel:${site.phoneRaw}`}>{site.phoneDisplay}</a>
              </p>
            </div>
          </div>

          <SiteMap size="large" />
        </div>
      </section>

    </>
  );
}
