import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { privacy } from "@/content/privacy";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů",
  description:
    "Zásady ochrany osobních údajů – Masáže Niedoba (GDPR).",
};

export default function PrivacyPage() {
  const c = privacy.controller;

  return (
    <>
      <PageHero title="OCHRANA OSOBNÍCH ÚDAJŮ" />

      <section className="section">
        <div className="wrap legal">
          <p className="legal__meta">
            Platné od {privacy.effectiveFrom}.
          </p>
          <p>{privacy.intro}</p>

          <h2>1. Kdo vaše údaje zpracovává</h2>
          <p>Správcem osobních údajů je:</p>
          <div className="legal-table-wrap">
            <table className="legal-table">
              <tbody>
                <tr>
                  <th scope="row">Správce</th>
                  <td>{c.name}</td>
                </tr>
                <tr>
                  <th scope="row">IČO</th>
                  <td>{c.ico}</td>
                </tr>
                <tr>
                  <th scope="row">Sídlo</th>
                  <td>{c.seat}</td>
                </tr>
                <tr>
                  <th scope="row">E-mail</th>
                  <td>
                    <a href={`mailto:${c.email}`}>{c.email}</a>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Telefon</th>
                  <td>
                    <a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            S čímkoli, co se týká vašich osobních údajů, se obracejte na kontakty
            výše. Pověřence pro ochranu osobních údajů jsem nejmenoval, zákon mi
            to neukládá.
          </p>

          <h2>2. Jaké údaje zpracovávám</h2>
          <ul>
            {privacy.dataTypes.map((item) => (
              <li key={item.title}>
                <strong>{item.title}:</strong> {item.text}
              </li>
            ))}
          </ul>
          <p>
            Údaje získávám přímo od vás: z kontaktního nebo objednávkového
            formuláře, z e-mailu nebo telefonu.
          </p>

          <h2>3. Proč údaje zpracovávám a na jakém základě</h2>
          <div className="legal-table-wrap">
            <table className="legal-table legal-table--wide">
              <thead>
                <tr>
                  <th scope="col">Účel</th>
                  <th scope="col">Právní základ</th>
                  <th scope="col">Jak dlouho údaje uchovávám</th>
                </tr>
              </thead>
              <tbody>
                {privacy.purposes.map((row) => (
                  <tr key={row.purpose}>
                    <td>{row.purpose}</td>
                    <td>{row.basis}</td>
                    <td>{row.retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Obchodní sdělení můžete kdykoli zdarma odmítnout odkazem v každém
            e-mailu nebo zprávou na{" "}
            <a href={`mailto:${c.email}`}>{c.email}</a>. Souhlas s newsletterem
            můžete odvolat stejně snadno, jako jste ho dali. Odvolání nemá vliv
            na zpracování, které proběhlo před ním.
          </p>
          <p>
            Bez údajů potřebných k vyřízení objednávky nebo rezervace ji nemohu
            přijmout. Údaje pro obchodní sdělení a newsletter poskytovat
            nemusíte.
          </p>
          <p>
            Nedochází k automatizovanému rozhodování ani profilování podle čl. 22
            GDPR.
          </p>

          <h2>4. Komu údaje předávám</h2>
          <p>
            Vaše údaje neprodávám ani je nedávám nikomu dalšímu k jeho vlastním
            účelům. Předávám je jen těm, kteří mi pomáhají službu poskytnout, a
            jen v nezbytném rozsahu:
          </p>
          <div className="legal-table-wrap">
            <table className="legal-table">
              <thead>
                <tr>
                  <th scope="col">Příjemce</th>
                  <th scope="col">Proč</th>
                </tr>
              </thead>
              <tbody>
                {privacy.recipients.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Všichni zpracovatelé jsou vázáni smlouvou o zpracování osobních údajů
            a mlčenlivostí. Údaje mohu předat také státním orgánům, pokud mi to
            ukládá zákon.
          </p>
          <p>
            Údaje se zpracovávají v Evropské unii. Pokud některý ze zpracovatelů
            sídlí mimo EU, předávám údaje jen při zajištění ochrany podle GDPR,
            zejména na základě rozhodnutí Evropské komise o odpovídající ochraně
            (například EU-US Data Privacy Framework) nebo standardních smluvních
            doložek.
          </p>

          <h2>5. Vaše práva</h2>
          <p>Máte právo:</p>
          <ul>
            <li>
              <strong>na přístup</strong> ke svým údajům a na jejich kopii (čl.
              15 GDPR),
            </li>
            <li>
              <strong>na opravu</strong> nepřesných údajů (čl. 16 GDPR),
            </li>
            <li>
              <strong>na výmaz</strong> údajů, pokud už je nepotřebuji a žádný
              zákon mi neukládá je uchovávat (čl. 17 GDPR),
            </li>
            <li>
              <strong>na omezení zpracování</strong> (čl. 18 GDPR),
            </li>
            <li>
              <strong>na přenositelnost</strong> údajů, které jste mi poskytli
              (čl. 20 GDPR),
            </li>
            <li>
              <strong>vznést námitku</strong> proti zpracování na základě
              oprávněného zájmu, u obchodních sdělení kdykoli a bez udání důvodu
              (čl. 21 GDPR),
            </li>
            <li>
              <strong>odvolat souhlas,</strong> pokud zpracování na souhlasu
              stojí.
            </li>
          </ul>
          <p>
            Svá práva uplatníte e-mailem na{" "}
            <a href={`mailto:${c.email}`}>{c.email}</a> nebo dopisem na adresu
            sídla. Odpovím bez zbytečného odkladu, nejpozději do 1 měsíce. Abych
            údaje nevydal někomu jinému, mohu vás požádat o ověření totožnosti.
          </p>
          <p>
            Pokud se domníváte, že s vašimi údaji nakládám v rozporu s předpisy,
            můžete podat stížnost u Úřadu pro ochranu osobních údajů, Pplk.
            Sochora 27, 170 00 Praha 7,{" "}
            <a
              href="https://www.uoou.gov.cz"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.uoou.gov.cz
            </a>
            . Budu rád, když se nejdřív obrátíte na mě, většinu věcí vyřešíme
            rychle.
          </p>

          <h2>6. Jak údaje chráním</h2>
          <p>
            Údaje uchovávám v zabezpečených systémech chráněných heslem, s
            přístupem omezeným na osoby, které je potřebují k práci. Web
            komunikuje přes šifrované spojení (HTTPS). Papírové dokumenty
            uchovávám v uzamčených prostorách. Po uplynutí doby uchování údaje
            smažu nebo zničím.
          </p>

          <h2>7. Cookies</h2>
          <p>
            Informace o souborech cookies najdete v{" "}
            <Link href="/cookies">zásadách používání cookies</Link>.
          </p>

          <h2>8. Změny těchto zásad</h2>
          <p>
            Zásady mohu aktualizovat, například při změně předpisů nebo
            dodavatelů. Aktuální znění je vždy zveřejněné na těchto stránkách s
            datem platnosti nahoře. O podstatných změnách vás informuji e-mailem,
            pokud s vámi komunikuji.
          </p>
        </div>
      </section>
    </>
  );
}
