import type { Metadata } from "next";
import { Suspense } from "react";
import { SpravaClient } from "@/components/booking/SpravaClient";
import { PageHero } from "@/components/PageHero";
import { isSpravaAuthed } from "@/lib/booking/auth";

export const metadata: Metadata = {
  title: "Správa termínů",
  robots: { index: false, follow: false },
};

async function SpravaGate() {
  const authed = await isSpravaAuthed();
  return <SpravaClient initiallyAuthed={authed} />;
}

export default function SpravaPage() {
  return (
    <>
      <PageHero title="SPRÁVA" />
      <section className="section">
        <div className="wrap">
          <Suspense fallback={<p className="muted">Načítám správu…</p>}>
            <SpravaGate />
          </Suspense>
        </div>
      </section>
    </>
  );
}
