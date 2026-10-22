import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Kontakt",
};

export default function ContactPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero__media">
          <Image
            src="/images/header-contact-light.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="page-hero__shade" />
        <h1 className="page-hero__title">Kontakt</h1>
      </div>

      <section className="section">
        <div className="wrap" style={{ display: "grid", gap: 48, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div>
            <p className="section__eyebrow">Otevírací doba</p>
            <h2 className="section__title" style={{ fontSize: "1.5rem" }}>
              {site.openingHoursFull}
            </h2>
            <p className="muted">{site.openingNote}</p>
          </div>
          <div className="contact-stack">
            <p className="section__eyebrow">Kontakt</p>
            <p>{site.businessNote}</p>
            <p>
              <strong>Provozovna:</strong> {site.address}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p>
              <strong>Telefon:</strong>{" "}
              <a href={`tel:${site.phoneRaw}`}>{site.phoneDisplay}</a>
            </p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <p className="section__lead">{site.wish}</p>
          <div style={{ marginTop: 24 }}>
            <iframe
              title="Mapa – Bukovecká 81, Jablunkov"
              src="https://maps.google.com/maps?q=Bukoveck%C3%A1%2081%2C%20739%2085%20Jablunkov&t=&z=15&ie=UTF8&iwloc=&output=embed"
              style={{
                border: 0,
                width: "100%",
                height: 360,
                filter: "grayscale(0.2)",
              }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
