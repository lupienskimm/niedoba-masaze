import { hourBlockLabel } from "@/lib/booking/calendar";
import type { Booking } from "@/lib/booking/types";
import { site } from "@/content/site";

const DAY_NAMES = [
  "neděle",
  "pondělí",
  "úterý",
  "středa",
  "čtvrtek",
  "pátek",
  "sobota",
];

export function formatDateCs(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const dayName = DAY_NAMES[dt.getDay()];
  return `${dayName} ${d}. ${m}. ${y}`;
}

export function casOdDo(booking: Booking) {
  const hours = Math.max(1, booking.durationHours ?? 1);
  return hourBlockLabel(booking.time, hours);
}

function spolecnaPaticka() {
  return [
    ``,
    `Provozovna: ${site.address}`,
    `Telefon: ${site.phoneDisplay}`,
    ``,
    `Stačí odpovědět na tento e-mail, ozveme se vám.`,
  ].join("\n");
}

function spolecnaPatickaHtml() {
  return `
<p style="margin-top:24px;color:#3d5346;font-size:14px;line-height:1.5">
  Provozovna: ${site.address}<br/>
  Telefon: <a href="tel:${site.phoneRaw}">${site.phoneDisplay}</a>
</p>
<p style="color:#5c6e63;font-size:13px">Stačí odpovědět na tento e-mail, ozveme se vám.</p>`;
}

function udajeRezervace(booking: Booking) {
  return [
    `Jméno: ${booking.name}`,
    `Datum: ${formatDateCs(booking.date)} (${booking.date})`,
    `Čas: ${casOdDo(booking)}`,
    booking.service ? `Služba: ${booking.service}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function udajeRezervaceHtml(booking: Booking) {
  return `
<ul style="padding-left:18px;line-height:1.6;color:#1e3a2b">
  <li><strong>Jméno:</strong> ${booking.name}</li>
  <li><strong>Datum:</strong> ${formatDateCs(booking.date)} (${booking.date})</li>
  <li><strong>Čas:</strong> ${casOdDo(booking)}</li>
  ${booking.service ? `<li><strong>Služba:</strong> ${booking.service}</li>` : ""}
</ul>`;
}

export function sablonaPotvrzeniKlient(booking: Booking) {
  const predmet = `Potvrzení rezervace na ${formatDateCs(booking.date)}, ${booking.time}`;
  const text = [
    `Dobrý den, ${booking.name},`,
    ``,
    `vaše rezervace masáže je potvrzená.`,
    ``,
    udajeRezervace(booking),
    spolecnaPaticka(),
  ].join("\n");
  const html = `
<p>Dobrý den, ${booking.name},</p>
<p>vaše rezervace masáže je potvrzená.</p>
${udajeRezervaceHtml(booking)}
${spolecnaPatickaHtml()}`;
  return { predmet, text, html };
}

export function sablonaPotvrzeniProvozovatel(booking: Booking) {
  const predmet = `Nová rezervace: ${booking.name}, ${formatDateCs(booking.date)} ${booking.time}`;
  const text = [
    `Nová rezervace`,
    ``,
    udajeRezervace(booking),
    `Telefon: ${booking.phone || "—"}`,
    `E-mail: ${booking.email || "—"}`,
    booking.note && !/zdrav|diagn|bolest/i.test(booking.note)
      ? `Poznámka: ${booking.note}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");
  const html = `
<p><strong>Nová rezervace</strong></p>
${udajeRezervaceHtml(booking)}
<p>Telefon: ${booking.phone || "—"}<br/>E-mail: ${booking.email || "—"}</p>`;
  return { predmet, text, html };
}

export function sablonaZmena(
  booking: Booking,
  stare: { date: string; time: string; durationHours?: number },
) {
  const staryCas = hourBlockLabel(stare.time, stare.durationHours ?? 1);
  const predmet = `Změna termínu na ${formatDateCs(booking.date)}, ${booking.time}`;
  const text = [
    `Dobrý den, ${booking.name},`,
    ``,
    `váš termín masáže se mění.`,
    ``,
    `Původně: ${formatDateCs(stare.date)}, ${staryCas}`,
    `Nově: ${formatDateCs(booking.date)}, ${casOdDo(booking)}`,
    booking.service ? `Služba: ${booking.service}` : null,
    spolecnaPaticka(),
  ]
    .filter(Boolean)
    .join("\n");
  const html = `
<p>Dobrý den, ${booking.name},</p>
<p>váš termín masáže se mění.</p>
<p>Původně: <strong>${formatDateCs(stare.date)}, ${staryCas}</strong><br/>
Nově: <strong>${formatDateCs(booking.date)}, ${casOdDo(booking)}</strong></p>
${booking.service ? `<p>Služba: ${booking.service}</p>` : ""}
${spolecnaPatickaHtml()}`;
  return { predmet, text, html };
}

export function sablonaProdlouzeni(booking: Booking, staryKonec: string) {
  const predmet = `Prodloužení rezervace na ${formatDateCs(booking.date)}`;
  const text = [
    `Dobrý den, ${booking.name},`,
    ``,
    `vaše rezervace se prodlužuje.`,
    ``,
    `Datum: ${formatDateCs(booking.date)} (${booking.date})`,
    `Původní konec: ${staryKonec}`,
    `Nový čas: ${casOdDo(booking)}`,
    spolecnaPaticka(),
  ].join("\n");
  const html = `
<p>Dobrý den, ${booking.name},</p>
<p>vaše rezervace se prodlužuje.</p>
<p>Datum: <strong>${formatDateCs(booking.date)}</strong><br/>
Původní konec: ${staryKonec}<br/>
Nový čas: <strong>${casOdDo(booking)}</strong></p>
${spolecnaPatickaHtml()}`;
  return { predmet, text, html };
}

export function sablonaZruseni(booking: Booking) {
  const predmet = `Zrušení rezervace ${formatDateCs(booking.date)}, ${booking.time}`;
  const text = [
    `Dobrý den, ${booking.name},`,
    ``,
    `vaše rezervace masáže je zrušená.`,
    ``,
    `Původní termín: ${formatDateCs(booking.date)}, ${casOdDo(booking)}`,
    ``,
    `Když budete chtít nový termín, zavolejte na ${site.phoneDisplay}.`,
    spolecnaPaticka(),
  ].join("\n");
  const html = `
<p>Dobrý den, ${booking.name},</p>
<p>vaše rezervace masáže je zrušená.</p>
<p>Původní termín: <strong>${formatDateCs(booking.date)}, ${casOdDo(booking)}</strong></p>
<p>Když budete chtít nový termín, zavolejte na <a href="tel:${site.phoneRaw}">${site.phoneDisplay}</a>.</p>
${spolecnaPatickaHtml()}`;
  return { predmet, text, html };
}

export function sablonaPripominka(booking: Booking) {
  const predmet = `Připomínka: zítra máte masáž v ${booking.time}`;
  const text = [
    `Dobrý den, ${booking.name},`,
    ``,
    `připomínáme, že zítra máte termín masáže.`,
    ``,
    udajeRezervace(booking),
    spolecnaPaticka(),
  ].join("\n");
  const html = `
<p>Dobrý den, ${booking.name},</p>
<p>připomínáme, že zítra máte termín masáže.</p>
${udajeRezervaceHtml(booking)}
${spolecnaPatickaHtml()}`;
  return { predmet, text, html };
}

export function sablonaDenniPrehled(
  items: Booking[],
  denKey: string,
) {
  const predmet = `Zítra máte ${items.length} ${items.length === 1 ? "klienta" : items.length < 5 ? "klienty" : "klientů"} (${formatDateCs(denKey)})`;
  const lines = items.map(
    (b) => `${casOdDo(b)} · ${b.name}${b.phone ? ` · ${b.phone}` : ""}`,
  );
  const text = [`Přehled na ${formatDateCs(denKey)}:`, ``, ...lines].join("\n");
  const html = `
<p><strong>Přehled na ${formatDateCs(denKey)}</strong></p>
<ul style="line-height:1.7">${items
    .map(
      (b) =>
        `<li>${casOdDo(b)} · ${b.name}${b.phone ? ` · ${b.phone}` : ""}</li>`,
    )
    .join("")}</ul>`;
  return { predmet, text, html };
}
