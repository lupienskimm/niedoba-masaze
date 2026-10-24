import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Zásady používání cookies – Masáže Niedoba.",
};

export default function CookiesPage() {
  return (
    <>
      <PageHero title="COOKIES" />

      <section className="section">
        <div className="wrap legal">
          <p className="legal__meta">Platné od 24. 10. 2026.</p>

          <p>
            Tyto stránky používají jen technicky nezbytné soubory cookies a
            podobné technologie, bez kterých by web a online rezervace
            nefungovaly spolehlivě (například zajištění zabezpečeného spojení a
            základní funkce kalendáře rezervací).
          </p>

          <p>
            Nepoužívám cookies pro marketingové sledování ani pro zobrazování
            reklam třetích stran. Analytické nebo marketingové cookies
            nenasazuji.
          </p>

          <p>
            Cookies můžete ve svém prohlížeči omezit nebo smazat. Pokud zablokujete
            i nezbytné cookies, některé části webu nemusí fungovat správně.
          </p>

          <p>
            Další informace o zpracování osobních údajů najdete v{" "}
            <Link href="/ochrana-udaju">zásadách ochrany osobních údajů</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
