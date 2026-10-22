import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pricing, services, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Služby",
};

export default function ServicesPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero__media">
          <Image
            src="/images/header-sluzby.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="page-hero__shade" />
        <h1 className="page-hero__title">Služby</h1>
      </div>

      <section className="section">
        <div className="wrap">
          <p className="section__lead" style={{ marginBottom: 48 }}>
            {site.servicesIntro}
          </p>

          {services.map((s) => (
            <article key={s.id} id={s.id} className="service-detail">
              <div className="service-detail__img">
                <Image src={s.image} alt="" width={400} height={400} />
              </div>
              <div>
                <h2>{s.title}</h2>
                <p>{s.full}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <div className="section__head">
            <p className="section__eyebrow">Ceník</p>
            <h2 className="section__title">Ceník</h2>
          </div>
          <table className="price-table">
            <tbody>
              {pricing.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted" style={{ marginTop: 24 }}>
            {site.specialOffer}
          </p>
          <div style={{ marginTop: 32 }}>
            <Link href="/objednani" className="btn btn--primary">
              Domluvte si masáž
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
