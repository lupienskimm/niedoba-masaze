import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingWizard } from "@/components/booking/BookingWizard";
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
        <div className="wrap">
          <div className="booking-intro">
            <p className="section__lead section__lead--center">
              Vyberte volný den v kalendáři, čas a vyplňte formulář. Potvrzení
              přijde vám i panu Niedobovi e-mailem.
            </p>
            <p className="muted content-center">{site.openingHoursFull}</p>
          </div>

          <Suspense fallback={<p className="muted content-center">Načítám kalendář…</p>}>
            <BookingWizard />
          </Suspense>

          <div className="booking-alt">
            <p className="muted">
              Preferujete telefon?{" "}
              <a href={`tel:${site.phoneRaw}`}>{site.phoneDisplay}</a>
              {" · "}
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p className="muted">
              <strong>Provozovna:</strong> {site.address} · {site.openingNote}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
