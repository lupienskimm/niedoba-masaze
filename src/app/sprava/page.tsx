import type { Metadata } from "next";
import { SpravaClient } from "@/components/booking/SpravaClient";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Správa termínů",
  robots: { index: false, follow: false },
};

export default function SpravaPage() {
  return (
    <>
      <PageHero title="SPRÁVA" />
      <section className="section">
        <div className="wrap">
          <SpravaClient />
        </div>
      </section>
    </>
  );
}
