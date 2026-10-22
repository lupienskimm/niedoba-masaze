import Image from "next/image";
import Link from "next/link";
import { pricing, services, site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero__media">
          <Image
            src="/images/slide1-1.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero__shade" />
        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            DRIFT AWAY · MASÁŽE NIEDOBA · POHLAZENÍ TĚLA I DUŠE ·&nbsp;
            DRIFT AWAY · MASÁŽE NIEDOBA · POHLAZENÍ TĚLA I DUŠE ·&nbsp;
          </div>
        </div>
        <div className="hero__content">
          <p className="hero__brand reveal">{site.name}</p>
          <h1 className="hero__title reveal reveal-delay">{site.heroTitle}</h1>
          <p className="hero__lead reveal reveal-delay-2">{site.heroLead}</p>
          <div className="hero__actions reveal reveal-delay-2">
            <Link href="/objednani" className="btn btn--primary">
              Objednat
            </Link>
            <Link href="/sluzby" className="btn btn--ghost" style={{ color: "#fff", borderColor: "#fff" }}>
              Služby
            </Link>
          </div>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true">
          <path
            fill="currentColor"
            d="M0,32 C240,48 480,0 720,16 C960,32 1200,48 1440,24 L1440,48 L0,48 Z"
          />
        </svg>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="band">
            <p>
              <strong>{site.openingHoursShort}</strong>
            </p>
            <p className="muted">{site.bookingHint}</p>
            <Link href="/objednani" className="btn btn--primary">
              Domluvte si masáž
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <div className="section__head">
            <p className="section__eyebrow">Služby</p>
            <h2 className="section__title">Široké spektrum masáží</h2>
            <p className="section__lead">{site.servicesIntro}</p>
          </div>
          <div className="services-grid">
            {services.map((s) => (
              <Link key={s.id} href={`/sluzby#${s.id}`} className="service-card">
                <div className="service-card__img">
                  <Image src={s.image} alt="" width={480} height={360} />
                </div>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__text">{s.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div className="split__media">
            <Image
              src="/images/omne-home.jpg"
              alt=""
              width={720}
              height={900}
            />
          </div>
          <div>
            <p className="section__eyebrow">O mně</p>
            <h2 className="section__title">{site.aboutShort}</h2>
            <p className="section__lead" style={{ marginBottom: 24 }}>
              {site.aboutBody[0]}
            </p>
            <Link href="/o-mne" className="btn btn--primary">
              Více o mně
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <div className="section__head">
            <p className="section__eyebrow">Ceník</p>
            <h2 className="section__title">Služby a ceník</h2>
            <p className="section__lead">{site.servicesIntro}</p>
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
          <p className="muted" style={{ marginTop: 24, maxWidth: "48ch" }}>
            {site.specialOffer}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <blockquote className="quote">
            „{site.testimonial.quote}“
            <cite>– {site.testimonial.author}</cite>
          </blockquote>
          <div className="band" style={{ marginTop: 48 }}>
            <div>
              <p className="section__eyebrow">Kontakt</p>
              <p>
                <strong>{site.address}</strong>
              </p>
              <p>
                <a href={`tel:${site.phoneRaw}`}>{site.phoneDisplay}</a>
                {" · "}
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            </div>
            <Link href="/kontakt" className="btn btn--ghost">
              Kontakt
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
