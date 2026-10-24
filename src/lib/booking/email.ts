import { hourBlockLabel } from "@/lib/booking/calendar";
import type { Booking } from "@/lib/booking/types";
import { site } from "@/content/site";

/** Stub for Resend — sends only when RESEND_API_KEY is set. */
export async function sendBookingEmails(booking: Booking) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[booking-email] RESEND_API_KEY missing — skip send", {
      bookingId: booking.id,
      email: booking.email,
    });
    return { sent: false as const, reason: "missing_api_key" as const };
  }

  // Wired later: Resend client. Payload prepared for client + owner.
  const payload = {
    toClient: {
      to: booking.email,
      subject: `Potvrzení rezervace – ${site.name}`,
      text: [
        `Dobrý den, ${booking.name},`,
        ``,
        `Vaše rezervace masáže je potvrzena.`,
        `Datum: ${booking.date}`,
        `Čas: ${hourBlockLabel(booking.time)} (celá hodina)`,
        booking.service ? `Služba: ${booking.service}` : null,
        ``,
        `Provozovna: ${site.address}`,
        `Telefon: ${site.phoneDisplay}`,
      ]
        .filter(Boolean)
        .join("\n"),
    },
    toOwner: {
      to: site.email,
      subject: `Nová rezervace – ${booking.date} ${hourBlockLabel(booking.time)}`,
      text: [
        `Nová rezervace:`,
        `Jméno: ${booking.name}`,
        `E-mail: ${booking.email}`,
        `Telefon: ${booking.phone}`,
        `Datum: ${booking.date}`,
        `Čas: ${hourBlockLabel(booking.time)} (celá hodina)`,
        booking.service ? `Služba: ${booking.service}` : null,
        booking.note ? `Poznámka: ${booking.note}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    },
  };

  console.info("[booking-email] Resend ready, payload prepared", {
    bookingId: booking.id,
    hasKey: true,
    payload,
  });
  return { sent: false as const, reason: "resend_not_wired" as const };
}

export async function sendCancelEmails(booking: Booking) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[booking-email] cancel skipped — no RESEND_API_KEY", booking.id);
    return;
  }
  console.info("[booking-email] cancel notify stub", booking.id);
}
