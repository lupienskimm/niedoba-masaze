import Image from "next/image";
import Link from "next/link";
import { pricing, services, site } from "@/content/site";

const v2ServiceIds = [
  "hloubkova",
  "relaxace",
  "akupresura",
  "masaz-nohou",
] as const;

export default function HomePage() {
  const v2Services = services.filter((s) =>
    (v2ServiceIds as readonly string[]).includes(s.id),
  );

  return (
    <>
      <div className="home-v1">
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
      </div>

      <div className="home-v2">
        <section className="v2-hero">
          <div className="v2-hero__photo">
            <Image
              src="/images/omne.jpg"
              alt="Robert Niedoba"
              width={220}
              height={220}
              priority
            />
          </div>
          <p className="v2-hero__brand">{site.name}</p>
          <h1 className="v2-hero__title">{site.aboutShort}</h1>
          <p className="v2-hero__meta">{site.openingHoursShort}</p>
          <p className="v2-hero__note">{site.openingNote}</p>

          <div className="v2-hero__actions">
            <Link href="/objednani" className="btn btn--primary v2-hero__cta">
              Objednat masáž
            </Link>
            <a
              href={`tel:${site.phoneRaw}`}
              className="btn btn--ghost v2-hero__cta"
            >
              Zavolat {site.phoneDisplay}
            </a>
          </div>
        </section>

        <section className="v2-section">
          <div className="v2-section__inner">
            <h2 className="v2-section__title">Rychlý ceník</h2>
            <div className="v2-prices">
              {pricing.map((row) => (
                <div key={row.name} className="v2-price">
                  <p className="v2-price__name">{row.name}</p>
                  <p className="v2-price__value">{row.price}</p>
                </div>
              ))}
            </div>
            <p className="v2-section__note">{site.specialOffer}</p>
            <Link href="/objednani" className="btn btn--primary v2-section__cta">
              Rezervovat termín
            </Link>
          </div>
        </section>

        <section className="v2-section v2-section--alt">
          <div className="v2-section__inner">
            <h2 className="v2-section__title">Nejčastější služby</h2>
            <p className="v2-section__lead">{site.servicesIntro}</p>
            <div className="v2-services">
              {v2Services.map((s) => (
                <Link
                  key={s.id}
                  href={`/sluzby#${s.id}`}
                  className="v2-service"
                >
                  <span className="v2-service__img">
                    <Image src={s.image} alt="" width={120} height={90} />
                  </span>
                  <span className="v2-service__body">
                    <span className="v2-service__title">{s.title}</span>
                    <span className="v2-service__text">{s.short}</span>
                  </span>
                </Link>
              ))}
            </div>
            <Link href="/sluzby" className="v2-text-link">
              Všechny služby →
            </Link>
          </div>
        </section>

        <section className="v2-section">
          <div className="v2-section__inner v2-section__inner--narrow">
            <blockquote className="v2-quote">
              „{site.testimonial.quote}“
              <cite>– {site.testimonial.author}</cite>
            </blockquote>
            <div className="v2-contact">
              <p>
                <strong>{site.address}</strong>
              </p>
              <p>
                <a href={`tel:${site.phoneRaw}`}>{site.phoneDisplay}</a>
                {" · "}
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
              <div className="v2-contact__actions">
                <Link href="/objednani" className="btn btn--primary">
                  Objednat
                </Link>
                <Link href="/kontakt" className="btn btn--ghost">
                  Mapa a kontakt
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
