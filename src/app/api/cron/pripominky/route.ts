import { NextResponse } from "next/server";
import { sendBookingNotify } from "@/lib/booking/email";
import { loadStore } from "@/lib/booking/store";
import { hasConfirmationSent, isBookingActive } from "@/lib/booking/types";

function assertCron(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization") || "";
  return auth === `Bearer ${secret}`;
}

/** Prague-local Date parts from a UTC instant. */
function pragueParts(d: Date) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Prague",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(d).map((p) => [p.type, p.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

function bookingStartUtc(date: string, time: string) {
  // Interpret wall time in Prague as absolute by using a fixed offset approximation
  // via Temporal-less approach: construct as Prague local via toLocale trick.
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  // Create a date that when formatted in Prague equals the desired local time.
  // Iterate from a UTC guess.
  let guess = Date.UTC(y, m - 1, d, hh - 1, mm); // CET baseline
  for (let i = 0; i < 4; i++) {
    const p = pragueParts(new Date(guess));
    const want = hh * 60 + mm;
    const diff = want - p.minutes + (date !== p.date ? (date > p.date ? 1440 : -1440) : 0);
    guess += diff * 60_000;
  }
  return guess;
}

export async function GET(request: Request) {
  if (!assertCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const windowStart = now + 24 * 60 * 60_000;
  const windowEnd = windowStart + 15 * 60_000;

  const store = await loadStore();
  let sent = 0;

  for (const b of store.bookings) {
    if (!isBookingActive(b)) continue;
    if (!hasConfirmationSent(b)) continue;
    if (!b.email?.trim()) continue;
    if (b.zdroj === "import" && !b.email.trim()) continue;

    const already = store.emailLog?.some(
      (e) => e.rezervaceId === b.id && e.typ === "pripominka" && e.stav === "ok",
    );
    if (already) continue;

    const start = bookingStartUtc(b.date, b.time);
    if (start < windowStart || start >= windowEnd) continue;

    const result = await sendBookingNotify(b, "reminder");
    if (result.sent) sent += 1;
  }

  return NextResponse.json({ ok: true, sent });
}
