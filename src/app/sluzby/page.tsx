import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
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
              <article key={s.id} id={s.id} className="service-card">
                <div className="service-card__img">
                  <Image src={s.image} alt="" width={480} height={360} />
                </div>
                <h2 className="service-card__title">{s.title}</h2>
                <p className="service-card__text">{s.full}</p>
              </article>
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
            <p className="muted content-center__note">{site.specialOffer}</p>
            <Link href="/objednani" className="btn btn--primary">
              Domluvte si masáž
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
