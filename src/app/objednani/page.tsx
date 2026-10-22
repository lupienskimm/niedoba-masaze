import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Objednání",
};

export default function BookingPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero__media">
          <Image
            src="/images/header-objednavka-1.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="page-hero__shade" />
        <h1 className="page-hero__title">{site.bookingTitle}</h1>
      </div>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <p className="section__lead">{site.bookingHint}</p>
          <p className="muted" style={{ marginTop: 16 }}>
            {site.openingHoursFull}
          </p>

          <div
            className="contact-stack"
            style={{ marginTop: 40, gap: 16 }}
          >
            <a href={`tel:${site.phoneRaw}`} className="btn btn--primary">
              Zavolat {site.phoneDisplay}
            </a>
            <a
              href={`sms:${site.phoneRaw}`}
              className="btn btn--ghost"
            >
              Poslat SMS
            </a>
            <a
              href={`mailto:${site.email}?subject=Objednávka%20masáže`}
              className="btn btn--ghost"
            >
              Napsat e-mail
            </a>
          </div>

          <div style={{ marginTop: 48 }}>
            <p>
              <strong>Provozovna:</strong> {site.address}
            </p>
            <p className="muted" style={{ marginTop: 8 }}>
              {site.openingNote}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
