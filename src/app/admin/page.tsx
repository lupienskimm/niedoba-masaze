import type { Metadata } from "next";
import { SpravaClient } from "@/components/booking/SpravaClient";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Admin – správa termínů",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <>
      <PageHero title="ADMIN" />
      <section className="section">
        <div className="wrap">
          <SpravaClient />
        </div>
      </section>
    </>
  );
}
