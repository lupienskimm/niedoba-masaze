import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { services } from "@/content/services";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return services.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = services.find((s) => s.id === id);
  if (!service) return { title: "Služba" };
  return {
    title: service.title,
    description: service.short,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const service = services.find((s) => s.id === id);
  if (!service) notFound();

  const paragraphs = service.full.split("\n\n").filter(Boolean);

  return (
    <>
      <PageHero title={service.title.toUpperCase()} />

      <section className="section">
        <div className="wrap service-detail">
          <div className="service-detail__media">
            <Image
              src={service.image}
              alt={service.title}
              width={720}
              height={540}
              priority
              sizes="(max-width: 860px) 100vw, 48vw"
            />
          </div>
          <div className="service-detail__body prose">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
            <div className="service-detail__actions">
              <Link href="/objednani" className="btn btn--primary">
                Objednat termín
              </Link>
              <Link href="/sluzby" className="btn btn--ghost">
                Všechny služby
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
