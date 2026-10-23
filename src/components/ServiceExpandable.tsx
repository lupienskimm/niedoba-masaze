"use client";

import Image from "next/image";
import { useState } from "react";
import { services } from "@/content/site";

type Service = (typeof services)[number];

export function ServiceExpandable({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);

  return (
    <article id={service.id} className="service-card service-card--expand">
      <div className="service-card__img">
        <Image src={service.image} alt="" width={480} height={360} />
      </div>
      <h2 className="service-card__title">{service.title}</h2>
      <p className="service-card__text">{service.short}</p>
      <button
        type="button"
        className="btn btn--ghost service-card__more"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Skrýt popis" : "Více o službě"}
      </button>
      {open && (
        <div className="service-card__detail">
          {service.full.split("\n\n").map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>
      )}
    </article>
  );
}
