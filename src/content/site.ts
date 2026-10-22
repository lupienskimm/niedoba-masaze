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
  heroLead:
    "Masáž je úžasný prostředek, jak uvolnit a oživit unavený organismus, zmírnit stres a předcházet bolestem. Pro obnovu a harmonii Vašich fyzických i duševních sil nabízím široké spektrum masáží.",
  openingHoursShort: "Otevřeno Po–Pá 8.00–18.00",
  openingHoursFull:
    "Po–Ne: 8:00 – 18:00. Mimo otevírací dobu po telefonické domluvě.",
  openingNote: "Pouze na objednání.",
  bookingHint:
    "Pokud se chcete u mě objednat, napište SMS nebo e-mail. Tel: 739 184 325",
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
  { href: "/objednani", label: "Objednání" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const services = [
  {
    id: "obnova-tela",
    title: "Obnova těla",
    image: "/images/svc-obnova.jpg",
    short:
      "Diagnostika těla, např. objevení slabých svalů, bolestivých míst, degenerace chrupavek apod.",
    full: "Diagnostika těla, např. objevení slabých svalů, bolestivých míst, degenerace chrupavek apod. Pojmenování příčin vzniku bloků na jednotlivých částech těla. Doporučení, jak se v budoucnu vyhnout zdravotním problémům a předcházet tak bolestem. Obnova těla zahrnuje rozmasírování diagnostikovaných partií.",
  },
  {
    id: "relaxace",
    title: "Relaxace",
    image: "/images/service-relaxace.jpg",
    short:
      "Relaxační povrchová uvolňovací masáž s hudbou a vonnými oleji. Cílem této masáže je uvolnění těla i mysli, zbavit se stresu všedních dnů.",
    full: "Relaxační povrchová uvolňovací masáž s hudbou a vonnými oleji. Cílem této masáže je uvolnění těla i mysli, zbavit se stresu všedních dnů.",
  },
  {
    id: "akupresura",
    title: "Akupresura",
    image: "/images/svc-akupresura.jpg",
    short:
      "Známá akupresurní metoda, která působením tlaku na dané body odblokuje problémy jak s pohybovým ústrojím, tak s vnitřními orgány.",
    full: "Známá akupresurní metoda, která působením tlaku na dané body odblokuje problémy jak s pohybovým ústrojím, tak s vnitřními orgány.",
  },
  {
    id: "hloubkova",
    title: "Hloubková masáž",
    image: "/images/svc-hloubkova.jpg",
    short:
      "Jedná se o masáž do hlubších vrstev svalových vláken s efektivním výsledkem masáže.",
    full: "Jedná se o masáž do hlubších vrstev svalových vláken s efektivním výsledkem masáže.",
  },
  {
    id: "lavove-kameny",
    title: "Lávové kameny",
    image: "/images/service-kameny.jpg",
    short:
      "Nahřáté lávové kameny uvolní svalové partie na celém těle. Mají pozitivní vliv na centrální nervový systém.",
    full: "Nahřáté lávové kameny uvolní svalové partie na celém těle. Mají pozitivní vliv na centrální nervový systém.",
  },
  {
    id: "autotrakcni-lehatko",
    title: "Autotrakční lehátko",
    image: "/images/lehatko.jpg",
    short:
      "Překlápěcí a velmi populární nástroj k obnově meziobratlových plotének.",
    full: "Překlápěcí a velmi populární nástroj k obnově meziobratlových plotének. Překlápěním pacienta postupně v různých úhlech (s fixací nohou) dochází k celkovému uvolnění páteře díky změně polohy těla.",
  },
  {
    id: "sport",
    title: "Sport",
    image: "/images/service-sport.jpg",
    short:
      "Pro aktivní sportovce na rychlé uvolnění spasmu a odvod kyseliny mléčné ze svalů, jde hlavně o techniku tepání a chvění.",
    full: "Pro aktivní sportovce na rychlé uvolnění spasmu a odvod kyseliny mléčné ze svalů, jde hlavně o techniku tepání a chvění.",
  },
  {
    id: "masaz-nohou",
    title: "Masáž nohou",
    image: "/images/svc-nohy.jpg",
    short:
      "Zlepšuje akutní i chronické stavy a je účinnou prevencí mnohých onemocnění.",
    full: "Lymfatická masáž je detoxikační masáž, která podporuje pohyb lymfy v těle.\n\nTím napomáhá nejen jejímu čištění od toxických látek, ale i zvýšení imunity nebo odstraňování celulitidy (pomerančová kůže). Velký vliv má i na psychiku – zlepšuje náladu a předchází depresi. Lymfa sama o sobě nemá žádnou „pumpu“ jako má krev. Je tedy závislá na pohybu svalů. Proto je hned po sportu a cvičení masáž ideálním pomocníkem.",
  },
] as const;

export const pricing = [
  { name: "Masáž 20 min.", price: "600,- Kč" },
  { name: "Masáž 50 min.", price: "1000,- Kč" },
  {
    name: "Masáž 90 min. Objednávky pouze telefonicky",
    price: "1500,- Kč",
  },
] as const;
