import Image from "next/image";
import Link from "next/link";
import { services } from "@/content/site";

type Service = (typeof services)[number];

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/sluzby/${service.id}`} className="service-card">
      <div className="service-card__img">
        <Image src={service.image} alt="" width={480} height={360} />
      </div>
      <h2 className="service-card__title">{service.title}</h2>
      <p className="service-card__text">{service.short}</p>
    </Link>
  );
}
