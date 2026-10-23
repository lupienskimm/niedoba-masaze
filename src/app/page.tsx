import Image from "next/image";
import Link from "next/link";
import { HomeShell } from "@/components/HomeShell";
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
            <Link key={s.id} href={`/sluzby/${s.id}`} className="v2-service">
              <span className="v2-service__img">
                <Image
                  src={s.image}
                  alt=""
                  width={120}
                  height={90}
                  sizes="120px"
                />
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

function PhotoIntro({
  title,
  showHeroCtas = false,
}: {
  title: string;
  showHeroCtas?: boolean;
}) {
  return (
    <section className="v2-hero">
      <div className="v2-hero__photo">
        <Image
          src="/images/omne.jpg"
          alt="Robert Niedoba"
          width={220}
          height={220}
          priority
          sizes="168px"
        />
      </div>
      <p className="v2-hero__brand">{site.name}</p>
      <h1 className="v2-hero__title">{title}</h1>
      <p className="v2-hero__meta">{site.openingHoursShort}</p>
      <p className="v2-hero__note">{site.openingNote}</p>
      <div
        className="v2-hero__actions"
        {...(showHeroCtas ? { "data-hero-ctas": true } : {})}
      >
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
  );
}

function DesktopHome() {
  return (
    <div className="home-v1">
      <section className="hero-v1">
        <div className="hero-v1__grid">
          <div className="hero-v1__photo reveal">
            <Image
              src="/images/omne.jpg"
              alt="Robert Niedoba"
              width={640}
              height={800}
              priority
              sizes="(max-width: 1100px) 42vw, 420px"
            />
          </div>
          <div className="hero-v1__copy reveal reveal-delay">
            <p className="hero-v1__card">{site.aboutShort}</p>
            <div className="hero-v1__stack">
              <h1 className="hero-v1__title">
                <span className="hero-v1__title-line hero-v1__title-line--left">
                  POHLAZENÍ
                </span>
                <span className="hero-v1__title-line hero-v1__title-line--right">
                  TĚLA I DUŠE
                </span>
              </h1>
              <p className="hero-v1__lead">{site.heroLead}</p>
              <div className="hero-v1__actions">
                <Link href="/objednani" className="btn btn--primary">
                  Objednat
                </Link>
                <Link href="/sluzby" className="btn btn--ghost">
                  Služby
                </Link>
              </div>
            </div>
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
            {services.map((s, i) => (
              <Link key={s.id} href={`/sluzby/${s.id}`} className="service-card">
                <div className="service-card__img">
                  <Image
                    src={s.image}
                    alt=""
                    width={400}
                    height={300}
                    sizes="(max-width: 960px) 45vw, 22vw"
                    loading={i < 2 ? "eager" : "lazy"}
                  />
                </div>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__text">{s.short}</p>
              </Link>
            ))}
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

      <section className="section section--alt">
        <div className="wrap split split--about">
          <div className="split__media split__media--circle">
            <Image
              src="/images/omne.jpg"
              alt="Robert Niedoba"
              width={480}
              height={480}
              sizes="(max-width: 860px) 70vw, 320px"
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
    </div>
  );
}

export default function HomePage() {
  return (
    <HomeShell
      mobile={
        <>
          <PhotoIntro title={site.aboutShort} showHeroCtas />
          <QuickPricing />
          <FeaturedServices />
          <BookingCloser />
        </>
      }
      desktop={<DesktopHome />}
    />
  );
}
