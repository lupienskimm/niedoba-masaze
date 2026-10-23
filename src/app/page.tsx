import Image from "next/image";
import Link from "next/link";
import { pricing, services, site } from "@/content/site";

const featuredIds = [
  "hloubkova",
  "relaxace",
  "akupresura",
  "masaz-nohou",
] as const;

function FeaturedServices() {
  const list = services.filter((s) =>
    (featuredIds as readonly string[]).includes(s.id),
  );
  return (
    <section className="v2-section v2-section--alt">
      <div className="v2-section__inner">
        <h2 className="v2-section__title">Nejčastější služby</h2>
        <p className="v2-section__lead">{site.servicesIntro}</p>
        <div className="v2-services">
          {list.map((s) => (
            <Link key={s.id} href={`/sluzby#${s.id}`} className="v2-service">
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
  );
}

function QuickPricing({ cta = "Rezervovat termín" }: { cta?: string }) {
  return (
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
          {cta}
        </Link>
      </div>
    </section>
  );
}

function BookingCloser() {
  return (
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
  );
}

function PhotoIntro({ showHeroCtas = false }: { showHeroCtas?: boolean }) {
  return (
    <section className="v2-hero">
      <div className="v2-hero__media">
        <Image
          src="/images/hero-massage.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="v2-hero__glass">
        <div className="v2-hero__split">
          <div className="v2-hero__person">
            <div className="v2-hero__photo">
              <Image
                src="/images/omne.jpg"
                alt="Robert Niedoba"
                width={220}
                height={220}
                priority
              />
            </div>
            <p className="v2-hero__caption">{site.aboutShort}</p>
          </div>
          <div className="v2-hero__copy">
            <p className="v2-hero__lead">{site.heroLead}</p>
            <div
              className="v2-hero__actions"
              {...(showHeroCtas ? { "data-hero-ctas": true } : {})}
            >
              <Link href="/objednani" className="btn btn--primary v2-hero__cta">
                Objednat
              </Link>
              <Link href="/sluzby" className="btn btn--ghost v2-hero__cta">
                Služby
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Mobile only — always V2-style */}
      <div className="home-mobile">
        <PhotoIntro showHeroCtas />
        <QuickPricing />
        <FeaturedServices />
        <BookingCloser />
      </div>

      {/* Desktop V1 — plný web */}
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

      {/* Desktop V3 — kombinace V1 hero + V4 foto */}
      <div className="home-v3">
        <section className="hero hero--v3">
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
          <div className="hero__content hero__content--center">
            <p className="hero__brand">{site.name}</p>
            <h1 className="hero__title hero__title--xl">{site.heroTitle}</h1>
            <p className="hero__lead">{site.aboutShort}</p>
            <div className="hero__actions">
              <Link href="/objednani" className="btn btn--primary">
                Objednat masáž
              </Link>
              <a
                href={`tel:${site.phoneRaw}`}
                className="btn btn--ghost"
                style={{ color: "#fff", borderColor: "rgba(255,255,255,0.55)" }}
              >
                Zavolat
              </a>
            </div>
            <p className="hero__hours">{site.openingHoursShort}</p>
          </div>
        </section>

        <section className="v4-intro">
          <div className="v4-intro__photo">
            <Image
              src="/images/omne.jpg"
              alt="Robert Niedoba"
              width={360}
              height={360}
            />
          </div>
          <div className="v4-intro__copy">
            <p className="v2-hero__brand">O mně</p>
            <h2 className="v4-intro__title">{site.aboutShort}</h2>
            <p className="v4-intro__lead">{site.heroLead}</p>
            <Link href="/o-mne" className="btn btn--primary">
              Více o mně
            </Link>
          </div>
        </section>

        <QuickPricing cta="Domluvte si u mě masáž" />
        <FeaturedServices />
        <BookingCloser />
      </div>

      {/* Desktop V4 — stejný design jako V3, pořadí jako mobil */}
      <div className="home-v4">
        <PhotoIntro />
        <section className="v4-atmosphere">
          <div className="v4-atmosphere__media">
            <Image
              src="/images/hero-massage.jpg"
              alt=""
              fill
              sizes="100vw"
            />
            <div className="v4-atmosphere__shade" />
            <p className="v4-atmosphere__text">{site.aboutShort}</p>
          </div>
        </section>
        <QuickPricing />
        <FeaturedServices />
        <BookingCloser />
      </div>
    </>
  );
}
