import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "O mně",
};

export default function AboutPage() {
  return (
    <>
      <PageHero title="O MNĚ" />

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
          <div className="prose">
            {site.aboutBody.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p>
              <strong>{site.aboutShort}</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <div className="about-stats">
            <div className="about-stat">
              <p className="about-stat__value">1148</p>
              <p className="about-stat__label">Spokojených klientů</p>
            </div>
            <div className="about-stat">
              <p className="about-stat__value">8</p>
              <p className="about-stat__label">typů masáží a služeb</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap wrap--narrow">
          <div className="content-center">
            <Link href="/objednani" className="btn btn--primary">
              Domluvte si u mě masáž
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
