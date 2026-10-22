import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "O mně",
};

export default function AboutPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero__media">
          <Image
            src="/images/hlavicka-ome-2.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="page-hero__shade" />
        <h1 className="page-hero__title">{site.aboutTitle}</h1>
      </div>

      <section className="section">
        <div className="wrap split">
          <div className="split__media">
            <Image src="/images/omne.jpg" alt="" width={720} height={900} />
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
          <p className="section__eyebrow">Speciální nabídka</p>
          <h2 className="section__title" style={{ maxWidth: "28ch" }}>
            {site.specialOffer}
          </h2>
          <Link href="/objednani" className="btn btn--primary">
            Domluvte si masáž
          </Link>
        </div>
      </section>
    </>
  );
}
