/** Texty z https://www.masaze-niedoba.cz/ — drobné pravopisné opravy */

export const site = {
  name: "Masáže Niedoba",
  tagline: "Masáže Niedoba Jablunkov a Třinec",
  email: "robertniedoba@seznam.cz",
  phone: "+420 739 184 325",
  phoneDisplay: "+420 739 184 325",
  phoneRaw: "739184325",
  address: "Bukovecká 81, 739 85 Jablunkov",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Bukoveck%C3%A1%2081%2C%20739%2085%20Jablunkov&hl=cs&z=15&output=embed",
  mapLinkUrl:
    "https://www.google.com/maps/search/?api=1&query=Bukoveck%C3%A1%2081%2C%20739%2085%20Jablunkov",
  ico: "63142678",
  businessNote:
    "Robert Niedoba IČ: 63142678. Podnikatel je zapsán do živnostenského rejstříku vydaným Městským úřadem Jablunkov dne 29. 3. 2017.",
  wish: "Přeji nám všem hodně práce bez stresu, spokojenost v životě, štěstí a zdraví. Život na Zemi bez vody není možný, ať déšť je znovu součástí koloběhu života, stejně jako den a noc.",
  heroTitle: "MASÁŽE – POHLAZENÍ TĚLA I DUŠE",
  heroTitleShort: "POHLAZENÍ TĚLA I DUŠE",
  heroLead:
    "Masáž je úžasný prostředek, jak uvolnit a oživit unavený organismus, zmírnit stres a předcházet bolestem. Pro obnovu a harmonii Vašich fyzických i duševních sil nabízím široké spektrum masáží.",
  openingHoursShort: "Po–Pá 8:00–18:00 · víkend zavřeno",
  openingHoursFull:
    "Po–Pá: 8:00 – 18:00. Víkend zavřeno. Mimo otevírací dobu po telefonické domluvě.",
  openingNote: "Pouze na objednání.",
  bookingTitle: "Domluvte si u mě masáž",
  aboutShort:
    "Nemám rád bolest. Spolu se pokusíme odstranit bolest vašeho těla.",
  aboutTitle: "O mně",
  aboutBody: [
    "Masérskou praxi jsem započal budovat v roce 2012. Postupem času se z vedlejší činnosti při zaměstnání stala práce na plný úvazek. Vše se začalo odvíjet již v roce 1996, kdy jsem absolvoval kurz u vynikající PaeDr. Ježkové v Ústí nad Labem, následoval kurz ájurvédy a základní kurz aromaterapie opět u výborného učitele pana Karla Hádka. Nicméně od tohoto okamžiku život sám ukázal jinou cestu, a to cestu instruktora fitness na krásných 10 let.",
    "Bylo to období sbírání zkušeností v oboru, kde člověk, pokud má vůli a píli, dokáže změnit svoji tělesnou schránku k nepoznání. V této době jsem absolvoval kurz instruktora fitness u odborníka na slovo vzatého, PaeDr. Tlapáka, jehož vzácné zkušenosti přenáším i do masérské praxe. Na tělo pohlížím jako na celek, kde všechno souvisí se vším. Specializuji se na pohybové ústrojí a bolesti v zádech. Mám radost z každého člověka, kterému mohu pomoci.",
  ],
  specialOffer:
    "Nabízím speciální cenově zvýhodněnou masáž 110 minut za 1500 Kč. Můžete si ji sestavit na míru ze všech služeb, které dělám.",
  servicesIntro:
    "Každou masáž přizpůsobuji vašim individuálním potřebám.",
  testimonial: {
    quote:
      "Pan Niedoba je opravdový profesionál, pomohl mi s letitými problémy se ztuhlým svalstvem a klouby, kde i odborníci si nevěděli rady. Všem vřele doporučuji.",
    author: "Mgr. Monika Vojtovič",
  },
} as const;

export const nav = [
  { href: "/", label: "Domů" },
  { href: "/sluzby", label: "Služby" },
  { href: "/o-mne", label: "O mně" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export { services, brands } from "@/content/services";

export const pricing = [
  { name: "Masáž 20 min.", price: "600,- Kč" },
  { name: "Masáž 50 min.", price: "1000,- Kč" },
  {
    name: "Masáž 90 min. Objednávky pouze telefonicky",
    price: "1500,- Kč",
  },
] as const;
