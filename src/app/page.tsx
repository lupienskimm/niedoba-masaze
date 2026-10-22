import Image from "next/image";
import Link from "next/link";
import { pricing, services, site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero__media">
          <Image
            src="/images/hero-massage.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero__shade" />
        <div className="hero__content">
          <p className="hero__brand reveal">{site.name}</p>
          <h1 className="hero__title reveal reveal-delay">{site.heroTitle}</h1>
          <p className="hero__lead reveal reveal-delay-2">{site.heroLead}</p>
          <div className="hero__actions reveal reveal-delay-2">
            <Link href="/objednani" className="btn btn--primary">
              Objednat
            </Link>
            <Link
              href="/sluzby"
              className="btn btn--ghost"
              style={{ color: "#fff", borderColor: "rgba(255,255,255,0.55)" }}
            >
              Služby
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="band">
            <p>
              <strong>{site.openingHoursShort}</strong>
            </p>
            <p className="muted">{site.bookingHint}</p>
            <Link href="/objednani" className="btn btn--primary">
              Domluvte si u mě masáž
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <div className="section__head section__head--center">
            <h2 className="section__title section__title--gradient">SLUŽBY</h2>
            <p className="section__lead">{site.servicesIntro}</p>
          </div>
          <div className="services-grid services-grid--equal">
            {services.map((s) => (
              <Link
                key={s.id}
                href={`/sluzby#${s.id}`}
                className="service-card"
              >
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
        <div className="wrap split split--about">
          <div className="split__media split__media--circle">
            <Image
              src="/images/omne.jpg"
              alt="Robert Niedoba"
              width={480}
              height={480}
            />
          </div>
          <div>
            <p className="section__eyebrow">O mně</p>
            <h2 className="section__title">{site.aboutShort}</h2>
            <Link href="/o-mne" className="btn btn--primary">
              Více o mně
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <div className="content-center">
            <div className="section__head section__head--center">
              <h2 className="section__title section__title--gradient">CENÍK</h2>
              <p className="section__lead section__lead--center">
                {site.servicesIntro}
              </p>
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
          </div>
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
