import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ServiceCard } from "@/components/ServiceCard";
import { pricing, services, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Služby",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero title="SLUŽBY" />

      <section className="section">
        <div className="wrap">
          <div className="content-center" style={{ marginBottom: "2rem" }}>
            <p className="section__lead section__lead--center">
              {site.servicesIntro}
            </p>
          </div>

          <div className="services-grid services-grid--equal">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <div className="content-center">
            <div className="section__head section__head--center">
              <h2 className="section__title section__title--gradient">CENÍK</h2>
            </div>
            <div className="price-cards">
              {pricing.map((row) => (
                <div key={row.name} className="price-card">
                  <p className="price-card__name">{row.name}</p>
                  <p className="price-card__price">{row.price}</p>
                </div>
              ))}
            </div>
            <Link href="/objednani" className="btn btn--primary">
              Domluvte si u mě masáž
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
