import { NextResponse } from "next/server";
import { sendDailyOverview } from "@/lib/booking/email";
import { loadStore } from "@/lib/booking/store";
import { isBookingActive } from "@/lib/booking/types";

function assertCron(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization") || "";
  return auth === `Bearer ${secret}`;
}

function pragueNow() {
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
    fmt.formatToParts(new Date()).map((p) => [p.type, p.value]),
  );
  return {
    hour: Number(parts.hour),
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
  };
}

function addDays(dateKey: string, days: number) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d + days);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export async function GET(request: Request) {
  if (!assertCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { hour, dateKey } = pragueNow();
  if (hour !== 7) {
    return NextResponse.json({ ok: true, skipped: true, reason: "not_7am_prague" });
  }

  const tomorrow = addDays(dateKey, 1);
  const store = await loadStore();

  const already = store.emailLog?.some(
    (e) => e.rezervaceId === `prehled-${tomorrow}` && e.typ === "prehled" && e.stav === "ok",
  );
  if (already) {
    return NextResponse.json({ ok: true, skipped: true, reason: "already_sent" });
  }

  const items = store.bookings
    .filter((b) => isBookingActive(b) && b.date === tomorrow)
    .sort((a, b) => a.time.localeCompare(b.time));

  if (items.length === 0) {
    return NextResponse.json({ ok: true, skipped: true, reason: "no_bookings" });
  }

  const result = await sendDailyOverview(items, tomorrow);
  return NextResponse.json({ ok: true, sent: result.ok, count: items.length });
}
