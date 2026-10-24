import { hourBlockLabel } from "@/lib/booking/calendar";
import {
  casOdDo,
  sablonaDenniPrehled,
  sablonaPotvrzeniKlient,
  sablonaPotvrzeniProvozovatel,
  sablonaPripominka,
  sablonaProdlouzeni,
  sablonaZmena,
  sablonaZruseni,
} from "@/lib/booking/email-templates";
import type { Booking } from "@/lib/booking/types";
import { hasConfirmationSent } from "@/lib/booking/types";
import { posliMail, type PosliMailResult } from "@/lib/mail";

function ownerInbox() {
  return (
    process.env.RESEND_KOPIE_PROVOZOVATEL ||
    process.env.RESEND_REPLY_TO ||
    "matylupienski@seznam.cz"
  );
}

export type NotifyKind =
  | "confirm"
  | "change"
  | "extend"
  | "cancel"
  | "update"
  | "reminder";

export type NotifyResult = {
  sent: boolean;
  reason?: string;
  zkusebni?: boolean;
  prijemceOdeslano?: string;
  client?: PosliMailResult;
  owner?: PosliMailResult;
};

/** Importované rezervace bez e-mailu nikdy nic nedostanou. */
export function canEmailClient(booking: Booking) {
  if (booking.zdroj === "import" && !booking.email?.trim()) return false;
  return Boolean(booking.email?.trim());
}

/**
 * Zákazník dostane e-mail o změnách jen když už dřív odešlo potvrzení
 * (web objednávka, nebo admin stiskl Odeslat info), případně u samotného potvrzení.
 */
export function shouldNotifyClient(booking: Booking, kind: NotifyKind) {
  if (!canEmailClient(booking)) return false;
  if (kind === "confirm") return true;
  return hasConfirmationSent(booking);
}

export async function sendBookingNotify(
  booking: Booking,
  kind: NotifyKind = "confirm",
  extra?: {
    oldDate?: string;
    oldTime?: string;
    oldDurationHours?: number;
  },
): Promise<NotifyResult> {
  const results: NotifyResult = { sent: false };

  try {
    if (kind === "confirm" && shouldNotifyClient(booking, kind)) {
      const tpl = sablonaPotvrzeniKlient(booking);
      results.client = await posliMail({
        komu: booking.email,
        predmet: tpl.predmet,
        html: tpl.html,
        text: tpl.text,
        typ: "potvrzeni",
        rezervaceId: booking.id,
      });
    } else if (kind === "change" && shouldNotifyClient(booking, kind)) {
      const tpl = sablonaZmena(booking, {
        date: extra?.oldDate || booking.date,
        time: extra?.oldTime || booking.time,
        durationHours: extra?.oldDurationHours,
      });
      results.client = await posliMail({
        komu: booking.email,
        predmet: tpl.predmet,
        html: tpl.html,
        text: tpl.text,
        typ: "zmena",
        rezervaceId: booking.id,
      });
    } else if (kind === "extend" && shouldNotifyClient(booking, kind)) {
      const oldHours = extra?.oldDurationHours ?? 1;
      const staryKonec =
        hourBlockLabel(booking.time, oldHours).split("–")[1] || booking.time;
      const tpl = sablonaProdlouzeni(booking, staryKonec);
      results.client = await posliMail({
        komu: booking.email,
        predmet: tpl.predmet,
        html: tpl.html,
        text: tpl.text,
        typ: "prodlouzeni",
        rezervaceId: booking.id,
      });
    } else if (kind === "cancel" && shouldNotifyClient(booking, kind)) {
      const tpl = sablonaZruseni(booking);
      results.client = await posliMail({
        komu: booking.email,
        predmet: tpl.predmet,
        html: tpl.html,
        text: tpl.text,
        typ: "zruseni",
        rezervaceId: booking.id,
      });
    } else if (kind === "reminder" && shouldNotifyClient(booking, kind)) {
      const tpl = sablonaPripominka(booking);
      results.client = await posliMail({
        komu: booking.email,
        predmet: tpl.predmet,
        html: tpl.html,
        text: tpl.text,
        typ: "pripominka",
        rezervaceId: booking.id,
      });
    }

    // Provozovatel — vždy souhrn (kromě čistě interních věcí)
    if (kind === "confirm" || kind === "change" || kind === "extend" || kind === "cancel") {
      const ownerTpl =
        kind === "confirm"
          ? sablonaPotvrzeniProvozovatel(booking)
          : kind === "cancel"
            ? {
                predmet: `Zrušení: ${booking.name}, ${booking.date} ${booking.time}`,
                text: sablonaZruseni(booking).text,
                html: sablonaZruseni(booking).html,
              }
            : kind === "extend"
              ? {
                  predmet: `Prodloužení: ${booking.name}, ${casOdDo(booking)}`,
                  text: `Prodloužení rezervace\n${booking.name}\n${booking.date} ${casOdDo(booking)}`,
                  html: `<p>Prodloužení: <strong>${booking.name}</strong>, ${casOdDo(booking)}</p>`,
                }
              : {
                  predmet: `Změna: ${booking.name}, ${booking.date} ${booking.time}`,
                  text: `Změna termínu\n${booking.name}\n${booking.date} ${casOdDo(booking)}`,
                  html: `<p>Změna termínu: <strong>${booking.name}</strong>, ${booking.date} ${casOdDo(booking)}</p>`,
                };

      const typ =
        kind === "confirm"
          ? "potvrzeni"
          : kind === "cancel"
            ? "zruseni"
            : kind === "extend"
              ? "prodlouzeni"
              : "zmena";

      results.owner = await posliMail({
        komu: ownerInbox(),
        predmet: ownerTpl.predmet,
        html: ownerTpl.html,
        text: ownerTpl.text,
        typ,
        rezervaceId: booking.id,
      });
    }

    results.sent = Boolean(results.client?.ok || results.owner?.ok);
    results.zkusebni = results.client?.zkusebni || results.owner?.zkusebni;
    results.prijemceOdeslano =
      results.client?.prijemceOdeslano || results.owner?.prijemceOdeslano;
    if (!results.sent) {
      results.reason =
        results.client?.chyba ||
        results.owner?.chyba ||
        (!canEmailClient(booking) ? "missing_client_email" : "send_failed");
    }
  } catch (err) {
    console.error("[booking-email] unexpected", err);
    results.reason = "send_failed";
  }

  return results;
}

export async function sendBookingEmails(booking: Booking) {
  return sendBookingNotify(booking, "confirm");
}

export async function sendCancelEmails(booking: Booking) {
  return sendBookingNotify(booking, "cancel");
}

export async function sendOwnerPhoneSummary(booking: Booking) {
  const tpl = sablonaPotvrzeniProvozovatel(booking);
  return posliMail({
    komu: ownerInbox(),
    predmet: `Telefonická rezervace: ${booking.name || "bez jména"}, ${booking.date} ${booking.time}`,
    html: tpl.html,
    text: tpl.text,
    typ: "potvrzeni",
    rezervaceId: booking.id,
  });
}

export async function sendDailyOverview(bookings: Booking[], dayKey: string) {
  const tpl = sablonaDenniPrehled(bookings, dayKey);
  return posliMail({
    komu: ownerInbox(),
    predmet: tpl.predmet,
    html: tpl.html,
    text: tpl.text,
    typ: "prehled",
    rezervaceId: `prehled-${dayKey}`,
  });
}
