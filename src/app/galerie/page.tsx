import type { Metadata } from "next";
import Image from "next/image";
import { galleryImages } from "@/content/site";

export const metadata: Metadata = {
  title: "Galerie",
};

export default function GalleryPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero__media">
          <Image
            src="/images/header-galerie.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="page-hero__shade" />
        <h1 className="page-hero__title">Galerie</h1>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="gallery-grid">
            {galleryImages.map((img) => (
              <div key={img.src} className="gallery-grid__item">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={600}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
