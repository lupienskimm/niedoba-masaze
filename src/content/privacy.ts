/** Zásady ochrany osobních údajů — text z podkladu, placeholdery doplněny podle provozu webu. */

export const privacy = {
  title: "Zásady ochrany osobních údajů",
  effectiveFrom: "24. 10. 2026",
  intro:
    "Tady se dozvíte, jaké osobní údaje o vás zpracovávám, proč, jak dlouho je uchovávám a jaká máte práva. Řídím se nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR) a zákonem č. 110/2019 Sb., o zpracování osobních údajů.",
  controller: {
    name: "Robert Niedoba",
    ico: "63142678",
    seat: "Bukovec 57, 739 85 Bukovec",
    email: "robertniedoba@seznam.cz",
    phone: "+420 739 184 325",
  },
  dataTypes: [
    {
      title: "Identifikační a kontaktní údaje",
      text: "jméno a příjmení, e-mail, telefon, adresa, u podnikatelů také IČO a DIČ.",
    },
    {
      title: "Údaje o objednávce nebo rezervaci",
      text: "co jste si objednali nebo rezervovali, termín, cena, způsob platby a údaje o zaplacení.",
    },
    {
      title: "Obsah komunikace",
      text: "poptávky z kontaktního formuláře, e-maily a zprávy, které si vyměníme.",
    },
    {
      title: "Datum narození",
      text: "jen pokud je ho k poskytnutí služby opravdu potřeba.",
    },
  ],
  purposes: [
    {
      purpose: "Odpověď na poptávku z formuláře nebo e-mailu",
      basis:
        "jednání o smlouvě na vaši žádost, čl. 6 odst. 1 písm. b) GDPR",
      retention:
        "1 rok od poslední komunikace, pokud z poptávky nevznikne objednávka",
    },
    {
      purpose: "Vyřízení objednávky nebo rezervace a komunikace s vámi",
      basis: "plnění smlouvy, čl. 6 odst. 1 písm. b) GDPR",
      retention: "po dobu trvání smlouvy a 4 roky po jejím skončení",
    },
    {
      purpose: "Vystavení faktur a vedení daňové evidence",
      basis: "plnění právní povinnosti, čl. 6 odst. 1 písm. c) GDPR",
      retention:
        "po dobu, kterou stanoví daňové a účetní předpisy, nejdéle 10 let",
    },
    {
      purpose:
        "Obchodní sdělení e-mailem zákazníkům, kteří si u mě už něco objednali, jen o podobných službách",
      basis:
        "oprávněný zájem, čl. 6 odst. 1 písm. f) GDPR, a § 7 odst. 3 zákona č. 480/2004 Sb.",
      retention:
        "dokud neodmítnete, nejdéle 2 roky od poslední objednávky",
    },
    {
      purpose: "Newsletter lidem, kteří u mě zatím nic neobjednali",
      basis: "souhlas, čl. 6 odst. 1 písm. a) GDPR",
      retention: "dokud souhlas neodvoláte",
    },
    {
      purpose: "Obrana mých práv, například při sporu o zaplacení",
      basis: "oprávněný zájem, čl. 6 odst. 1 písm. f) GDPR",
      retention: "po dobu promlčecí lhůty a trvání případného sporu",
    },
  ],
  recipients: [
    {
      name: "Vercel Inc. (hosting webu)",
      why: "provoz webových stránek, zabezpečené úložiště dat online rezervací",
    },
    {
      name: "Seznam.cz",
      why: "e-mailová schránka robertniedoba@seznam.cz",
    },
    {
      name: "Online rezervační systém na těchto stránkách",
      why: "přijetí a správa rezervací termínů",
    },
    {
      name: "Účetní nebo daňový poradce",
      why: "vedení účetnictví a daňové evidence, pokud je využíván",
    },
  ],
} as const;
