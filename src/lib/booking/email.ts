import { Resend } from "resend";
import { hourBlockLabel } from "@/lib/booking/calendar";
import type { Booking } from "@/lib/booking/types";
import { site } from "@/content/site";

export type NotifyKind =
  | "confirm"
  | "change"
  | "extend"
  | "cancel"
  | "update";

function resendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function fromAddress() {
  return (
    process.env.RESEND_FROM ||
    `Masáže Niedoba <${site.email}>`
  );
}

function blockRange(booking: Booking) {
  const hours = Math.max(1, booking.durationHours ?? 1);
  if (hours === 1) return `${hourBlockLabel(booking.time)} (celá hodina)`;
  const [hRaw, mRaw = "00"] = booking.time.split(":");
  const h = Number(hRaw);
  const end = `${String(h + hours).padStart(2, "0")}:${mRaw.padStart(2, "0")}`;
  return `${booking.time}–${end} (${hours} hod.)`;
}

function subjectFor(kind: NotifyKind, booking: Booking) {
  const when = `${booking.date} ${blockRange(booking)}`;
  switch (kind) {
    case "confirm":
      return `Potvrzení rezervace – ${site.name}`;
    case "change":
      return `Změna termínu – ${site.name}`;
    case "extend":
      return `Prodloužení rezervace – ${site.name}`;
    case "cancel":
      return `Zrušení rezervace – ${site.name}`;
    default:
      return `Aktualizace rezervace – ${when}`;
  }
}

function clientBody(kind: NotifyKind, booking: Booking) {
  const lines: Array<string | null> = [
    `Dobrý den, ${booking.name},`,
    ``,
  ];

  switch (kind) {
    case "confirm":
      lines.push(`Vaše rezervace masáže je potvrzena.`);
      break;
    case "change":
      lines.push(`Váš termín masáže byl změněn. Aktuální údaje:`);
      break;
    case "extend":
      lines.push(`Vaše rezervace byla prodloužena. Aktuální údaje:`);
      break;
    case "cancel":
      lines.push(`Vaše rezervace masáže byla zrušena.`);
      break;
    default:
      lines.push(`Vaše rezervace byla aktualizována:`);
  }

  if (kind !== "cancel") {
    lines.push(
      `Datum: ${booking.date}`,
      `Čas: ${blockRange(booking)}`,
      booking.service ? `Služba: ${booking.service}` : null,
    );
  } else {
    lines.push(
      `Původní termín: ${booking.date} · ${blockRange(booking)}`,
      booking.service ? `Služba: ${booking.service}` : null,
    );
  }

  lines.push(
    ``,
    `Provozovna: ${site.address}`,
    `Telefon: ${site.phoneDisplay}`,
    `E-mail: ${site.email}`,
    ``,
    `O všech změnách termínu vás budeme informovat e-mailem.`,
  );

  return lines.filter(Boolean).join("\n");
}

function ownerBody(kind: NotifyKind, booking: Booking) {
  const label =
    kind === "confirm"
      ? "Nová / odeslaná rezervace"
      : kind === "change"
        ? "Změna termínu"
        : kind === "extend"
          ? "Prodloužení"
          : kind === "cancel"
            ? "Zrušení rezervace"
            : "Aktualizace rezervace";

  return [
    `${label}:`,
    `Jméno: ${booking.name}`,
    `E-mail: ${booking.email || "—"}`,
    `Telefon: ${booking.phone || "—"}`,
    `Datum: ${booking.date}`,
    `Čas: ${blockRange(booking)}`,
    booking.service ? `Služba: ${booking.service}` : null,
    booking.note ? `Poznámka: ${booking.note}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendBookingNotify(
  booking: Booking,
  kind: NotifyKind = "confirm",
) {
  const resend = resendClient();
  if (!resend) {
    console.info("[booking-email] RESEND_API_KEY missing — skip", {
      bookingId: booking.id,
      kind,
    });
    return { sent: false as const, reason: "missing_api_key" as const };
  }

  const toClient = booking.email?.trim();
  if (!toClient) {
    return { sent: false as const, reason: "missing_client_email" as const };
  }

  try {
    const subject = subjectFor(kind, booking);
    await resend.emails.send({
      from: fromAddress(),
      to: toClient,
      subject,
      text: clientBody(kind, booking),
    });

    // Owner copy (best-effort)
    try {
      await resend.emails.send({
        from: fromAddress(),
        to: site.email,
        subject: `${subjectFor(kind, booking)} (kopie)`,
        text: ownerBody(kind, booking),
      });
    } catch (err) {
      console.error("[booking-email] owner copy failed", err);
    }

    return { sent: true as const };
  } catch (err) {
    console.error("[booking-email] send failed", err);
    return { sent: false as const, reason: "send_failed" as const };
  }
}

/** @deprecated use sendBookingNotify(..., "confirm") */
export async function sendBookingEmails(booking: Booking) {
  return sendBookingNotify(booking, "confirm");
}

/** @deprecated use sendBookingNotify(..., "cancel") */
export async function sendCancelEmails(booking: Booking) {
  await sendBookingNotify(booking, "cancel");
}
