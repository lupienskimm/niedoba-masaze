import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Objednání",
};

export default function BookingPage() {
  return (
    <>
      <PageHero title="OBJEDNÁNÍ" />

      <section className="section">
        <div className="wrap wrap--narrow">
          <div className="content-center">
            <p className="section__lead section__lead--center">
              {site.bookingHint}
            </p>
            <p className="muted">{site.openingHoursFull}</p>

            <div className="contact-stack contact-stack--center">
              <a href={`tel:${site.phoneRaw}`} className="btn btn--primary">
                Zavolat {site.phoneDisplay}
              </a>
              <a href={`sms:${site.phoneRaw}`} className="btn btn--ghost">
                Poslat SMS
              </a>
              <a
                href={`mailto:${site.email}?subject=Objednávka%20masáže`}
                className="btn btn--ghost"
              >
                Napsat e-mail
              </a>
            </div>

            <div className="content-center__block">
              <p>
                <strong>Provozovna:</strong> {site.address}
              </p>
              <p className="muted">{site.openingNote}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
