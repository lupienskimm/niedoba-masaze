"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

const DAY_ROWS = [
  { key: 1, label: "Pondělí" },
  { key: 2, label: "Úterý" },
  { key: 3, label: "Středa" },
  { key: 4, label: "Čtvrtek" },
  { key: 5, label: "Pátek" },
  { key: 6, label: "Sobota" },
  { key: 0, label: "Neděle" },
] as const;

const OPEN_MIN = 8 * 60;
const CLOSE_MIN = 18 * 60;

function pragueParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Prague",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value || "";
  const weekdayMap: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 0,
  };
  const weekday = weekdayMap[get("weekday")] ?? now.getDay();
  const hour = Number(get("hour"));
  const minute = Number(get("minute"));
  return {
    weekday,
    minutes: hour * 60 + minute,
    label: new Intl.DateTimeFormat("cs-CZ", {
      timeZone: "Europe/Prague",
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(now),
  };
}

function isOpenNow(weekday: number, minutes: number) {
  // Po–Ne 8:00–18:00
  void weekday;
  return minutes >= OPEN_MIN && minutes < CLOSE_MIN;
}

export function OpeningHoursLive() {
  const [status, setStatus] = useState<{
    open: boolean;
    weekday: number;
    label: string;
  } | null>(null);

  useEffect(() => {
    const tick = () => {
      const p = pragueParts();
      setStatus({
        open: isOpenNow(p.weekday, p.minutes),
        weekday: p.weekday,
        label: p.label,
      });
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="hours-live">
      <div className="hours-live__head">
        <h2 className="hours-live__title">Otevírací doba</h2>
        {status ? (
          <p
            className={`hours-live__badge${status.open ? " is-open" : " is-closed"}`}
            aria-live="polite"
          >
            {status.open ? "Teď otevřeno" : "Teď zavřeno"}
            <span className="hours-live__badge-day"> · {status.label}</span>
          </p>
        ) : (
          <p className="hours-live__badge hours-live__badge--pending">…</p>
        )}
      </div>

      <table className="hours-live__table">
        <caption className="sr-only">Týdenní otevírací doba</caption>
        <tbody>
          {DAY_ROWS.map((row) => {
            const isToday = status?.weekday === row.key;
            return (
              <tr
                key={row.key}
                className={isToday ? "is-today" : undefined}
              >
                <th scope="row">{row.label}</th>
                <td>8:00 – 18:00</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="hours-live__note">{site.openingNote}</p>
      <p className="hours-live__note muted">
        Mimo otevírací dobu po telefonické domluvě.
      </p>
    </div>
  );
}
